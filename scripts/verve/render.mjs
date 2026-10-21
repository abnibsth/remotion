import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=path.join(root,'out/verve-commercial'),cache=path.join(root,'.cache/verve');
const full=process.argv.includes('--full'),prototype=process.argv.includes('--prototype'),serve=process.argv.includes('--serve');
for(const d of [out,cache,path.join(cache,'style')])await fs.mkdir(d,{recursive:true});
function run(bin,args){const r=spawnSync(bin,args,{encoding:'utf8',maxBuffer:32*1024*1024,windowsHide:true,cwd:root});if(r.status!==0)throw Error(r.stderr);return r.stdout;}
const ff=args=>run('ffmpeg',['-hide_banner','-loglevel','warning','-nostdin','-y',...args]);
await build({absWorkingDir:root,entryPoints:['scripts/verve/preview.tsx'],bundle:true,outdir:cache,format:'iife',platform:'browser',loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]',minify:true});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><title>Verve Film Preview</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1920px;height:1080px;overflow:hidden;background:#100F0D}</style></head><body><div id="root"></div><script src="/preview.js"></script></body></html>');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.wav':'audio/wav'};
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const isAsset=name.startsWith('/product-commercial/');const base=isAsset?path.join(root,'public'):cache;const file=path.resolve(base,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(base+path.sep))throw Error('outside root');res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(serve?3097:0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`;
if(serve){console.log(`Visual seek surface: ${url}; await window.seek(seconds). Audio is in Studio and MP4.`);}else{
 let browser;
 try{
  const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');const candidates=[process.env.CHROME_PATH,...(await fs.readdir(base)).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})).map(d=>path.join(base,d,'chrome-win64/chrome.exe'))].filter(Boolean);let executablePath;for(const p of candidates)if(await fs.stat(p).then(s=>s.isFile()).catch(()=>false)){executablePath=p;break;}if(!executablePath)throw Error('Set CHROME_PATH');
  browser=await chromium.launch({executablePath,headless:true,args:['--force-color-profile=srgb','--disable-background-timer-throttling']});
  const errors=[];const makePage=async()=>{const p=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});p.on('pageerror',e=>errors.push(String(e)));await p.goto(url);await p.evaluate(()=>window.verveReady);return p;};
  const page=await makePage();const capture=async(t,target)=>{await page.evaluate(t=>window.verveSeek(t),t);const b=await page.screenshot({type:'png',animations:'disabled'});if(target)await fs.writeFile(target,b);return b;};
  const hash=b=>createHash('sha256').update(b).digest('hex');const a=await capture(4.7);await capture(17.7);await capture(.5);const b=await capture(4.7);if(hash(a)!==hash(b))throw Error('Non-deterministic seeking');
  const times=prototype?[.25,1,2,3.4,4.7,6.5]:[.25,1.5,3.4,4.7,6.5,7.7,8.7,9.7,10.9,11.5,12.7,14,15.7,17.2,18.3,19.9];const checks=[];
  for(let i=0;i<times.length;i++){
   await capture(times[i],path.join(cache,'style',`${String(i).padStart(3,'0')}.png`));
   checks.push(await page.evaluate(time=>{const visible=e=>{let n=e;while(n instanceof SVGElement){if(Number(getComputedStyle(n).opacity)<.03)return false;n=n.parentElement;}return true;};return {time,invalidPaths:[...document.querySelectorAll('path')].filter(e=>/NaN|Infinity/.test(e.getAttribute('d')||'')).length,fontReady:document.fonts.check('400 24px Inter'),overflow:[...document.querySelectorAll('text')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<40||r.right>1880||r.top<40||r.bottom>1040);}).map(e=>e.textContent),assets:[...document.querySelectorAll('image')].map(e=>e.getAttribute('href'))};},times[i]));
  }
  ff(['-framerate','1','-i',path.join(cache,'style/%03d.png'),'-vf',`scale=480:270,tile=${prototype?'3x2':'4x4'}`,'-frames:v','1',path.join(out,prototype?'prototype-contact-sheet.png':'product-commercial-contact-sheet.png')]);
  await fs.writeFile(path.join(out,prototype?'prototype-visual-qc.json':'visual-qc.json'),JSON.stringify({seekSafe:true,errors,checks},null,2));
  if(errors.length||checks.some(c=>c.invalidPaths||!c.fontReady||c.overflow.length))throw Error('Visual QC failed: '+JSON.stringify({errors,checks}));
  console.log(`Style/QC: ${times.length} frames; deterministic seeking PASS.`);
  if(full||prototype){
   if(full){const p=JSON.parse(await fs.readFile(path.join(out,'prototype-report.json'),'utf8'));if(p.frames!==420)throw Error('7-second prototype gate not met');}
   const total=prototype?420:1200,frames=path.join(cache,prototype?'prototype':'frames');await fs.mkdir(frames,{recursive:true});let next=0,done=0;
   await Promise.all(Array.from({length:4},async()=>{const p=await makePage();while(next<total){const f=next++;await p.evaluate(t=>window.verveSeek(t),f/60);await p.screenshot({path:path.join(frames,`${String(f).padStart(4,'0')}.png`),type:'png',animations:'disabled'});if(++done%120===0)console.log(`Captured ${done}/${total}`);}await p.close();}));
   if(errors.length)throw Error(errors.join('\n'));
   const audio=path.join(root,'public/product-commercial/verve/soundtrack.wav'),target=path.join(out,prototype?'product-commercial-prototype-7s.mp4':'product-commercial-final.mp4');
   ff(['-framerate','60','-i',path.join(frames,'%04d.png'),'-i',audio,'-t',prototype?'7':'20','-vf','scale=out_color_matrix=bt709:out_range=tv','-c:v','libx264','-preset','medium','-crf',prototype?'20':'16','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','iec61966-2-1','-colorspace','bt709','-c:a','aac','-b:a','256k','-ar','48000','-movflags','+faststart',target]);
   if(full)ff(['-i',target,'-c:v','libx264','-preset','medium','-crf','23','-maxrate','6000k','-bufsize','12000k','-c:a','aac','-b:a','192k','-ar','48000','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'product-commercial-preview.mp4')]);
   for(const file of full?[target,path.join(out,'product-commercial-preview.mp4')]:[target]){const temp=file.replace('.mp4','.tagged.mp4');ff(['-i',file,'-map','0','-c','copy','-bsf:v','h264_metadata=video_full_range_flag=0:colour_primaries=1:transfer_characteristics=13:matrix_coefficients=1','-movflags','+faststart',temp]);await fs.rename(temp,file);}
   await fs.writeFile(path.join(out,prototype?'prototype-report.json':'render-report.json'),JSON.stringify({frames:total,fps:60,duration:total/60,seekSafe:true,errors,target},null,2));console.log(`Encoded ${target}`);
  }
 }finally{if(browser)await browser.close();server.close();}
}
