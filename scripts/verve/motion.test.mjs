import test from 'node:test';
import assert from 'node:assert/strict';
import {PRODUCT,sceneAt,cameraAt,smooth,shotAt,FRAMES,FPS} from '../../src/Verve/motion.mjs';

test('only screenshot-confirmed product facts are used',()=>{
 assert.equal(PRODUCT.brand,'MYKONOS');assert.equal(PRODUCT.name,'VERVE');assert.equal(PRODUCT.type,'Extrait de Parfum');assert.equal(PRODUCT.volume,'50 ml');assert.equal(PRODUCT.variant,'Verve');
 assert.ok(!('notes' in PRODUCT));assert.ok(!('longevity' in PRODUCT));assert.ok(!('price' in PRODUCT));
});
test('five storyboard phases cover exactly 1200 frames at 60 fps',()=>{
 assert.equal(FRAMES,1200);assert.equal(FPS,60);
 assert.deepEqual([0,3,7,12,17].map(sceneAt),['teaser','reveal','details','hero','packshot']);
});
test('every frame is deterministic finite with bounded opacity and no fake product orbit',()=>{
 for(let f=0;f<FRAMES;f++){
  const t=f/FPS,c=cameraAt(t),s=shotAt(t);
  assert.deepEqual(c,cameraAt(t));assert.deepEqual(s,shotAt(t));
  assert.ok(Object.values(c).every(Number.isFinite));assert.ok(Object.values(s).every(Number.isFinite));
  for(const k of ['bottleOpacity','detailOpacity','packageOpacity'])assert.ok(s[k]>=0&&s[k]<=1);
  assert.ok(Math.abs(c.rotation)<=4);assert.equal(c.rotateY,0);
 }
});
test('camera follows continuous eased paths without scene-boundary jumps',()=>{
 for(const t of [3,7,12,17]){
  const a=cameraAt(t-.0001),b=cameraAt(t+.0001);
  for(const k of Object.keys(a))assert.ok(Math.abs(a[k]-b[k])<2,`${k} jumps at ${t}`);
 }
});
test('final product remains readable and stable for two full seconds',()=>{
 assert.deepEqual(cameraAt(18),cameraAt(19.9));
 assert.equal(shotAt(18).bottleOpacity,1);assert.equal(shotAt(19.9).bottleOpacity,1);
 assert.equal(smooth(-1),0);assert.equal(smooth(2),1);
});
