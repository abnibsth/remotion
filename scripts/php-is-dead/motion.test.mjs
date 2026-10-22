import test from 'node:test';
import assert from 'node:assert/strict';
import {motion, spring, stampTimes, hash, sceneAt} from '../../src/PhpIsDead/motion.mjs';

test('film contains exactly six scenes across 1200 frames', () => {
  assert.deepEqual([0,3,8,10,14,18].map(sceneAt), [0,1,2,3,4,5]);
  assert.equal(sceneAt(1199/60),5);
});
test('declaration intervals accelerate and land on sound cues', () => {
  assert.deepEqual(stampTimes,[3.10,4.40,5.48,6.36,7.05]);
  const gaps=stampTimes.slice(1).map((v,i)=>v-stampTimes[i]);
  gaps.slice(1).forEach((v,i)=>assert.ok(v<gaps[i]));
});
test('closed-form spring is causal and settles without accumulated state', () => {
  assert.equal(spring(-1),0);assert.equal(spring(0),0);
  assert.ok(Math.abs(spring(2)-1)<0.0001);
  assert.ok(spring(.23)>1);
});
test('all 1200 camera states are finite, repeatable and bounded', () => {
  const states=Array.from({length:1200},(_,f)=>motion(f/60));
  states.forEach(s=>Object.values(s).forEach(v=>assert.ok(Number.isFinite(v))));
  for(const f of [1199,470,30,610,900,470]) assert.deepEqual(motion(f/60),states[f]);
  assert.equal(hash(28),hash(28));assert.ok(hash(28)>=0&&hash(28)<1);
});
