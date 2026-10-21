import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1234/chrome-win64/chrome.exe'),headless:true});
try{
 const p=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));
 await p.goto('http://localhost:3000/VerveCommercial',{waitUntil:'networkidle'});
 await p.locator('[data-product="front-photo"]').waitFor({state:'attached'});
 const x=await p.locator('[data-product="front-photo"]').getAttribute('x');
 await p.keyboard.press('Space');await p.waitForFunction(x=>document.querySelector('[data-product="front-photo"]')?.getAttribute('x')!==x,x);await p.keyboard.press('Space');
 await p.screenshot({path:'out/verve-commercial/studio-preview.png'});
 assert.deepEqual(errors,[]);await fs.writeFile('out/verve-commercial/studio-check.json',JSON.stringify({passed:true,played:true,errors},null,2));console.log('Verve Studio playback PASS');
}finally{await browser.close();}
