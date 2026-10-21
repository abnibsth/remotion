import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';

import {renderSettings,requestAsset} from './render-settings.mjs';
const {fps,totalFrames,directory,socialBitrate,maxrate,bufsize}=renderSettings();
const root=process.cwd();
const output=path.join(root,directory);
const buildDir=path.join(root,'.cache/notifikasi-preview');
await fs.mkdir(buildDir,{recursive:true});
await fs.mkdir(output,{recursive:true});
await build({entryPoints:['scripts/notifikasi/preview.tsx'],bundle:true,outdir:buildDir,loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]',format:'iife',platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},minify:true});
await fs.writeFile(path.join(buildDir,'index.html'),'<!doctype html><meta charset="utf-8"><title>Notifikasi Overload — frame preview</title><link rel="stylesheet" href="/preview.css"><style>html,body{margin:0;background:#141235;width:1080px;height:1920px;overflow:hidden}</style><div id="root"></div><script src="/preview.js"></script>');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff'};
const server=http.createServer(async(req,res)=>{try{const name=requestAsset(req.url);const file=path.resolve(buildDir,name);if(!file.startsWith(buildDir+path.sep)){res.writeHead(403).end();return;}const data=await fs.readFile(file);res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browserCandidates=[process.env.CHROME_PATH,path.join(process.env.LOCALAPPDATA||os.homedir(),'ms-playwright/chromium-1234/chrome-win64/chrome.exe'),path.join(root,'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell.exe')].filter(Boolean);
let executablePath;
for(const p of browserCandidates){try{await fs.access(p);executablePath=p;break;}catch{}}
if(!executablePath)throw new Error('Set CHROME_PATH to an installed Chromium. No browser will be downloaded automatically.');
const browser=await chromium.launch({executablePath,headless:true,args:['--disable-gpu','--font-render-hinting=none','--force-color-profile=srgb']});
const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.goto(`http://127.0.0.1:${server.address().port}/?fps=${fps}`);
await page.evaluate(()=>window.ready);
await page.evaluate(()=>document.fonts.ready);
const capture=async(t,file)=>{await page.evaluate(t=>window.seek(t),t);return page.screenshot({path:file,type:'png',animations:'disabled'});};
function run(args){const r=spawnSync('ffmpeg',['-hide_banner','-y',...args],{stdio:'inherit'});if(r.status!==0)throw new Error(`FFmpeg exited ${r.status}`);}
try{
  if(process.argv.includes('--full')){
    const frames=path.join(output,'frames');await fs.mkdir(frames,{recursive:true});
    for(let f=0;f<totalFrames;f++){await capture(f/fps,path.join(frames,`${String(f).padStart(4,'0')}.png`));if(f%fps===0)console.log(`FRAMES ${f}/${totalFrames}`);}
    if(errors.length)throw new Error(errors.join('\n'));
    run(['-framerate',String(fps),'-i',path.join(frames,'%04d.png'),'-i','public/notifikasi/audio/mix.wav','-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-r',String(fps),'-fps_mode','cfr','-c:a','aac','-b:a','320k','-ar','48000','-t','20','-movflags','+faststart',path.join(output,'notifikasi-overload-master.mp4')]);
    const common=['-i',path.join(output,'notifikasi-overload-master.mp4'),'-c:v','libx264','-preset','slow','-b:v',socialBitrate,'-maxrate',maxrate,'-bufsize',bufsize,'-pix_fmt','yuv420p','-r',String(fps),'-fps_mode','cfr','-passlogfile',path.join(output,'social-pass')];
    run([...common,'-pass','1','-an','-f','null',process.platform==='win32'?'NUL':'/dev/null']);
    run([...common,'-pass','2','-c:a','aac','-b:a','192k','-ar','48000','-t','20','-movflags','+faststart',path.join(output,'notifikasi-overload-social.mp4')]);
    console.log('RENDER COMPLETE: master + social');
  }else{
    const preview=path.join(output,'keyframes');await fs.mkdir(preview,{recursive:true});
    const times=[.7,1.95,3.7,5.1,6.8,8.8,10.5,12.2,13.9,15.9,17.2,19.3];
    const checks=[];
    for(let i=times.length-1;i>=0;i--){const file=path.join(preview,`${String(i).padStart(2,'0')}.png`);await capture(times[i],file);checks.push(...await page.locator('[data-primary]').evaluateAll(els=>els.flatMap(el=>{const r=el.getBoundingClientRect();return r.x<60||r.right>1020||r.y<100||r.bottom>1600?[{text:el.textContent,rect:{x:r.x,right:r.right,y:r.y,bottom:r.bottom}}]:[]})));}
    const one=await capture(8.8);await capture(.2);await capture(19.8);const two=await capture(8.8);
    const seekSafe=crypto.createHash('sha256').update(one).digest('hex')===crypto.createHash('sha256').update(two).digest('hex');
    run(['-framerate','1','-i',path.join(preview,'%02d.png'),'-vf','scale=270:480,tile=4x3:padding=12:margin=12:color=0x141235','-frames:v','1',path.join(output,'contact-sheet.png')]);
    await fs.writeFile(path.join(output,'preview-check.json'),JSON.stringify({seekSafe,browserErrors:errors,primarySafeAreaWarnings:checks,fontStatus:await page.evaluate(()=>({anton:document.fonts.check('100px Anton'),inter:document.fonts.check('900 40px Inter')})),times},null,2));
    if(!seekSafe||errors.length)throw new Error('Preview validation failed');
    console.log('CONTACT SHEET READY. Seek safety verified. Safe-area warnings:',checks.length);
  }
}finally{await browser.close();server.close();}
