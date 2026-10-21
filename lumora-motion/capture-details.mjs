import {chromium} from './tooling/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
const dir='lumora-motion/assets/live-20261016/';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const p=await browser.newPage({viewport:{width:1536,height:960},deviceScaleFactor:1.5,reducedMotion:'reduce'});
await p.goto('https://lumora.bai01.my.id/explore',{waitUntil:'networkidle'});
console.log(await p.locator('a[href="/business/aksara-lokal"]').first().evaluate(e=>e.parentElement.outerHTML.slice(0,500)));
for(const [i,slug] of ['aksara-lokal','arunika-bakery','kopi-ruang-senja'].entries()){
 const a=p.locator(`a[href="/business/${slug}"]`).first();
 const card=a.locator('xpath=ancestor::article[1]');
 const el=await card.count()?card:a.locator('..');
 await el.scrollIntoViewIfNeeded();await p.waitForTimeout(600);await el.screenshot({path:dir+`business-card-${i}.png`,animations:'disabled'});
}
await p.goto('https://lumora.bai01.my.id/business/aksara-lokal',{waitUntil:'networkidle'});
for(const id of ['overview','perjalanan','perkembangan','model-bisnis']){
 const el=p.locator('#'+id);await el.scrollIntoViewIfNeeded();await p.waitForTimeout(600);await el.screenshot({path:dir+`profile-${id}.png`,animations:'disabled'});
}
await p.goto('https://lumora.bai01.my.id/',{waitUntil:'networkidle'});
const filters=p.locator('[aria-label="Filter kategori bisnis"]');await filters.scrollIntoViewIfNeeded();await p.waitForTimeout(600);await filters.screenshot({path:dir+'filters.png',animations:'disabled'});
await browser.close();console.log('Detail captures complete');
