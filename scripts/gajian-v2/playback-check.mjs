import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../../',import.meta.url));
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1234/chrome-win64/chrome.exe'),headless:true});
const results=[];
try{
 for(const [name,duration,times]of [['gajian-v2-preview.mp4',7,[1,3.5,6.8]],['gajian-v2-final.mp4',30,[.2,7.3,15,19.5,26.6,29.8]]]){
  const page=await browser.newPage();
  const file=path.join(root,'gajian-motion/v2/output',name);
  await page.goto(pathToFileURL(file).href);
  await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
  const metadata=await page.locator('video').evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,error:v.error?.message}));
  if(metadata.duration!==duration||metadata.width!==1080||metadata.height!==1920||metadata.error)throw Error(JSON.stringify(metadata));
  for(const t of times){await page.locator('video').evaluate((v,t)=>new Promise((resolve,reject)=>{v.onseeked=()=>resolve();v.onerror=()=>reject(Error(v.error.message));v.currentTime=t;}),t);}
  results.push({name,metadata,seekTimes:times,opened:true});await page.close();
 }
 await fs.writeFile(path.join(root,'gajian-motion/v2/output/playback-check.json'),JSON.stringify({passed:true,results},null,2));console.log(results);
}finally{await browser.close();}
