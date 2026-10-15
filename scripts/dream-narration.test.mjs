import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alignmentToWords, fitVoice } from './dream-narration-utils.mjs';

test('converts character timestamps to complete word captions', () => {
  const words = alignmentToWords({ characters: [...'Hai kamu!'], character_start_times_seconds: [0, .1, .2, .3, .4, .5, .6, .7, .8], character_end_times_seconds: [.1, .2, .3, .4, .5, .6, .7, .8, .9] });
  assert.equal(words[0].text, 'Hai');
  assert.equal(words[1].text, ' kamu!');
  assert.equal(words[1].startMs, 400);
  assert.equal(words[1].endMs, 900);
});

test('fits long speech without truncating words and never slows short speech', () => {
  assert.deepEqual(fitVoice(5, 7), { playbackRate: 1, duration: 5 });
  const result = fitVoice(8, 7);
  assert.equal(result.duration, 7);
  assert.equal(result.playbackRate, 8 / 7);
  assert.throws(() => fitVoice(14, 7), /too long/);
});
