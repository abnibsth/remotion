import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';
const helper = readFileSync('src/DreamDungeon/voice-timing.ts', 'utf8');
const exports = {};
new Function('exports', ts.transpileModule(helper, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports);
const transcript = JSON.parse(readFileSync('out/dream-voice-transcript.json', 'utf8'));
const playbackRate = 1.01;
const words = exports.toVideoCaptions(transcript.segments.flatMap((segment) => segment.words), playbackRate);
const data = {
  src: 'dream-dungeon/ElevenLabs_2026-10-15T13_31_34_Bian - Neutral, Calm and Clear_pvc_sp100_s50_sb75_v4.mp3',
  sourceDuration: transcript.duration,
  playbackRate,
  duration: transcript.duration / playbackRate,
  words,
  pages: exports.buildCaptionPages(words, 9),
};
if (data.duration > 40 || words.some((word) => word.endMs > 40000)) throw new Error('Recording exceeds video duration');
writeFileSync('src/DreamDungeon/recording.json', JSON.stringify(data, null, 2) + '\n');
console.log(`Prepared ${words.length} words, ${data.pages.length} pages; audio fits ${data.duration.toFixed(3)} seconds.`);
