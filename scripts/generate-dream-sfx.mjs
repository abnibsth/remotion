import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { encodeWav } from './generate-dream-audio.mjs';

const durations = { portal: 2.2, quest: 0.75, magic: 1.4, crystal: 1.5, victory: 2.2 };
const frequency = (note) => 440 * 2 ** ((note - 69) / 12);

export function synthesizeEffect(kind, rate = 44100) {
  const duration = durations[kind];
  if (!duration) throw new Error('Unknown sound effect');
  const samples = new Float32Array(Math.ceil(duration * rate) * 2);
  for (let i = 0; i < samples.length / 2; i++) {
    const t = i / rate;
    const envelope = Math.min(1, t / 0.015, (duration - t) / 0.2);
    let tone;
    if (kind === 'portal') {
      const phase = 2 * Math.PI * (95 * t + 100 * t * t);
      tone = (Math.sin(phase) + Math.sin(phase * 1.5) * 0.4) * 0.15 * Math.sin(Math.PI * t / duration);
    } else {
      const notes = kind === 'victory' ? [72, 76, 79, 84, 79, 84] : kind === 'quest' ? [76, 83, 88] : kind === 'crystal' ? [84, 88, 91, 96] : [72, 79, 84, 88, 91];
      const stepDuration = kind === 'victory' ? 0.2 : 0.11;
      const index = Math.min(notes.length - 1, Math.floor(t / stepDuration));
      const noteTime = t - index * stepDuration;
      const f = frequency(notes[index]);
      const sine = Math.sin(2 * Math.PI * f * t);
      const wave = kind === 'quest' || kind === 'victory' ? (sine >= 0 ? 0.6 : -0.6) + sine * 0.4 : sine + Math.sin(2 * Math.PI * f * 2 * t) * 0.22;
      tone = wave * 0.19 * Math.exp(-noteTime * 4);
    }
    const pan = Math.sin(t * 2) * 0.12;
    samples[i * 2] = tone * envelope * (1 - pan);
    samples[i * 2 + 1] = tone * envelope * (1 + pan);
  }
  return samples;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve('public/dream-dungeon/sfx');
  mkdirSync(dir, { recursive: true });
  for (const kind of Object.keys(durations)) writeFileSync(path.join(dir, `${kind}.wav`), encodeWav(synthesizeEffect(kind), 44100));
  console.log('Generated five original RPG sound effects locally.');
}
