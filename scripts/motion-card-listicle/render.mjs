import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const out=path.join(root,'out/motion-card-listicle');
const cache=path.join(root,'.cache/motion-card-listicle');
const prototype=process.argv.includes('--prototype'),full=process.argv.includes('--full'),serve=process.argv.includes('--serve');
await fs.mkdir(out,{recursive:true});await fs.mkdir(path.join(cache,'style'),{recursive:true});
const run=(bin,args)=>{const r=spawnSync(bin,args,{cwd:root,encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr||r.stdout);return r.stdout;};
const ff=args=>run('ffmpeg',['-hide_banner','-loglevel','warning','-y',...args]);
const sha=b=>createHash('sha256').update(b).digest('hex');
async function browserPath(){const candidates=[process.env.CHROME_PATH];const base=path.join(process.env.LOCALAPPDATA||os.homedir(),'ms-playwright');for(const d of(await fs.readdir(base).catch(()=>[])).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})))for(const rel of['chrome-headless-shell-win64/headless_shell.exe','chrome-win64/chrome.exe'])candidates.push(path.join(base,d,rel));for(const p of candidates.filter(Boolean))if(await fs.stat(p).then(s=>s.isFile()).catch(()=>false))return p;throw Error('No installed Chromium browser');}
const executable=await browserPath();
await build({absWorkingDir:root,entryPoints:['scripts/motion-card-listicle/preview.ts'],bundle:true,outdir:cache,format:'iife',platform:'browser',loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]',minify:true});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><title>Motion Principles Preview</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1080px;height:1920px;overflow:hidden;background:#F4F0E7}svg{display:block}</style></head><body><main id="root"></main><script src="/preview.js"></script></body></html>');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost').pathname;const f=path.resolve(cache,'.'+(u==='/'?'/index.html':decodeURIComponent(u)));if(!f.startsWith(cache+path.sep))throw Error('outside cache');res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(r=>server.listen(serve?3098:0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`;
if(serve){console.log(`Seek preview ${url} / window.seek(t)`);}else{
 let browser;
 try{
 browser=await chromium.launch({executablePath:executable,headless:true,args:['--force-color-profile=srgb']});
 const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(url);await page.evaluate(()=>window.ready);
 const capture=async(t,target)=>{await page.evaluate(t=>window.seek(t),t);const b=await page.screenshot({type:'png',animations:'disabled'});if(target)await fs.writeFile(target,b);return b;};
 const a=await capture(16.4);await capture(.1);await capture(24.9);const b=await capture(16.4);if(sha(a)!==sha(b))throw Error('Seek determinism failed');
 const times=[1.6,4.1,7.75,11.64,16.65,20.1,24.9,6.25,10.3,14.38,18.25,22.45];
 const overflow=[];
 for(let i=0;i<times.length;i++){await capture(times[i],path.join(cache,'style',`${String(i).padStart(2,'0')}.png`));const bad=await page.evaluate(()=>Array.from(document.querySelectorAll('text')).filter(el=>{const b=el.getBoundingClientRect();let opacity=1;for(let p=el;p;p=p.parentElement)opacity*=Number(getComputedStyle(p).opacity);return opacity>.05&&b.width>0&&(b.left<65||b.right>1015||b.top<105||b.bottom>1710);}).map(el=>el.textContent));if(i<7&&bad.length)overflow.push({time:times[i],bad});}
 ff(['-framerate','1','-i',path.join(cache,'style/%02d.png'),'-vf','scale=270:480,tile=6x2','-frames:v','1',path.join(out,'motion-card-listicle-contact-sheet.png')]);
 for(const[i,name]of['opening','easing','anticipation','squash-stretch','follow-through','timing','final'].entries())await fs.copyFile(path.join(cache,'style',`${String(i).padStart(2,'0')}.png`),path.join(out,`style-${name}.png`));
 await fs.writeFile(path.join(out,'style-qc.json'),JSON.stringify({seekSafe:sha(a)===sha(b),browserErrors:errors,safeMarginOverflows:overflow,times},null,2));
 if(errors.length||overflow.length)throw Error(JSON.stringify({errors,overflow}));
 console.log('12 style frames; seek determinism PASS; text safe margins PASS.');
 await browser.close();browser=null;server.close();
 if(prototype||full){
 if(full){const gate=JSON.parse(await fs.readFile(path.join(out,'prototype-report.json'),'utf8'));if(gate.frames!==390)throw Error('Render 390-frame opening prototype first');}
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),outDir:path.join(cache,'bundle'),publicDir:path.join(root,'public')});
 const composition=await selectComposition({serveUrl,id:'MotionCardListicle',browserExecutable:executable,chromiumOptions:{gl:'angle'}});
 const target=path.join(out,prototype?'motion-card-listicle-prototype.mp4':'motion-card-listicle-final.mp4');
 const frames=prototype?390:1500;let last=-1;
 await renderMedia({serveUrl,composition,codec:'h264',outputLocation:target,browserExecutable:executable,frameRange:[0,frames-1],pixelFormat:'yuv420p',crf:prototype?21:17,x264Preset:'medium',audioCodec:'aac',audioBitrate:'320k',audioSampleRate:48000,colorSpace:'bt709',imageFormat:'png',concurrency:4,chromiumOptions:{gl:'angle'},onProgress:({progress})=>{const p=Math.floor(progress*10);if(p!==last){last=p;console.log(`Remotion render ${p*10}%`);}}});
 const remux=target.replace('.mp4','-exact.mp4');ff(['-i',target,'-i',path.join(root,'public/motion-card-listicle/audio/soundtrack.wav'),'-map','0:v:0','-map','1:a:0','-t',prototype?'6.5':'25','-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',remux]);await fs.rename(remux,target);
 const metadata=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',target]));
 await fs.writeFile(path.join(out,prototype?'prototype-report.json':'render-report.json'),JSON.stringify({frames,seekSafe:true,renderer:'Remotion',metadata},null,2));
 console.log(`Rendered ${target}`);
 if(full){ff(['-i',target,'-vf','scale=540:960','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',path.join(out,'motion-card-listicle-preview.mp4')]);console.log('540x960 preview encoded.');}
 }
 }finally{if(browser)await browser.close();server.close();}
}
