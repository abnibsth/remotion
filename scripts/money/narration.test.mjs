import test from 'node:test';
import assert from 'node:assert/strict';
import {NARRATION_PLAN} from './narration-plan.mjs';
import {buildNarrationFilter,validateNarrationPlan} from './narration-utils.mjs';

test('all narration phrases fit inside 20 seconds without overlap',()=>{
 assert.equal(validateNarrationPlan(NARRATION_PLAN),true);
 const last=NARRATION_PLAN.at(-1);assert.ok(last.at+(last.end-last.start)/last.tempo<20);
});
test('category words follow their cards and comedic lines retain the quiet beat',()=>{
 assert.deepEqual(NARRATION_PLAN.slice(1,6).map(p=>p.at),[5.38,6.68,7.93,9.62,11.05]);
 assert.equal(NARRATION_PLAN[6].at,14);assert.equal(NARRATION_PLAN[8].at,16.85);
});
test('invalid clipping, overlap and out-of-bounds phrase plans are rejected',()=>{
 for(const bad of [[{start:1,end:0,at:0,tempo:1}],[{start:0,end:3,at:19,tempo:1}],[{start:0,end:1,at:0,tempo:1},{start:1,end:2,at:.5,tempo:1}]])assert.throws(()=>validateNarrationPlan(bad));
});
test('audio edit filter uses sample-exact stereo delays and complete 20-second output',()=>{
 const f=buildNarrationFilter(NARRATION_PLAN);assert.match(f,/adelay=4800S:all=1/);assert.match(f,/atempo=1.12/);assert.match(f,/atrim=duration=20/);assert.match(f,/normalize=0/);
});
