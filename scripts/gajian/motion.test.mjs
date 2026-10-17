import test from 'node:test';
import assert from 'node:assert/strict';
import {spring, balanceAt, expenses, sceneAt, rupiah, hash, FPS, FRAMES} from '../../src/Gajian/motion.mjs';

test('timeline is exactly 900 frames, six nonoverlapping scenes', () => {
  assert.equal(FPS,30); assert.equal(FRAMES,900);
  assert.deepEqual([0,119,120,239,240,419,420,599,600,749,750,899].map(f=>sceneAt(f/30)),[0,0,1,1,2,2,3,3,4,4,5,5]);
});
test('fictional expenses sum to Rp4.987.500 and all checkpoints are exact',()=>{
  assert.equal(expenses.reduce((s,e)=>s+e.amount,0),4987500);
  assert.deepEqual([14,15.1,16,16.9,18,19.6,20].map(balanceAt),[5000000,3500000,2300000,1300000,800000,12500,12500]);
});
test('balance only decreases, never overshoots and reaches final value',()=>{
  let previous=5000000;
  for(let f=420;f<900;f++){const n=balanceAt(f/30);assert.ok(n<=previous);assert.ok(n>=12500);previous=n;}
});
test('closed-form spring is causal, finite and settled',()=>{
  assert.equal(spring(-1),0); assert.equal(spring(0),0);
  for(const k of [90,160,180,300])for(const d of [14,18,22,40]){assert.ok(Number.isFinite(spring(.25,k,d)));assert.ok(Math.abs(spring(10,k,d)-1)<.00001);}
});
test('time functions are seek-order independent, formatting uses Indonesian separators',()=>{
  const a=[.2,4.5,10.2,18.5,29.9].map(t=>[balanceAt(t),spring(t-4),hash(t)]);
  [29.9,1,18.5,0,5].forEach(t=>balanceAt(t));
  assert.deepEqual(a,[.2,4.5,10.2,18.5,29.9].map(t=>[balanceAt(t),spring(t-4),hash(t)]));
  assert.equal(rupiah(12500),'Rp12.500'); assert.equal(rupiah(5000000),'Rp5.000.000');
});
