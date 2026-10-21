import test from 'node:test';
import assert from 'node:assert/strict';
import {FINANCE, EVENTS, balanceAt, smooth, spring, receiptPoints, morphPoints, pathFromPoints, cameraAt, formatIDR, surfaceAt} from '../../src/WhereDidMyMoneyGo/motion.mjs';

test('fictional ledger reconciles exactly and remaining percentage is 0.25', () => {
  assert.equal(FINANCE.expenses.reduce((sum, e) => sum + e.amount, 0), 4987500);
  assert.equal(FINANCE.initial - FINANCE.expenses.reduce((sum, e) => sum + e.amount, 0), 12500);
  assert.equal(12500 / FINANCE.initial * 100, 0.25);
});
test('settled balances follow the exact transaction sequence', () => {
  assert.equal(balanceAt(0), 5000000);
  assert.deepEqual(EVENTS.deductions.map(t => balanceAt(t + 0.7)), [3500000,2300000,1300000,800000,12500]);
  assert.equal(formatIDR(12500), 'Rp12.500');
});
test('balance never increases or drops below the final balance across 1200 frames', () => {
  let previous = FINANCE.initial;
  for (let f=0;f<1200;f++) { const b=balanceAt(f/60); assert.ok(Number.isInteger(b)); assert.ok(b<=previous && b>=12500); previous=b; }
});
test('normalized geometry keeps point correspondence through receipt deformation', () => {
  const a=receiptPoints(800,220,0,0), b=receiptPoints(1400,220,0.9,10);
  assert.equal(a.length,b.length);
  assert.deepEqual(morphPoints(a,b,0),a); assert.deepEqual(morphPoints(a,b,1),b);
  for(let f=0;f<1200;f++) { const p=morphPoints(a,b,f/1199); assert.ok(!/NaN|Infinity/.test(pathFromPoints(p))); }
});
test('returning receipt begins at the tiny balance baseline without a spatial jump', () => {
  assert.equal(surfaceAt(16).y,620);
  assert.equal(surfaceAt(16.5).y,565);
});
test('closed-form easing and camera are deterministic and finite out of order', () => {
  assert.equal(smooth(-1),0); assert.equal(smooth(2),1); assert.equal(spring(-1),0);
  for (const t of [19.9,0,5,2.5,13,16,9,5]) {
    assert.deepEqual(cameraAt(t),cameraAt(t));
    assert.ok(Object.values(cameraAt(t)).every(Number.isFinite));
  }
});
