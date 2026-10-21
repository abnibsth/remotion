import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const out=path.join(root,'out/where-did-my-money-go'),cache=path.join(root,'.cache/money');
const prototype=process.argv.includes('--prototype'),full=process.argv.includes('--full'),serve=process.argv.includes('--serve');
for(const p of [out,cache,path.join(cache,'styles')])await fs.mkdir(p,{recursive:true});
function run(bin,args){const r=spawnSync(bin,args,{encoding:'utf8',windowsHide:true,cwd:root});if(r.status!==0)throw Error(`${bin}: ${r.stderr}`);return r.stdout;}
const ff=args=>run('ffmpeg',['-hide_banner','-loglevel','warning','-y',...args]);
const hash=b=>createHash('sha256').update(b).digest('hex');
await build({absWorkingDir:root,entryPoints:['scripts/money/preview.tsx'],bundle:true,outdir:cache,format:'iife',platform:'browser',loader:{'.woff2':'file','.woff':'file'},assetNames:'fonts/[name]-[hash]',minify:true});
await fs.writeFile(path.join(cache,'index.html'),'<!doctype html><html><head><meta charset="utf-8"><title>Money Film Preview</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1920px;height:1080px;overflow:hidden;background:#F5F1E8}</style></head><body><div id="root"></div><script src="/preview.js"></script></body></html>');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(cache,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(cache+path.sep))throw Error('outside root');res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(serve?3096:0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`;
if(serve){console.log(`Seek preview: ${url}; window.seek(seconds)`);}else{
 let browser;
 try{
  const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');
  const candidates=[process.env.CHROME_PATH,...(await fs.readdir(base)).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})).map(d=>path.join(base,d,'chrome-win64/chrome.exe'))].filter(Boolean);
  let executablePath;for(const p of candidates)if(await fs.stat(p).then(s=>s.isFile()).catch(()=>false)){executablePath=p;break;}
  if(!executablePath)throw Error('Installed Chromium not found; set CHROME_PATH');
  browser=await chromium.launch({executablePath,headless:true,args:['--force-color-profile=srgb','--disable-background-timer-throttling']});
  const errors=[],checks=[];
  const makePage=async()=>{const p=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});p.on('pageerror',e=>errors.push(String(e)));await p.goto(url);await p.evaluate(()=>window.ready);return p;};
  const page=await makePage();
  const capture=async(t,target)=>{await page.evaluate(t=>window.seek(t),t);const b=await page.screenshot({type:'png',animations:'disabled'});if(target)await fs.writeFile(target,b);return b;};
  const a=await capture(3.2);await capture(1);await capture(4.8);const b=await capture(3.2);if(hash(a)!==hash(b))throw Error('Out-of-order seek is not deterministic');
  const times=prototype?[.7,1.6,2.7,3.6,4.25,4.95]:[.7,1.6,2.7,3.6,4.6,5.85,7.1,8.6,9.45,10.5,11.95,13.4,14.3,15.5,16.35,16.85,17.35,18.2,19.2,19.95];
  for(let i=0;i<times.length;i++){
   await capture(times[i],path.join(cache,'styles',`${String(i).padStart(3,'0')}.png`));
   checks.push(await page.evaluate(t=>{
    const visible=e=>{let n=e;while(n&&n instanceof SVGElement){if(Number(getComputedStyle(n).opacity)<.02)return false;n=n.parentElement;}return true;};
    const badPaths=[...document.querySelectorAll('path')].filter(e=>/NaN|Infinity/.test(e.getAttribute('d')||'')).length;
    const overflow=[...document.querySelectorAll('text')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.left<32||r.right>1888||r.top<30||r.bottom>1050);}).map(e=>e.textContent);
    return {time:t,badPaths,overflow,fonts:['700 100px "Space Grotesk"','400 40px "IBM Plex Mono"'].map(s=>document.fonts.check(s))};
   },times[i]));
  }
  ff(['-framerate','1','-i',path.join(cache,'styles/%03d.png'),'-vf',`scale=480:270,tile=${prototype?'3x2':'4x5'}`,'-frames:v','1',path.join(out,prototype?'prototype-contact-sheet.png':'where-did-my-money-go-contact-sheet.png')]);
  await fs.writeFile(path.join(out,prototype?'prototype-visual-qc.json':'visual-qc.json'),JSON.stringify({seekSafe:true,errors,checks,times},null,2));
  if(checks.some(c=>c.badPaths||c.fonts.some(f=>!f)))throw Error('Path/font QC failed');
  console.log(`Captured ${times.length} style frames. Deterministic seeking PASS.`);
  if(prototype||full){
   if(full){const gate=JSON.parse(await fs.readFile(path.join(out,'prototype-report.json'),'utf8'));if(gate.frames!==300)throw Error('Render five-second prototype first');}
   const total=prototype?300:1200,frameDir=path.join(cache,prototype?'prototype':'frames');await fs.mkdir(frameDir,{recursive:true});
   let next=0,done=0;
   await Promise.all(Array.from({length:4},async()=>{const p=await makePage();while(next<total){const f=next++;await p.evaluate(t=>window.seek(t),f/60);await p.screenshot({path:path.join(frameDir,`${String(f).padStart(4,'0')}.png`),type:'png',animations:'disabled'});if(++done%120===0)console.log(`Captured ${done}/${total}`);}await p.close();}));
   if(errors.length)throw Error(errors.join('\n'));
   const audio=path.join(root,'public/money/audio/soundtrack.wav');
   const target=path.join(out,prototype?'where-did-my-money-go-prototype-5s.mp4':'where-did-my-money-go-master.mp4');
   ff(['-framerate','60','-i',path.join(frameDir,'%04d.png'),'-i',audio,'-t',prototype?'5':'20','-vf','scale=out_color_matrix=bt709:out_range=tv','-c:v','libx264','-preset','medium','-crf',prototype?'20':'16','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','iec61966-2-1','-colorspace','bt709','-c:a','aac','-b:a','320k','-ar','48000','-movflags','+faststart',target]);
   await fs.writeFile(path.join(out,prototype?'prototype-report.json':'render-report.json'),JSON.stringify({frames:total,fps:60,seekSafe:true,errors,target},null,2));
   if(full){
    for(const [name,crf,rate] of [['preview','25','3500k'],['social','21','8000k']])ff(['-i',target,'-c:v','libx264','-preset','medium','-crf',crf,'-maxrate',rate,'-bufsize',name==='preview'?'7000k':'16000k','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',path.join(out,`where-did-my-money-go-${name}.mp4`)]);
   }
   // Write H.264 VUI explicitly: some FFmpeg builds omit primaries/transfer
   // despite codec color flags. Stream-copy preserves all encoded frames/audio.
   for(const name of prototype?['prototype-5s']:['master','preview','social']){
    const file=path.join(out,`where-did-my-money-go-${name}.mp4`),temp=file.replace('.mp4','.color-tagged.mp4');
    ff(['-i',file,'-map','0','-c','copy','-bsf:v','h264_metadata=video_full_range_flag=0:colour_primaries=1:transfer_characteristics=13:matrix_coefficients=1','-color_primaries','bt709','-color_trc','iec61966-2-1','-colorspace','bt709','-movflags','+faststart',temp]);
    await fs.rename(temp,file);
   }
   console.log(`Encoded ${target}`);
  }
  if(errors.length)throw Error(errors.join('\n'));
 }finally{if(browser)await browser.close();server.close();}
}
