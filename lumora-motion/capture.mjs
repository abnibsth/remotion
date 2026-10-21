import {chromium} from './tooling/node_modules/playwright-core/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i, '$1'));
const dest = path.join(root,'assets','live-20261016');
await fs.mkdir(dest,{recursive:true});
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page = await browser.newPage({viewport:{width:1536,height:960},deviceScaleFactor:1.5,reducedMotion:'reduce'});
const records=[];
const fontURLs=new Set();
page.on('response',r=>{if(/\.woff2(?:\?|$)/.test(r.url()))fontURLs.add(r.url());});
async function settle(){
 await page.evaluate(async()=>{await document.fonts.ready; for(const v of document.querySelectorAll('video'))v.pause();});
 await page.waitForTimeout(1400);
}
async function screenshot(name,locator){
 await locator.scrollIntoViewIfNeeded(); await settle();
 await locator.screenshot({path:path.join(dest,name+'.png'),animations:'disabled',timeout:30000});
 records.push({name,url:page.url(),box:await locator.boundingBox(),text:(await locator.innerText()).slice(0,20000)});
}
await page.goto('https://lumora.bai01.my.id/',{waitUntil:'networkidle',timeout:60000});
await settle();
await page.screenshot({path:path.join(dest,'landing.png'),animations:'disabled'});
const brand=await page.evaluate(()=>{
 const cs=getComputedStyle(document.documentElement),h=document.querySelector('h1');
 return {title:document.title,tokens:Object.fromEntries(['forest','forest-deep','lime','green','mint','background','surface','ink','muted','soft-green','accent','line'].map(n=>[n,cs.getPropertyValue('--color-'+n)])),heading:{font:getComputedStyle(h).fontFamily,weight:getComputedStyle(h).fontWeight,size:getComputedStyle(h).fontSize},bodyFont:getComputedStyle(document.body).fontFamily,stylesheets:[...document.styleSheets].map(s=>s.href),images:[...document.images].map(i=>({src:i.currentSrc,alt:i.alt}))};
});
for(const id of ['jelajahi-umkm','fitur','profil','perjalanan','untuk-siapa']){
 await screenshot('section-'+id,page.locator('#'+id));
}
await screenshot('ai-interface',page.locator('#fitur .rounded-\\[18px\\]'));
await screenshot('profile-preview',page.locator('#profil .min-w-0.overflow-hidden').first());
await screenshot('discovery-card',page.locator('#jelajahi-umkm a[href="/business/aksara-lokal"]').first());
await page.goto('https://lumora.bai01.my.id/explore',{waitUntil:'networkidle',timeout:60000}); await settle();
await page.screenshot({path:path.join(dest,'discovery.png'),animations:'disabled'});
records.push({name:'discovery',url:page.url(),text:await page.locator('main').innerText()});
await page.screenshot({path:path.join(dest,'discovery-full.png'),fullPage:true,animations:'disabled'});
for(const [i,slug] of ['aksara-lokal','arunika-bakery','kopi-ruang-senja'].entries()){
 const card=page.locator(`a[href="/business/${slug}"]`).first();
 if(await card.count())await screenshot('card-'+i,card);
}
await page.goto('https://lumora.bai01.my.id/business/aksara-lokal',{waitUntil:'networkidle',timeout:60000}); await settle();
await page.screenshot({path:path.join(dest,'profile.png'),animations:'disabled'});
await page.screenshot({path:path.join(dest,'profile-full.png'),fullPage:true,animations:'disabled'});
records.push({name:'profile',url:page.url(),text:await page.locator('main').innerText(),html:await page.locator('main').innerHTML()});
for(const name of ['logo-nav.png','benner.png','image.png']){
 const r=await page.request.get('https://lumora.bai01.my.id/img/'+name);if(r.ok())await fs.writeFile(path.join(dest,name),await r.body());
}
for(const [i,url] of [...fontURLs].entries()){
 const r=await page.request.get(url);await fs.writeFile(path.join(dest,`font-${i}.woff2`),await r.body());
}
const css=[];for(const url of brand.stylesheets.filter(Boolean)){const r=await page.request.get(url);css.push(await r.text());}
await fs.writeFile(path.join(dest,'styles.css'),css.join('\n'));
await fs.writeFile(path.join(dest,'inventory.json'),JSON.stringify({capturedAt:new Date().toISOString(),brand,fonts:[...fontURLs],records},null,2));
await browser.close();console.log('Authentic screenshots, brand assets, fonts and inventory captured:',dest);
