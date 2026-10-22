import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
const mode=process.argv.includes('--prototype')?'prototype':'final';
const file=path.resolve(`out/php-is-dead/php-is-dead-${mode}.mp4`),size=(await fs.stat(file)).size;
const server=http.createServer(async(req,res)=>{
 if(req.url!=='/video.mp4'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><meta charset="utf-8"><title>PHP Playback</title><style>body{margin:0;background:#08090d}video{height:960px;width:540px;display:block}</style></head><body><video id="v" muted playsinline controls src="/video.mp4"></video></body></html>');return;}
 const range=req.headers.range;
 if(range){const [a,b]=range.replace('bytes=','').split('-'),start=Number(a),end=b?Number(b):size-1;res.writeHead(206,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});const f=await fs.open(file);const stream=f.createReadStream({start,end,autoClose:true});stream.pipe(res);}else{res.writeHead(200,{'Content-Type':'video/mp4','Content-Length':size,'Accept-Ranges':'bytes'});const f=await fs.open(file);f.createReadStream().pipe(res);}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
try{
 browser=await chromium.launch({channel:'chrome',headless:true});
 const p=await browser.newPage({viewport:{width:540,height:960}}),errors=[];
 p.on('pageerror',e=>errors.push(String(e)));await p.goto(`http://127.0.0.1:${server.address().port}`);
 await p.waitForFunction(()=>document.querySelector('video').readyState>=2);
 const result=await p.evaluate(async()=>{const v=document.querySelector('video');let frames=0;const count=()=>{frames++;if(!v.ended)v.requestVideoFrameCallback(count);};v.requestVideoFrameCallback(count);const start=performance.now();v.playbackRate=1;await v.play();await new Promise((resolve,reject)=>{v.addEventListener('ended',resolve,{once:true});v.addEventListener('error',()=>reject(Error(v.error?.message)),{once:true});setTimeout(()=>reject(Error('Playback timeout')),35000);});return {ended:v.ended,duration:v.duration,width:v.videoWidth,height:v.videoHeight,decodedFrames:v.getVideoPlaybackQuality().totalVideoFrames,droppedFrames:v.getVideoPlaybackQuality().droppedVideoFrames,observedFrames:frames,elapsedSeconds:(performance.now()-start)/1000};});
 if(!result.ended||result.width!==1080||result.height!==1920||errors.length)throw Error(JSON.stringify({result,errors}));
 await fs.writeFile(path.resolve(`out/php-is-dead/${mode}-playback.json`),JSON.stringify({...result,errors,mutedPlayback:true},null,2));
 console.log(JSON.stringify(result));
 for(const [i,t] of (mode==='prototype'?[.2,1.7,3.2,4.8,6.5,7.73]:[8.05,9.1,10.4,12.7,14.28,14.8,15.4,16.8,19.3]).entries()){
  await p.evaluate(t=>new Promise(resolve=>{const v=document.querySelector('video');v.addEventListener('seeked',resolve,{once:true});v.currentTime=t;}),t);
  await p.screenshot({path:path.resolve(`out/php-is-dead/${mode}-playback-${String(i).padStart(2,'0')}.png`)});
 }
}finally{if(browser)await browser.close();server.close();}
