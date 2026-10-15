import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/DreamDungeon/voice-timing.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
new Function('exports', compiled)(exports);
const { toVideoCaptions, buildCaptionPages, speechVolume } = exports;
const motion = {};
new Function('exports', ts.transpileModule(readFileSync(new URL('../src/DreamDungeon/motion.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(motion);

test('audio and captions share the same time transform, without cutting final words', () => {
  const words = [{text: 'Halo', startMs: 500, endMs: 1000, timestampMs: 750, confidence: 1}, {text: ' mimpi.', startMs: 39000, endMs: 40100, timestampMs: 39550, confidence: 1}];
  const synced = toVideoCaptions(words, 1.01);
  assert.equal(synced[0].startMs, Math.round(500 / 1.01));
  assert.ok(synced[1].endMs < 40000);
  assert.equal(synced.map(x => x.text).join(''), 'Halo mimpi.');
});

test('caption pages keep sentence boundaries and every spoken word', () => {
  const words = ['Tubuhmu', ' beristirahat.', ' Otakmu', ' tetap', ' aktif!'].map((text, i) => ({text, startMs: i * 400, endMs: (i + 1) * 400, timestampMs: i * 400 + 200, confidence: null}));
  const pages = buildCaptionPages(words, 3);
  assert.equal(pages.length, 2);
  assert.deepEqual(pages.map(p => p.words).flat(), words);
});

test('actual recording pages fit panel and every word stays inside forty seconds', () => {
  const recording = JSON.parse(readFileSync(new URL('../src/DreamDungeon/recording.json', import.meta.url), 'utf8'));
  assert.ok(recording.duration <= 40);
  assert.equal(recording.words.length, 77);
  assert.ok(recording.words.every((word) => word.startMs >= 0 && word.endMs >= word.startMs && word.endMs <= 40000));
  for (const page of recording.pages) {
    const text = page.words.map((word) => word.text.trim()).join(' ');
    const lines = motion.wrapWords(text.toUpperCase(), 196, 1.6);
    assert.ok(lines.length <= 4, `Caption too tall: ${text}`);
    assert.ok(lines.every((line) => motion.measureText(line, 1.6) <= 196));
  }
});

test('music ducks smoothly around actual speech instead of muting completely', () => {
  const words = [{startMs: 1000, endMs: 2000}];
  assert.equal(speechVolume(1.5, words), 0.24);
  assert.equal(speechVolume(3, words), 0.5);
  assert.ok(speechVolume(.9, words) > .24 && speechVolume(.9, words) < .5);
});
