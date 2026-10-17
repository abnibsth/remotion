import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLoudness} from './loudness.mjs';
test('parses loudnorm JSON followed by ffmpeg progress summary',()=>{
 const stderr='[Parsed_loudnorm_0]\n{\n "input_i": "-14.2", "input_tp": "-1.0"\n}\n[out#0/null] video:360KiB audio:21750KiB';
 assert.throws(()=>JSON.parse(stderr.slice(stderr.lastIndexOf('{'))),SyntaxError);
 assert.deepEqual(parseLoudness(stderr),{input_i:'-14.2',input_tp:'-1.0'});
 assert.throws(()=>parseLoudness('No measurement'),/Missing/);
});
