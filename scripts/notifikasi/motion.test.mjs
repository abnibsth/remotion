import test from 'node:test';
import assert from 'node:assert/strict';
import {springValue, hash, sceneAt, motionState, SCENES, normalizeTime} from '../../src/Notifikasi/motion.mjs';

test('global and local frame clocks agree exactly at impact boundaries', () => {
  assert.equal(sceneAt(219 / 30).local, normalizeTime(54 / 30));
  for (const start of [0, 2.5, 5.5, 9.5, 12.5, 15.5, 18]) {
    for (let f=0; f<60; f++) {
      assert.equal(normalizeTime(start+f/30), normalizeTime((Math.round(start*30)+f)/30));
    }
  }
});

test('spring starts at rest and settles for all damping regimes', () => {
  for (const damping of [11, 20, 28, 50]) {
    assert.equal(springValue(-1, 100, damping), 0);
    assert.equal(springValue(0, 100, damping), 0);
    assert.ok(Math.abs(springValue(8, 100, damping) - 1) < 0.0001);
  }
});
test('scene boundaries cover exactly 600 frames with silence at frame 375', () => {
  assert.deepEqual(SCENES.map(s => s.start), [0, 2.5, 5.5, 9.5, 12.5, 15.5, 18]);
  assert.equal(SCENES.at(-1).end, 20);
  assert.equal(sceneAt(374 / 30).index, 3);
  assert.equal(sceneAt(375 / 30).index, 4);
  for (let f = 0; f < 600; f++) assert.ok(sceneAt(f / 30));
});
test('60fps scene cuts retain exact seconds and silence starts at frame 750', () => {
  assert.equal(sceneAt(749/60).index,3);
  assert.equal(sceneAt(750/60).index,4);
  assert.equal(sceneAt(1199/60).index,6);
  for(let f=0;f<1200;f++) {
    const t=f/60;
    const scene=sceneAt(t);
    const localFrame=f-Math.round(scene.start*60);
    assert.equal(scene.local,normalizeTime(localFrame/60));
    assert.equal(normalizeTime(scene.start+localFrame/60),normalizeTime(t));
  }
});

test('arbitrary seeks produce identical pure motion state', () => {
  const baseline = motionState(8.7);
  for (const t of [19.9, 0, 13, 5.5, 8.7, 1, 8.7]) motionState(t);
  assert.deepEqual(motionState(8.7), baseline);
  assert.equal(hash(42), hash(42));
  assert.ok(hash(42) >= 0 && hash(42) < 1);
});
test('posterized character does not posterize camera or scene boundaries', () => {
  assert.equal(motionState(8.01).characterTime, motionState(8.04).characterTime);
  assert.notEqual(motionState(8.01).cameraScale, motionState(8.04).cameraScale);
  assert.equal(motionState(12.5).shakeX, 0);
  assert.equal(motionState(12.5).shakeY, 0);
});
