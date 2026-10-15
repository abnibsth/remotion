import { test } from 'node:test';
import assert from 'node:assert/strict';
import { synthesizeEffect } from './generate-dream-sfx.mjs';

for (const kind of ['portal', 'quest', 'magic', 'crystal', 'victory']) {
  test(`${kind} effect has bounded deterministic stereo samples`, () => {
    const first = synthesizeEffect(kind, 2000);
    assert.deepEqual(first, synthesizeEffect(kind, 2000));
    assert.equal(first.length % 2, 0);
    assert.ok(first.some((x) => Math.abs(x) > 0.05));
    assert.ok(first.every((x) => Number.isFinite(x) && Math.abs(x) < 1));
    assert.equal(first[0], 0);
    assert.ok(Math.abs(first[first.length - 1]) < 0.01);
  });
}
