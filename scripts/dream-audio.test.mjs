import { test } from 'node:test';
import assert from 'node:assert/strict';
import { synthesizeDreamTrack, encodeWav } from './generate-dream-audio.mjs';

test('dream score is exactly 40 seconds and deterministic', () => {
  const first = synthesizeDreamTrack(2000);
  const second = synthesizeDreamTrack(2000);
  assert.equal(first.length, 40 * 2000 * 2);
  assert.deepEqual(first, second);
  assert.ok(first.some((sample) => Math.abs(sample) > 0.05));
  assert.ok(first.every((sample) => Number.isFinite(sample) && Math.abs(sample) <= 1));
});

test('PCM WAV header matches the complete stereo sample data', () => {
  const wav = encodeWav(new Float32Array([0, 0, 0.5, -0.5]), 44100);
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
  assert.equal(wav.readUInt16LE(22), 2);
  assert.equal(wav.readUInt32LE(24), 44100);
  assert.equal(wav.readUInt32LE(40), 8);
  assert.equal(wav.length, 52);
});
