import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');
const dirs=(await fs.readdir(base)).filter(d=>d.startsWith('chromium-')).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}));
let executable;
for(const dir of dirs){const p=path.join(base,dir,'chrome-win64/chrome.exe');if(await fs.stat(p).catch(()=>null)){executable=p;break;}}
const browser=await chromium.launch({headless:true,executablePath:executable,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage({viewport:{width:720,height:1100}});
 const studio=await page.goto('http://localhost:3000/MotionCardListicle');
 await page.waitForSelector('canvas,svg',{timeout:60000});await page.screenshot({path:'out/motion-card-listicle/studio-check.png'});
 const studioStatus=studio.status();
 const videos=[];
 for(const name of ['motion-card-listicle-final.mp4','motion-card-listicle-preview.mp4']){
 await page.goto(pathToFileURL(path.resolve('out/motion-card-listicle',name)).href);
 await page.waitForSelector('video');
 const result=await page.evaluate(async()=>{const v=document.querySelector('video');v.muted=true;if(v.readyState<1)await new Promise((resolve,reject)=>{v.onloadedmetadata=resolve;v.onerror=()=>reject(new Error('Video metadata failed'));});v.currentTime=10;await new Promise(resolve=>v.onseeked=resolve);await v.play();const before=v.currentTime;await new Promise(resolve=>setTimeout(resolve,650));v.pause();return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,readyState:v.readyState,advanced:v.currentTime>before,error:v.error?.message||null};});
 if(!result.advanced||result.error)throw Error('Browser playback failed '+JSON.stringify(result));videos.push({name,...result});
 }
 await fs.writeFile('out/motion-card-listicle/playback-report.json',JSON.stringify({studioStatus,videos},null,2));console.log(JSON.stringify({studioStatus,videos},null,2));
}finally{await browser.close();}
