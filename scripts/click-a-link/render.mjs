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
const root=fileURLToPath(new URL('../../',import.meta.url)),out=path.join(root,'out/click-a-link'),cache=path.join(root,'.cache/click-a-link');
const prefix='what-happens-when-you-click-a-link';
const prototype=process.argv.includes('--prototype'),full=process.argv.includes('--full'),serve=process.argv.includes('--serve');
await fs.mkdir(path.join(cache,'style'),{recursive:true});await fs.mkdir(out,{recursive:true});
const run=(bin,args)=>{const r=spawnSync(bin,args,{cwd:root,encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr||r.stdout);return r.stdout;};
const ff=args=>run('ffmpeg',['-hide_banner','-loglevel','warning','-y',...args]);
const sha=b=>createHash('sha256').update(b).digest('hex');
const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');let executable;
for(const dir of(await fs.readdir(base)).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}))){for(const rel of['chrome-headless-shell-win64/headless_shell.exe','chrome-win64/chrome.exe']){const p=path.join(base,dir,rel);if(!executable&&await fs.stat(p).catch(()=>null))executable=p;}}
if(!executable)throw Error('Installed Chromium required');
await build({absWorkingDir:root,entryPoints:['scripts/click-a-link/preview.ts'],bundle:true,outdir:cache,format:'iife',platform:'browser',loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]',minify:true});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><title>Click Link Journey</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1920px;height:1080px;overflow:hidden;background:#0B1220}svg{display:block}</style></head><body><main id="root"></main><script src="/preview.js"></script></body></html>');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost').pathname,f=path.resolve(cache,'.'+(u==='/'?'/index.html':decodeURIComponent(u)));if(!f.startsWith(cache+path.sep))throw Error('outside cache');res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(r=>server.listen(serve?3099:0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}`;
if(serve){console.log(`Seek preview ${url}, await window.seek(seconds)`);}else{let browser;try{
 browser=await chromium.launch({executablePath:executable,headless:true,args:['--force-color-profile=srgb']});const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(url);await page.evaluate(()=>window.ready);
 const capture=async(t,target)=>{await page.evaluate(t=>window.seek(t),t);const b=await page.screenshot({type:'png',animations:'disabled'});if(target)await fs.writeFile(target,b);return b;};
 const original=await capture(23.7);await capture(.1);await capture(28.8);const repeat=await capture(23.7);if(sha(original)!==sha(repeat))throw Error('Out of order seek mismatch');
 const times=[1.6,4.5,8.85,12.8,15.7,20.8,25.5,29.2,2.85,5.9,9.9,13.9,17.9,21.9,26.9,27.8],overflow=[];
 for(let i=0;i<times.length;i++){await capture(times[i],path.join(cache,'style',String(i).padStart(2,'0')+'.png'));if(i<8){const bad=await page.evaluate(()=>Array.from(document.querySelectorAll('text')).filter(el=>{let o=1;for(let p=el;p;p=p.parentElement)o*=Number(getComputedStyle(p).opacity);const b=el.getBoundingClientRect();return o>.05&&b.width>0&&(b.left<65||b.right>1855||b.top<35||b.bottom>1045);}).map(el=>el.textContent));if(bad.length)overflow.push({time:times[i],bad});}}
 const fonts=await page.evaluate(()=>({space:document.fonts.check('700 80px "Space Grotesk"'),mono:document.fonts.check('500 24px "IBM Plex Mono"')}));
 ff(['-framerate','1','-i',path.join(cache,'style/%02d.png'),'-vf','scale=480:270,tile=4x4','-frames:v','1',path.join(out,`${prefix}-contact-sheet.png`)]);
 for(const[i,name]of['click','url','dns','connection','request','response','render','final'].entries())await fs.copyFile(path.join(cache,'style',String(i).padStart(2,'0')+'.png'),path.join(out,`style-${name}.png`));
 await fs.writeFile(path.join(out,'style-qc.json'),JSON.stringify({seekSafe:true,errors,overflow,fonts,times},null,2));
 if(errors.length||overflow.length||!fonts.space||!fonts.mono)throw Error(JSON.stringify({errors,overflow,fonts}));console.log('16 style frames, fonts, text margins, pixel seek consistency PASS');await browser.close();browser=null;server.close();
 if(prototype||full){if(full){const gate=JSON.parse(await fs.readFile(path.join(out,'prototype-report.json'),'utf8'));if(gate.frames!==600)throw Error('First render 600-frame prototype');}
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),outDir:path.join(cache,'bundle'),publicDir:path.join(root,'public')});const composition=await selectComposition({serveUrl,id:'ClickALink',browserExecutable:executable,chromiumOptions:{gl:'angle'}});
 const frames=prototype?600:1800,target=path.join(out,prototype?'prototype.mp4':`${prefix}-final.mp4`);let last=-1;
 await renderMedia({serveUrl,composition,codec:'h264',outputLocation:target,browserExecutable:executable,frameRange:[0,frames-1],pixelFormat:'yuv420p',crf:prototype?22:17,x264Preset:'medium',audioCodec:'aac',audioBitrate:'320k',audioSampleRate:48000,colorSpace:'bt709',imageFormat:'png',concurrency:4,chromiumOptions:{gl:'angle'},onProgress:({progress})=>{const p=Math.floor(progress*10);if(p!==last){last=p;console.log(`Remotion ${p*10}%`);}}});
 const exact=target.replace('.mp4','-exact.mp4');ff(['-i',target,'-i',path.join(root,'public/click-a-link/audio/soundtrack.wav'),'-map','0:v:0','-map','1:a:0','-t',prototype?'10':'30','-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',exact]);await fs.rename(exact,target);
 const metadata=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',target]));await fs.writeFile(path.join(out,prototype?'prototype-report.json':'render-report.json'),JSON.stringify({frames,renderer:'Remotion',seekSafe:true,metadata},null,2));
 if(full){ff(['-i',target,'-vf','scale=960:540','-t','30','-c:v','libx264','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',path.join(out,`${prefix}-preview.mp4`)]);ff(['-ss','29.983333','-i',target,'-frames:v','1',path.join(out,'thumbnail.png')]);}
 console.log(`Rendered ${frames} frames: ${target}`);
 }
}finally{if(browser)await browser.close();server.close();}}
