import {chromium} from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const out='out/verve-commercial',names=['product-commercial-final.mp4','product-commercial-preview.mp4'];
const server=http.createServer(async(req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname.slice(1);
 if(!names.includes(name)){res.writeHead(404);res.end();return;}
 const data=await fs.readFile(path.join(out,name)),range=req.headers.range;
 if(range){const m=/bytes=(\d+)-(\d*)/.exec(range);if(!m){res.writeHead(416);res.end();return;}const start=Number(m[1]),end=m[2]?Math.min(Number(m[2]),data.length-1):data.length-1;res.writeHead(206,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});res.end(data.subarray(start,end+1));}
 else{res.writeHead(200,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':data.length});res.end(data);}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1234/chrome-win64/chrome.exe'),headless:true});
try{
 const p=await browser.newPage({viewport:{width:1920,height:1080}}),results=[];
 for(const name of names){
  await p.setContent('<body style="margin:0;background:#100F0D"><video muted style="width:1920px;height:1080px"></video></body>');
  const r=await p.evaluate(async src=>{const v=document.querySelector('video');v.src=src;await new Promise((resolve,reject)=>{v.onloadeddata=resolve;v.onerror=()=>reject(new Error(v.error?.message));});v.currentTime=18.5;await v.play();await new Promise(resolve=>{const frame=(_,meta)=>{if(meta.mediaTime>=18.5){v.pause();resolve();}else v.requestVideoFrameCallback(frame);};v.requestVideoFrameCallback(frame);});return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,presentedTime:v.currentTime,error:v.error?.message||null};},`http://127.0.0.1:${server.address().port}/${name}`);
  assert.equal(r.duration,20);assert.equal(r.width,1920);assert.equal(r.height,1080);assert.equal(r.error,null);assert.ok(r.presentedTime>=18.5);
  if(name.includes('final'))await p.screenshot({path:path.join(out,'browser-packshot.png')});results.push({name,...r});
 }
 await fs.writeFile(path.join(out,'playback-check.json'),JSON.stringify({passed:true,results},null,2));console.log('Both MP4s loaded, played and presented final packshot in Chromium.');
}finally{await browser.close();server.close();}
