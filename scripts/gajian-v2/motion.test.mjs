import test from 'node:test';
import assert from 'node:assert/strict';
import {balanceAt,expenses,bodyAt,boardAt,sceneAt} from '../../src/GajianV2/motion.mjs';
test('V2 timeline boundaries match revised storyboard',()=>assert.deepEqual([0,2.99,3,7,13,19,24,29.99].map(sceneAt),[0,0,1,2,3,4,5,5]));
test('five exact deductions preserve correct financial checkpoints',()=>{
 assert.equal(expenses.reduce((n,e)=>n+e.amount,0),4987500);
 assert.deepEqual([13,14.1,15.1,16.1,17.1,18.9,23].map(balanceAt),[5000000,3500000,2300000,1300000,800000,12500,12500]);
});
test('body and banknote share continuous handoff coordinates at three seconds',()=>{
 for(const fn of [bodyAt,boardAt]){const a=fn(2.9999),b=fn(3.0001);assert.ok(Math.abs(a.x-b.x)<2);assert.ok(Math.abs(a.y-b.y)<2);}
});
test('pure rig can seek backward without state accumulation',()=>{
 const a=bodyAt(5.2);[0,29,8,1,3].forEach(bodyAt);assert.deepEqual(a,bodyAt(5.2));
 for(let f=0;f<900;f++){assert.ok(Object.values(bodyAt(f/30)).every(Number.isFinite));assert.ok(balanceAt(f/30)>=12500);}
});
