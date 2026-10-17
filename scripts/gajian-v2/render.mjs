import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../../',import.meta.url));
const out=path.join(root,'gajian-motion/v2/output'),cache=path.join(root,'.cache/gajian-v2');
const mode=process.argv.includes('--full')?'full':process.argv.includes('--storyboard')?'storyboard':process.argv.includes('--prototype')?'prototype':'style';
await fs.mkdir(out,{recursive:true});await fs.mkdir(cache,{recursive:true});
await build({entryPoints:[path.join(root,'scripts/gajian-v2/preview.tsx')],bundle:true,outdir:cache,format:'iife',platform:'browser',jsx:'automatic',loader:{'.woff2':'file','.woff':'file'},define:{'process.env.NODE_ENV':'"production"'},minify:true});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/preview.css"><style>body{margin:0;width:1080px;height:1920px;overflow:hidden}</style><div id="root"></div><script src="/preview.js"></script>');
const server=http.createServer(async(req,res)=>{try{const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';const f=path.resolve(cache,relative);if(!f.startsWith(cache+path.sep))return res.writeHead(403).end();res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1234/chrome-win64/chrome.exe'),headless:true,args:['--disable-gpu','--disable-skia-runtime-opts','--force-color-profile=srgb','--font-render-hinting=none']});
const page=await browser.newPage({viewport:{width:1080,height:1920}}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
const run=args=>{const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','warning','-nostdin','-y',...args],{stdio:'inherit'});if(r.status)throw Error('FFmpeg failed');};
const capture=async(t,file)=>{await page.evaluate(t=>window.seek(t),t);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));return page.screenshot({path:file,type:'png'});};
try{
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.evaluate(()=>window.ready);
 const times=(mode==='full'||mode==='storyboard')?[0,.4,1.1,1.7,2.5,3.2,4.4,5.6,6.8,7.3,8.5,9.8,11.1,12.5,13.5,14.5,15.5,16.5,17.7,18.8,19.3,20.8,22.8,24.5,25.4,26.2,27.1,28.1,28.7,29.8]:[0,.5,1.2,1.7,2.5,3.2,4.4,5.5,6.8];
 const key=path.join(out,mode+'-keyframes');await fs.mkdir(key,{recursive:true});
 const hashes=[];
 for(const [i,t]of times.entries()){const b=await capture(t,path.join(key,`${String(i).padStart(2,'0')}.png`));hashes.push(createHash('sha256').update(b).digest('hex'));}
 let seekSafe=true;const mismatches=[];for(let i=times.length-1;i>=0;i--){const b=await capture(times[i],path.join(key,`repeat-${i}.png`));const equal=hashes[i]===createHash('sha256').update(b).digest('hex');if(!equal)mismatches.push(times[i]);seekSafe&&=equal;}console.log('SEEK MISMATCHES',mismatches);
 const fonts=await page.evaluate(()=>({space:document.fonts.check('700 100px "Space Grotesk"'),archivo:document.fonts.check('400 100px "Archivo Black"')}));
 run(['-framerate','1','-i',path.join(key,'%02d.png'),'-vf',`scale=270:480,tile=${(mode==='full'||mode==='storyboard')?'5x6':'3x3'}:padding=6:margin=6:color=0xF4F0E8`,'-frames:v','1','-update','1',path.join(out,(mode==='full'||mode==='storyboard')?'gajian-v2-contact-sheet.png':'gajian-v2-'+mode+'-sheet.png')]);
 await fs.writeFile(path.join(out,mode+'-checks.json'),JSON.stringify({times,seekSafe,fonts,errors},null,2));
 if(!seekSafe||errors.length||!fonts.space||!fonts.archivo)throw Error('Frame/font/seek validation failed');
 if(mode==='style'||mode==='storyboard'){console.log('STYLE FRAMES READY');}
 else{
  const duration=mode==='prototype'?7:30,n=duration*30,frames=path.join(out,mode+'-frames');await fs.mkdir(frames,{recursive:true});
  for(let f=0;f<n;f++){if(f>0&&f%90===0){await page.reload();await page.evaluate(()=>window.ready);}await capture(f/30,path.join(frames,`${String(f).padStart(4,'0')}.png`));if(f%30===0)console.log('FRAME',f,'/',n);}
  const audio=path.join(root,'public/gajian-v2/audio/mix-normalized.wav');
  const audioArgs=['-i',audio,'-map','0:v:0','-map','1:a:0'];
  const target=path.join(out,mode==='prototype'?'gajian-v2-preview.mp4':'gajian-v2-final.mp4');
  run(['-framerate','30','-i',path.join(frames,'%04d.png'),...audioArgs,'-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','320k','-ar','48000','-ac','2','-t',String(duration),'-movflags','+faststart',target]);
  console.log('RENDERED',target);
 }
}finally{await browser.close();server.close();}
