import test from 'node:test';
import assert from 'node:assert/strict';
import {spring,clamp,sceneAt,SCENES,frameTime} from './lib/motion.js';
test('the seven scenes cover exactly 1800 frames at 60fps without gaps',()=>{
 assert.deepEqual(SCENES.map(s=>s.start),[0,4,8,13,18,23,27]);
 for(let f=0;f<1800;f++){const t=frameTime(f);const s=sceneAt(t);assert.ok(t>=s.start&&t<s.end);}
 assert.equal(SCENES.at(-1).end,30);assert.equal(frameTime(1799),1799/60);
});
test('springs begin at rest, settle and remain finite for all damping regimes',()=>{
 for(const d of [10,20,28,40]){assert.equal(spring(-1,100,d),0);assert.equal(spring(0,100,d),0);assert.ok(Math.abs(spring(8,100,d)-1)<.001);for(let f=0;f<300;f++)assert.ok(Number.isFinite(spring(f/60,100,d)));}
});
test('motion is closed-form and safe to seek out of order',()=>{
 const times=[0,3.1,1.2,10,0.2];const first=times.map(t=>spring(t,170,28));
 for(const t of times.toReversed())spring(t,170,28);
 assert.deepEqual(times.map(t=>spring(t,170,28)),first);
 assert.equal(clamp(-2),0);assert.equal(clamp(2),1);
});
