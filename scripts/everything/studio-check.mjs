import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=path.join(process.env.LOCALAPPDATA,'ms-playwright');
const candidates=[];
for(const dir of await fs.readdir(base))for(const rel of ['chrome-win64/chrome.exe','chrome-win/chrome.exe','chrome-headless-shell-win64/headless_shell.exe']) candidates.push(path.join(base,dir,rel));
let executablePath=process.env.CHROME_PATH;
for(const p of candidates)if(!executablePath&&await fs.stat(p).then(s=>s.isFile()).catch(()=>false))executablePath=p;
const browser=await chromium.launch({executablePath,headless:true});
try{
 const page=await browser.newPage({viewport:{width:1500,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://localhost:3000/EverythingIsMotion');
 await page.waitForSelector('svg[aria-label^="EVERYTHING IS MOTION"]',{timeout:120000});
 await page.screenshot({path:'out/everything-is-motion/studio-preview.png'});
 const text=await page.locator('body').innerText();
 if(!text.includes('EverythingIsMotion'))throw new Error('Composition not loaded');
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('Remotion Studio EverythingIsMotion loaded; SVG present; no browser errors.');
}finally{await browser.close();}
