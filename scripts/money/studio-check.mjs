import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const out='out/where-did-my-money-go';
const browser=await chromium.launch({executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1234/chrome-win64/chrome.exe'),headless:true});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://localhost:3000/WhereDidMyMoneyGo',{waitUntil:'networkidle'});
 await page.locator('[data-surface="receipt"]').waitFor({state:'attached'});
 const first=await page.locator('[data-surface="receipt"]').getAttribute('d');
 await page.keyboard.press('Space');
 await page.waitForFunction(initial=>document.querySelector('[data-surface="receipt"]')?.getAttribute('d')!==initial,first,{timeout:30000});
 await page.keyboard.press('Space');
 await page.screenshot({path:path.join(out,'studio-preview.png')});
 const status={title:await page.title(),composition:'WhereDidMyMoneyGo',played:true,receiptVisible:await page.locator('[data-surface="receipt"]').count(),errors};
 await fs.writeFile(path.join(out,'studio-check.json'),JSON.stringify(status,null,2));
 assert.equal(errors.length,0,errors.join('\n'));
 console.log(JSON.stringify(status));
}finally{await browser.close();}
