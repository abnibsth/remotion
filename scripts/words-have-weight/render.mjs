import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=path.join(root,'out/words-have-weight'),cache=path.join(root,'.cache/words-have-weight');
const prototype=process.argv.includes('--prototype'),full=process.argv.includes('--full'),serve=process.argv.includes('--serve');
await fs.mkdir(path.join(cache,'style'),{recursive:true});await fs.mkdir(out,{recursive:true});
const run=(bin,args)=>{const r=spawnSync(bin,args,{cwd:root,encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr||r.stdout);return r.stdout;};
const ff=args=>run('ffmpeg',['-hide_banner','-loglevel','warning','-y',...args]);
const sha=b=>createHash('sha256').update(b).digest('hex');
const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');let executable;for(const dir of(await fs.readdir(base)).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})))for(const rel of['chrome-headless-shell-win64/headless_shell.exe','chrome-win64/chrome.exe']){const p=path.join(base,dir,rel);if(!executable&&await fs.stat(p).catch(()=>null))executable=p;}if(!executable)throw Error('Installed Chromium required');
await build({absWorkingDir:root,entryPoints:['scripts/words-have-weight/preview.ts'],bundle:true,outdir:cache,format:'iife',platform:'browser',loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]',minify:true});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><title>Words Have Weight</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1080px;height:1920px;overflow:hidden;background:#F3EFE7}svg{display:block}</style></head><body><main id="root"></main><script src="/preview.js"></script></body></html>');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost').pathname,f=path.resolve(cache,'.'+(u==='/'?'/index.html':decodeURIComponent(u)));if(!f.startsWith(cache+path.sep))throw Error('outside cache');res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(r=>server.listen(serve?3100:0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
if(serve){console.log(`Seek preview ${url}, await window.seek(seconds)`);}else{let browser;try{
 browser=await chromium.launch({executablePath:executable,headless:true,args:['--force-color-profile=srgb']});const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(url);await page.evaluate(()=>window.ready);
 const capture=async(t,target)=>{await page.evaluate(t=>window.seek(t),t);const b=await page.screenshot({type:'png',animations:'disabled'});if(target)await fs.writeFile(target,b);return b;};
 const original=await capture(15.7);await capture(.1);await capture(19.9);const repeat=await capture(15.7);if(sha(original)!==sha(repeat))throw Error('Out-of-order pixel seek mismatch');
 const times=[0,1,2,3.5,5,6.5,8,9.5,11,12.5,14,15.5,17,18.5,19.5];
 for(let i=0;i<times.length;i++)await capture(times[i],path.join(cache,'style',String(i).padStart(2,'0')+'.png'));
 ff(['-framerate','1','-i',path.join(cache,'style/%02d.png'),'-vf','scale=216:384,tile=5x3','-frames:v','1',path.join(out,'words-have-weight-contact-sheet.png')]);
 const styleTimes=[3.5,6.5,9.5,12.5,15,19.5],names=['heavy','light','fast','slow','elastic','final'],overflow=[];
 for(let i=0;i<styleTimes.length;i++){await capture(styleTimes[i],path.join(out,`style-${names[i]}.png`));const bad=await page.evaluate(()=>Array.from(document.querySelectorAll('text,[data-word]')).filter(el=>{let o=1;for(let p=el;p;p=p.parentElement)o*=Number(getComputedStyle(p).opacity);const b=el.getBoundingClientRect();return o>.1&&b.width>0&&(b.left<65||b.right>975||b.top<115||b.bottom>1550);}).map(el=>el.getAttribute('data-word')||el.textContent));if(bad.length)overflow.push({t:styleTimes[i],bad});}
 const fonts=await page.evaluate(()=>({bold:document.fonts.check('700 80px "Space Grotesk"'),light:document.fonts.check('300 160px "Space Grotesk"'),mono:document.fonts.check('500 24px "IBM Plex Mono"')}));
 await fs.writeFile(path.join(out,'style-qc.json'),JSON.stringify({seekSafe:true,errors,overflow,fonts,times},null,2));if(errors.length||overflow.length||Object.values(fonts).includes(false))throw Error(JSON.stringify({errors,overflow,fonts}));console.log('15 contact frames, 6 style frames; fonts, safe margins, seek pixels PASS');await browser.close();browser=null;server.close();
 if(prototype||full){if(full){const gate=JSON.parse(await fs.readFile(path.join(out,'prototype-report.json'),'utf8'));if(gate.frames!==480)throw Error('Render first 480-frame prototype');}
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),outDir:path.join(cache,'bundle'),publicDir:path.join(root,'public')});const composition=await selectComposition({serveUrl,id:'WordsHaveWeight',browserExecutable:executable,chromiumOptions:{gl:'angle'}});
 const frames=prototype?480:1200,target=path.join(out,prototype?'words-have-weight-prototype.mp4':'words-have-weight-final.mp4');let last=-1;
 await renderMedia({serveUrl,composition,codec:'h264',outputLocation:target,browserExecutable:executable,frameRange:[0,frames-1],pixelFormat:'yuv420p',crf:prototype?21:17,x264Preset:'medium',audioCodec:'aac',audioBitrate:'320k',audioSampleRate:48000,colorSpace:'bt709',imageFormat:'png',concurrency:4,chromiumOptions:{gl:'angle'},onProgress:({progress})=>{const p=Math.floor(progress*10);if(p!==last){last=p;console.log(`Remotion ${p*10}%`);}}});
 const exact=target.replace('.mp4','-exact.mp4');ff(['-i',target,'-i',path.join(root,'public/words-have-weight/audio/soundtrack.wav'),'-map','0:v:0','-map','1:a:0','-t',prototype?'8':'20','-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',exact]);await fs.rename(exact,target);
 const metadata=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',target]));await fs.writeFile(path.join(out,prototype?'prototype-report.json':'render-report.json'),JSON.stringify({frames,renderer:'Remotion',seekSafe:true,metadata},null,2));
 if(full){ff(['-i',target,'-vf','scale=540:960','-t','20','-c:v','libx264','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',path.join(out,'words-have-weight-preview.mp4')]);ff(['-ss','19.983333','-i',target,'-frames:v','1',path.join(out,'thumbnail.png')]);}console.log(`Rendered ${frames} frames: ${target}`);
 }
}finally{if(browser)await browser.close();server.close();}}
