import {chromium} from './tooling/node_modules/playwright-core/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-lcd-text','--disable-gpu','--disable-gpu-compositing']});
try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3211/?render');await page.waitForFunction(()=>window.__ready);
 const times=[1.9,5.8,10.4,15.6,17.45,21.65,25.4,29];const hashes=new Map();
 const digest=b=>{const r=spawnSync('ffmpeg',['-v','error','-f','image2pipe','-i','pipe:0','-f','rawvideo','-pix_fmt','rgb24','pipe:1'],{input:b,maxBuffer:12*1024*1024});assert.equal(r.status,0);return crypto.createHash('sha256').update(r.stdout).digest('hex');};
 for(const t of times){await page.evaluate(t=>window.seek(t),t);hashes.set(t,digest(await page.screenshot()));}
 for(const t of times.toReversed()){await page.evaluate(t=>window.seek(t),t);assert.equal(digest(await page.screenshot()),hashes.get(t),'Random seek mismatch at '+t);}
 const overflow=[];
 for(const t of times){await page.evaluate(t=>window.seek(t),t);const bad=await page.evaluate(()=>[...document.querySelectorAll('.scene')].filter(s=>getComputedStyle(s).opacity==='1').flatMap(s=>[...s.querySelectorAll('.mask>span,.lede,.ai-note,.bottomline,.final-copy p')].filter(e=>getComputedStyle(e).opacity!=='0').map(e=>({text:e.textContent,box:e.getBoundingClientRect().toJSON(),scroll:e.scrollWidth,width:e.clientWidth})).filter(x=>x.box.left<0||x.box.right>1920.5||x.box.top<0||x.box.bottom>1080.5||x.scroll>x.width+1)));overflow.push(...bad.map(x=>({time:t,...x})));}
 assert.deepEqual(errors,[]);assert.deepEqual(overflow,[]);
 const transitions=[];
 for(const t of [4,8,13,18,23,27]){await page.evaluate(t=>window.seek(t),t);transitions.push(await page.evaluate(()=>{const r=document.querySelector('#wipe').getBoundingClientRect();return {time:window.currentTime,left:r.left,right:r.right,fullCover:r.left<=0&&r.right>=1920};}));}
 assert.ok(transitions.every(x=>x.fullCover));
 const report={allScenesRandomSeekPixelIdentical:true,times,headlineOverflow:overflow,browserErrors:errors,transitions};
 await fs.writeFile('lumora-motion/output/browser-check.json',JSON.stringify(report,null,2));console.log('PASS: eight scene states pixel-identical after reverse seek; editorial text bounds safe; all six scene switches fully covered; no browser errors.');
}finally{await browser.close();}
