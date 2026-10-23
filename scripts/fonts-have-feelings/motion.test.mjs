import test from 'node:test';
import assert from 'node:assert/strict';
import {profiles,poseAt,openingPose,assemblyAt,spring} from '../../src/FontsHaveFeelings/motion.mjs';
test('four reusable personalities retain distinct mass, motion and typefaces',()=>{assert.equal(Object.keys(profiles).length,4);assert.equal(new Set(Object.values(profiles).map(p=>p.typeface)).size,4);assert.equal(profiles.monospace.overshoot,0);assert.ok(profiles.bold.anticipation>profiles.italic.anticipation);});
test('1200 states are finite and positive in scale with no accumulated physics',()=>{for(let f=0;f<1200;f++)for(const key of Object.keys(profiles)){const p=poseAt(key,f/60);Object.values(p).forEach(v=>assert.ok(Number.isFinite(v)));assert.ok(p.sx>0&&p.sy>0);}assert.deepEqual(poseAt('italic',7.5),poseAt('italic',7.5));});
test('all four specimens return exactly to the opening for the loop',()=>{for(const key of Object.keys(profiles)){assert.deepEqual(openingPose(key,0),openingPose(key,20));}assert.equal(assemblyAt(15).length,11);assert.equal(assemblyAt(17).map(c=>c.glyph).join(''),'PERSONALITY');});
test('springs are causal and settle; precise character never bounces',()=>{assert.equal(spring(-.1),0);assert.ok(Math.abs(spring(2)-1)<.00001);for(const t of [12.7,12.8,12.9])assert.equal(poseAt('monospace',t).rotation,0);});
