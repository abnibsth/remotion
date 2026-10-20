import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');let executable;
for(const d of(await fs.readdir(base)).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}))){for(const rel of ['chrome-headless-shell-win64/headless_shell.exe','chrome-win64/chrome.exe']){const p=path.join(base,d,rel);if(!executable&&await fs.stat(p).catch(()=>null))executable=p;}}if(!executable)throw Error('No installed Chromium found');
const browser=await chromium.launch({headless:true,executablePath:executable});
try{const page=await browser.newPage({viewport:{width:1920,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto('http://127.0.0.1:3099');await page.evaluate(()=>window.ready);
const report=await page.evaluate(async()=>{const bad=[],holdOverflow=[];for(let i=0;i<1800;i++){await window.seek(i/60);const svg=document.querySelector('svg');if(!svg||!svg.querySelector('text'))bad.push({frame:i,reason:'missing artwork'});for(const el of document.querySelectorAll('path')){try{if(!Number.isFinite(el.getTotalLength()))bad.push({frame:i,reason:'non-finite path'});}catch{bad.push({frame:i,reason:'invalid SVG path'});}}
 const t=i/60;const boundary=[0,3,6,10,14,18,22,27,30];const hold=!boundary.some(b=>Math.abs(t-b)<.55);if(hold){for(const el of document.querySelectorAll('text')){let o=1;for(let p=el;p;p=p.parentElement)o*=Number(getComputedStyle(p).opacity);const b=el.getBoundingClientRect();if(o>.1&&(b.left<65||b.right>1855||b.top<30||b.bottom>1048))holdOverflow.push({frame:i,text:el.textContent});}}
}return {framesChecked:1800,invalidGeometry:bad,holdTextOverflows:holdOverflow};});
report.browserErrors=errors;await fs.writeFile('out/click-a-link/frame-audit.json',JSON.stringify(report,null,2));if(report.invalidGeometry.length||report.holdTextOverflows.length||errors.length)throw Error(JSON.stringify(report));console.log('1800 browser SVG states: valid paths, visible content, hold safe margins PASS');
}finally{await browser.close();}
