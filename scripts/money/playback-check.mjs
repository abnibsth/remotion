import {chromium} from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const out='out/where-did-my-money-go';
const server=http.createServer(async(req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname.slice(1);
 if(!['master','preview','social'].some(n=>name===`where-did-my-money-go-${n}.mp4`)){res.writeHead(404);res.end();return;}
 const data=await fs.readFile(path.join(out,name));res.writeHead(200,{'Content-Type':'video/mp4','Content-Length':data.length});res.end(data);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1234/chrome-win64/chrome.exe'),headless:true});
try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),results=[];
 for(const name of ['master','preview','social']){
  await page.setContent('<body style="margin:0;background:#F5F1E8"><video muted style="width:1920px;height:1080px"></video></body>');
  const result=await page.evaluate(async src=>{
   const v=document.querySelector('video');v.src=src;v.load();
   await new Promise((resolve,reject)=>{v.onloadeddata=resolve;v.onerror=()=>reject(new Error(v.error?.message||'video failed'));});
   await v.play();await new Promise(resolve=>{const tick=()=>v.currentTime>.1?resolve():requestAnimationFrame(tick);tick();});v.pause();
   const seek=t=>new Promise(resolve=>{v.requestVideoFrameCallback(()=>resolve());v.currentTime=t;});
   await seek(18.8);
   return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,played:true,seekedTo:v.currentTime,error:v.error?.message||null};
  },`http://127.0.0.1:${server.address().port}/where-did-my-money-go-${name}.mp4`);
  assert.equal(result.duration,20);assert.equal(result.width,1920);assert.equal(result.height,1080);assert.equal(result.error,null);
  if(name==='master')await page.screenshot({path:path.join(out,'master-playback-frame.png')});
  results.push({name,...result});
 }
 await fs.writeFile(path.join(out,'playback-check.json'),JSON.stringify({passed:true,results},null,2));
 console.log('Browser MP4 playback and seek PASS for master, preview and social');
}finally{await browser.close();server.close();}
