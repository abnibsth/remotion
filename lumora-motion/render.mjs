import {chromium} from './tooling/node_modules/playwright-core/index.mjs';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import crypto from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url));
const out=path.join(root,'output');await fs.mkdir(out,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.woff2':'font/woff2','.wav':'audio/wav','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
 try{const url=new URL(req.url,'http://localhost');const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}const body=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream'});res.end(body);}catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(process.env.PORT?Number(process.env.PORT):3210,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}`;
const mode=process.argv[2]??'keyframes';
if(mode==='preview'){console.log('LUMORA preview: '+url);}
else{
 const errors=[];
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--hide-scrollbars','--disable-lcd-text','--disable-gpu','--disable-gpu-compositing']});
 async function page(){const p=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});p.on('pageerror',e=>errors.push(e.message));await p.goto(url+'/?render');await p.waitForFunction(()=>window.__ready===true);return p;}
 async function command(args){return new Promise((resolve,reject)=>{const c=spawn('ffmpeg',['-hide_banner','-y',...args],{stdio:['ignore','ignore','pipe']});let log='';c.stderr.on('data',d=>{log+=d;});c.on('exit',code=>code===0?resolve(log):reject(Error(log)));c.on('error',reject);});}
 try{
 if(mode==='keyframes'){
  const p=await page();const times=[1.9,3.35,5.8,7.3,9.2,11.4,12.55,14.1,15.6,17.45,19.4,21.65,22.6,24.8,26.4,28.9];
  await fs.mkdir(path.join(out,'keyframes'),{recursive:true});
  for(const [i,t] of times.entries()){await p.evaluate(t=>window.seek(t),t);await p.screenshot({path:path.join(out,'keyframes',`${String(i).padStart(2,'0')}.png`),animations:'disabled'});}
  await p.evaluate(()=>window.seek(21.65));const a=await p.screenshot();await p.evaluate(()=>window.seek(3.2));await p.evaluate(()=>window.seek(21.65));const b=await p.screenshot();const same=crypto.createHash('sha256').update(a).digest('hex')===crypto.createHash('sha256').update(b).digest('hex');
  if(!same)throw Error('Out-of-order seek produced different pixels');
  const fontCheck=await p.evaluate(()=>({poppins:document.fonts.check('500 72px Poppins'),geist:document.fonts.check('400 24px Geist'),missing:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
  if(errors.length||fontCheck.missing.length||!fontCheck.poppins||!fontCheck.geist)throw Error(JSON.stringify({errors,fontCheck}));
  await command(['-framerate','1','-i',path.join(out,'keyframes','%02d.png'),'-vf','scale=480:270,tile=4x4:padding=8:margin=8:color=0x0b3027','-frames:v','1',path.join(out,'contact-sheet.png')]);
  await fs.writeFile(path.join(out,'visual-check.json'),JSON.stringify({times,seekPixelIdentical:same,fontCheck,browserErrors:errors},null,2));
  console.log('Contact sheet ready; deterministic seek pixel comparison PASS; fonts and assets PASS.');
 }else if(mode==='render'){
  const audio=path.join(root,'audio','soundtrack.wav');await fs.access(audio);
  const workers=3,total=1800,size=600;const start=Date.now();
  await Promise.all(Array.from({length:workers},async(_,worker)=>{
   const p=await page();const first=worker*size,last=Math.min(total,first+size);const target=path.join(out,`chunk-${worker}.mp4`);
   const ff=spawn('ffmpeg',['-hide_banner','-y','-f','image2pipe','-framerate','60','-vcodec','mjpeg','-i','pipe:0','-an','-vf','scale=in_range=pc:out_range=tv,format=yuv420p','-c:v','libx264','-preset','fast','-crf','16','-pix_fmt','yuv420p','-color_range','tv','-colorspace','bt709','-r','60','-threads','3',target],{stdio:['pipe','ignore','pipe']});
   let log='';ff.stderr.on('data',d=>{log+=d;});const done=new Promise((resolve,reject)=>{ff.on('error',reject);ff.on('exit',code=>code===0?resolve():reject(Error(log)));});
   for(let f=first;f<last;f++){
    await p.evaluate(t=>window.seek(t),f/60);const image=await p.screenshot({type:'jpeg',quality:96,animations:'disabled'});
    if(!ff.stdin.write(image))await once(ff.stdin,'drain');
    if((f-first+1)%120===0)console.log(`Worker ${worker+1}: ${f-first+1}/${last-first} frames (${Math.round((Date.now()-start)/1000)}s)`);
   }
   ff.stdin.end();await done;await p.close();console.log(`Worker ${worker+1} complete`);
  }));
  if(errors.length)throw Error(errors.join('\n'));
  await fs.writeFile(path.join(out,'concat.txt'),Array.from({length:workers},(_,i)=>`file 'chunk-${i}.mp4'`).join('\n'));
  await command(['-f','concat','-safe','0','-i',path.join(out,'concat.txt'),'-i',audio,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-ac','2','-t','30','-movflags','+faststart',path.join(out,'lumora-master.mp4')]);
  await command(['-i',path.join(out,'lumora-master.mp4'),'-map','0:v:0','-map','0:a:0','-c:v','libx264','-preset','slow','-b:v','4200k','-maxrate','6500k','-bufsize','8400k','-pix_fmt','yuv420p','-r','60','-c:a','copy','-t','30','-movflags','+faststart',path.join(out,'lumora-social.mp4')]);
  console.log(`Both MP4 files encoded in ${Math.round((Date.now()-start)/1000)} seconds. Run verify.mjs next.`);
 }else throw Error('Unknown mode '+mode);
 }finally{await browser.close();server.close();}
}
