import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
const out=path.join(root,'out/everything-is-motion');
const cache=path.join(root,'.cache/everything-is-motion');
const full=process.argv.includes('--full'), prototype=process.argv.includes('--prototype');
const preview=process.argv.includes('--preview');
const serve=process.argv.includes('--serve');
for(const dir of [out,cache,path.join(cache,'style'),path.join(cache,'frames')]) await fs.mkdir(dir,{recursive:true});
function run(bin,args){const r=spawnSync(bin,args,{cwd:root,encoding:'utf8',windowsHide:true});if(r.status!==0)throw new Error(`${bin}: ${r.stderr}`);return r.stdout;}
const ff=(args)=>run('ffmpeg',['-hide_banner','-loglevel','warning','-y',...args]);
const sha=b=>createHash('sha256').update(b).digest('hex');
async function browserPath(){
 const candidates=[process.env.CHROME_PATH];
 const base=path.join(process.env.LOCALAPPDATA||os.homedir(),'ms-playwright');
 for(const d of (await fs.readdir(base).catch(()=>[])).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}))) for(const rel of ['chrome-headless-shell-win64/headless_shell.exe','chrome-headless-shell-win64/chrome-headless-shell.exe','chrome-win64/chrome.exe','chrome-win/chrome.exe'])candidates.push(path.join(base,d,rel));
 for(const base of [process.env.PROGRAMFILES,process.env['PROGRAMFILES(X86)'],process.env.LOCALAPPDATA].filter(Boolean)) for(const rel of ['Google/Chrome/Application/chrome.exe','Microsoft/Edge/Application/msedge.exe'])candidates.push(path.join(base,rel));
 for(const p of candidates.filter(Boolean))if(await fs.stat(p).then(s=>s.isFile()).catch(()=>false))return p;
 throw new Error('Set CHROME_PATH to an installed Chromium browser. No browser will be downloaded.');
}
await build({absWorkingDir:root,entryPoints:['scripts/everything/preview.ts'],bundle:true,outdir:cache,format:'iife',platform:'browser',loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]',minify:true});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><title>Everything Is Motion</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1920px;height:1080px;overflow:hidden;background:#111216}svg{display:block}</style></head><body><main id="root"></main><script src="/preview.js"></script></body></html>');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff'};
const server=http.createServer(async(req,res)=>{try{const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(cache,'.'+(relative==='/'?'/index.html':relative));if(!file.startsWith(cache+path.sep))throw Error('outside root');res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(resolve=>server.listen(serve?3095:0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}`;
if(serve){console.log(`Seekable preview: ${url} — window.seek(seconds)`);}else{
 let browser;
 try{
  browser=await chromium.launch({executablePath:await browserPath(),headless:true,args:['--disable-background-timer-throttling','--force-color-profile=srgb']});
  const errors=[];
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(url);await page.evaluate(()=>window.ready);
  const capture=async(t,target)=>{await page.evaluate(t=>window.seek(t),t);const b=await page.screenshot({type:'png',animations:'disabled'});if(target)await fs.writeFile(target,b);return b;};
  const before=await capture(9.8);await capture(1);await capture(18);const after=await capture(9.8);
  if(sha(before)!==sha(after))throw new Error('Out-of-order seek mismatch');
  const first=await capture(0,path.join(out,'loop-first.png'));
  const last=await capture(1199/60,path.join(out,'loop-last.png'));
  if(sha(first)!==sha(last))throw new Error('Loop endpoint pixel mismatch');
  const times=[.65,1.85,3.25,4.25,5.35,6.5,7.45,8.2,9.8,10.85,11.85,12.85,14.2,15.8,17.2,19.7];
  for(let i=0;i<times.length;i++)await capture(times[i],path.join(cache,'style',`${String(i).padStart(3,'0')}.png`));
  ff(['-framerate','1','-i',path.join(cache,'style/%03d.png'),'-vf','scale=480:270,tile=4x4','-frames:v','1',path.join(out,'contact-sheet.png')]);
  await fs.writeFile(path.join(out,'style-times.json'),JSON.stringify(times));
  console.log('Style frames: 16. Seek determinism: PASS. Loop endpoint pixels: IDENTICAL.');
  if(full||prototype||preview){
   const fps=preview?30:60, total=prototype?360:20*fps;
   if(full){const gate=JSON.parse(await fs.readFile(path.join(out,'prototype-report.json'),'utf8'));if(gate.frames!==360||!gate.seekSafe)throw new Error('Prototype gate not satisfied');}
   const frameDir=path.join(cache,prototype?'prototype':preview?'preview':'frames');await fs.mkdir(frameDir,{recursive:true});
   let next=0,done=0;
   const workers=Array.from({length:1},async()=>{
    const p=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});p.on('pageerror',e=>errors.push(String(e)));await p.goto(url);await p.evaluate(()=>window.ready);
    while(next<total){const i=next++;await p.evaluate(t=>window.seek(t),i/fps);await p.screenshot({path:path.join(frameDir,`${String(i).padStart(4,'0')}.png`),type:'png',animations:'disabled'});done++;if(done%120===0)console.log(`Captured ${done}/${total}`);}
    await p.close();
   });
   await Promise.all(workers);
   if(errors.length)throw Error(errors.join('\n'));
   const audio=path.join(root,'public/everything-is-motion/audio/soundscape.wav');
   const target=path.join(out,prototype?'prototype-6s.mp4':preview?'preview.mp4':'everything-is-motion-master.mp4');
   ff(['-framerate',String(fps),'-i',path.join(frameDir,'%04d.png'),'-i',audio,'-t',prototype?'6':'20','-c:v','libx264','-preset','slow','-crf',full?'16':'21','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','iec61966-2-1','-colorspace','bt709','-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',target]);
   const metadata=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',target]));
   await fs.writeFile(path.join(out,prototype?'prototype-report.json':preview?'preview-report.json':'master-report.json'),JSON.stringify({frames:total,fps,seekSafe:true,loopPixelsIdentical:true,errors,metadata},null,2));
   if(full){
    ff(['-i',target,'-map','0:v:0','-map','0:a:0','-c:v','libx264','-preset','slow','-crf','25','-maxrate','6500k','-bufsize','13000k','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',path.join(out,'everything-is-motion-social.mp4')]);
    ff(['-i',target,'-i',audio,'-map','0:v:0','-map','1:a:0','-vf','scale=960:540','-c:v','libx264','-crf','24','-c:a','aac','-b:a','160k','-movflags','+faststart',path.join(out,'preview.mp4')]);
   }
   console.log(`Encoded ${target}`);
  }
  if(errors.length)throw Error(errors.join('\n'));
 }finally{if(browser)await browser.close();server.close();}
}
