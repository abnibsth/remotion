import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Load the pure TS helper without adding a separate test framework.
const source = readFileSync(new URL('../src/DreamDungeon/motion.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
new Function('exports', compiled)(exports);
const { getPose, visibleCharacters, wrapWords, snapPixel, measureText } = exports;

test('typewriter clamps pre-mount frames and completes predictably', () => {
  assert.equal(visibleCharacters(-10, 60, 10, 20), 0);
  assert.equal(visibleCharacters(30, 60, 40, 20), 10);
  assert.equal(visibleCharacters(600, 60, 40, 20), 40);
});

test('dialogue wraps whole words before reveal without losing text', () => {
  const text = 'MIMPI MUNGKIN MEMBANTU OTAK MEMPROSES INGATAN DAN EMOSI.';
  const lines = wrapWords(text, 190, 1.5);
  assert.equal(lines.join(' '), text);
  assert.ok(lines.every((line) => measureText(line, 1.5) <= 190));
  assert.deepEqual(wrapWords('', 190, 1.5), []);
});

test('long Indonesian explanation fits four dialogue lines', () => {
  const lines = wrapWords('MIMPI MUNGKIN MEMBANTU OTAK MEMPROSES INGATAN DAN EMOSI.', 196, 1.6);
  assert.ok(lines.length <= 4);
  assert.ok(lines.every((line) => measureText(line, 1.6) <= 196));
});

test('poses are deterministic and independent of rendering fps', () => {
  assert.deepEqual(getPose(120, 60, 'walk'), getPose(60, 30, 'walk'));
  assert.deepEqual(getPose(120, 60, 'idle'), getPose(120, 60, 'idle'));
  assert.notEqual(getPose(0, 60, 'walk').leftLeg, getPose(6, 60, 'walk').leftLeg);
  assert.equal(getPose(0, 60, 'sleep').eyesClosed, true);
  assert.equal(getPose(0, 60, 'surprised').surprised, true);
});

test('camera coordinates snap to final output pixel grid', () => {
  assert.equal(snapPixel(10.13), 10.25);
  assert.equal(snapPixel(-2.1), -2);
  assert.ok(Number.isFinite(snapPixel(0)));
});
