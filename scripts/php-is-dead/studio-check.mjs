import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('http://localhost:3000/PhpIsDead');
 await page.waitForSelector('svg');
 await page.mouse.click(435,772);
 await page.waitForFunction(()=>document.body.textContent.includes('DEAD.')||document.body.textContent.includes('Can only set one'));
 const body=await page.locator('body').innerText();
 assert.ok(!body.includes('Can only set one'),'Remotion AbsoluteFill must not receive raw SVG innerHTML because it injects children');
 await page.screenshot({path:'out/php-is-dead/studio-playing.png'});
 console.log('Studio timeline scrub — PASS');
}finally{await browser.close();}
