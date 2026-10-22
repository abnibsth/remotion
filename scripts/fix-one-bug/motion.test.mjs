import test from 'node:test';
import assert from 'node:assert/strict';
import {objects,labels,cameraAt,project,poseAt,spring} from '../../src/FixOneBug/motion.mjs';
test('ten named source errors and stable unique city object IDs',()=>{assert.equal(labels.length,10);assert.equal(new Set(objects.map(o=>o.id)).size,objects.length);assert.ok(objects.length>250);objects.forEach(o=>['initial','target','city','reveal','spawn','scale','rotation','velocity'].forEach(k=>assert.ok(k in o)));});
test('overhead camera reveals the original city roof footprints without swapping geometry',()=>{const c=cameraAt(16.5);objects.forEach(o=>{const p=project(o.city.x,o.city.z,o.city.h,c);assert.ok(Math.abs(p.x-(510+o.reveal.x))<.001);assert.ok(Math.abs(p.y-(990+o.reveal.z))<.001);assert.deepEqual(poseAt(o,16.5),poseAt(o,17));});});
test('all 1200 camera and hero states are finite and seek-order independent',()=>{for(let f=0;f<1200;f++){const c=cameraAt(f/60);Object.values(c).forEach(v=>assert.ok(Number.isFinite(v)));for(const o of objects.slice(0,10))Object.values(poseAt(o,f/60)).forEach(v=>assert.ok(Number.isFinite(v)));}assert.deepEqual(poseAt(objects[7],12),poseAt(objects[7],12));});
test('causal closed form spring settles',()=>{assert.equal(spring(-1),0);assert.ok(Math.abs(spring(2)-1)<.00001);});
