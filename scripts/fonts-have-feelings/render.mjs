import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const out=path.resolve('out/fonts-have-feelings'),cache=path.resolve('.cache/fonts-have-feelings');
await fs.mkdir(path.join(cache,'style'),{recursive:true});await fs.mkdir(out,{recursive:true});
const full=process.argv.includes('--full'),prototype=process.argv.includes('--prototype'),serve=process.argv.includes('--serve');
export const run=(bin,args)=>{const r=spawnSync(bin,args,{encoding:'utf8',windowsHide:true,maxBuffer:30*1024*1024});if(r.status!==0)throw Error(r.stderr||r.stdout);return r.stdout;};
const ff=args=>run('ffmpeg',['-hide_banner','-loglevel','warning','-y',...args]);
const sha=b=>createHash('sha256').update(b).digest('hex');
const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');let executable;
for(const d of(await fs.readdir(base)).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})))for(const rel of ['chrome-headless-shell-win64/headless_shell.exe','chrome-win64/chrome.exe']){const p=path.join(base,d,rel);if(!executable&&await fs.stat(p).catch(()=>null))executable=p;}
await build({entryPoints:['scripts/fonts-have-feelings/preview.ts'],outdir:cache,bundle:true,format:'iife',platform:'browser',loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]'});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><title>Fonts Have Feelings</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1080px;height:1920px;overflow:hidden;background:#F5F1E8}svg{display:block}</style></head><body><div id="root"></div><script src="/preview.js"></script></body></html>');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost').pathname,f=path.resolve(cache,'.'+(u==='/'?'/index.html':decodeURIComponent(u)));if(!f.startsWith(cache+path.sep))throw Error('outside cache');res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(serve?3106:0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`;
if(serve){console.log(`Deterministic preview ${url} — await window.seek(seconds)`);}else{
 let browser;
 try{
  browser=await chromium.launch({executablePath:executable,headless:true,args:['--force-color-profile=srgb']});
  const p=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  const errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(url);await p.evaluate(()=>window.ready);
  const shot=async(t,file)=>{await p.evaluate(t=>window.seek(t),t);const b=await p.screenshot({type:'png',animations:'disabled'});if(file)await fs.writeFile(file,b);return b;};
  const start=await shot(0),end=await shot(20);if(sha(start)!==sha(end))throw Error('Loop endpoint pixels differ');const a=await shot(12.8);await shot(1.9);await shot(19.2);const b=await shot(12.8);if(sha(a)!==sha(b))throw Error('Random seek not deterministic');
  const times=[1.4,4.65,7.5,10.6,13.7,17.1,19.8];
  for(let i=0;i<times.length;i++)await shot(times[i],path.join(cache,'style',`${String(i).padStart(2,'0')}.png`));
  ff(['-framerate','1','-i',path.join(cache,'style/%02d.png'),'-vf','scale=270:480,tile=7x1','-frames:v','1',path.join(out,'fonts-have-feelings-contact-sheet.png')]);
  const fonts=await p.evaluate(()=>({display:document.fonts.check('400 200px "Archivo Black"'),mono:document.fonts.check('500 30px "IBM Plex Mono"'),italic:document.fonts.check('italic 800 200px "Inter Tight"'),serif:document.fonts.check('500 200px "Cormorant Garamond"')}));
  const holds=await p.evaluate(async()=>{const failures=[];for(const t of [1.4,4.65,7.5,10.6,13.7,17.1]){await window.seek(t);for(const el of document.querySelectorAll('text[data-key]')){let opacity=1;for(let x=el;x;x=x.parentElement)opacity*=Number(getComputedStyle(x).opacity);if(opacity<.2)continue;const r=el.getBoundingClientRect();if(r.left<60||r.right>960||r.top<150||r.bottom>1620)failures.push({t,text:el.textContent,left:r.left,right:r.right,top:r.top,bottom:r.bottom});}}return failures;});
  const finite=await p.evaluate(async()=>{const bad=[];for(let f=0;f<1200;f++){await window.seek(f/60);const svg=document.querySelector('svg').outerHTML;if(/NaN|Infinity|undefined/.test(svg))bad.push(f);}return bad;});
  const qc={deterministicSeek:true,loopPixelsIdentical:true,fonts,errors,holdOverflow:holds,invalidFrames:finite,times};
  await fs.writeFile(path.join(out,'style-qc.json'),JSON.stringify(qc,null,2));
  if(errors.length||finite.length||!fonts.display||!fonts.mono)throw Error(JSON.stringify(qc));
  console.log('Styles ready. Hold layout findings:',JSON.stringify(holds));
  await browser.close();browser=null;server.close();
  if(full||prototype){
   if(full){const report=JSON.parse(await fs.readFile(path.join(out,'prototype-report.json'),'utf8'));if(report.frames!==540||!report.decoded)throw Error('Verified prototype required');}
   const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:path.join(cache,'bundle'),publicDir:path.resolve('public')});
   const opts={serveUrl,browserExecutable:executable,chromiumOptions:{gl:'angle'}};
   const composition=await selectComposition({...opts,id:'FontsHaveFeelings'}),frames=prototype?540:1200,target=path.join(out,prototype?'fonts-have-feelings-prototype.mp4':'fonts-have-feelings-final.mp4');
   let last=-1;
   await renderMedia({...opts,composition,codec:'h264',outputLocation:target,frameRange:[0,frames-1],pixelFormat:'yuv420p',crf:prototype?21:17,x264Preset:'medium',audioCodec:'aac',audioBitrate:'320k',audioSampleRate:48000,imageFormat:'jpeg',jpegQuality:95,concurrency:1,onProgress:({progress})=>{const q=Math.floor(progress*10);if(q!==last){last=q;console.log('Render',q*10+'%');}}});
   const exact=target.replace('.mp4','-exact.mp4');
   ff(['-i',target,'-i',path.resolve('public/fonts-have-feelings/audio/mix.wav'),'-map','0:v:0','-map','1:a:0','-t',prototype?'9':'20','-vf','scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-crf','17','-preset','medium','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',exact]);
   await fs.rename(exact,target);
   const metadata=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',target]));
   const v=metadata.streams.find(s=>s.codec_type==='video'),audio=metadata.streams.find(s=>s.codec_type==='audio');
   if(v.nb_read_frames!==String(frames)||v.width!==1080||v.height!==1920||v.r_frame_rate!=='60/1'||v.codec_name!=='h264'||audio.codec_name!=='aac'||audio.sample_rate!=='48000'||Number(metadata.format.duration)!==frames/60)throw Error('Metadata mismatch');
   ff(['-v','error','-i',target,'-f','null','-']);
   await fs.writeFile(path.join(out,prototype?'prototype-report.json':'render-report.json'),JSON.stringify({frames,decoded:true,metadata},null,2));
   console.log('Verified H.264/AAC export:',target);
  }
 }finally{if(browser)await browser.close();server.close();}
}
