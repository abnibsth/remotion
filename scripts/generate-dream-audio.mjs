import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const frequency = (note) => 440 * 2 ** ((note - 69) / 12);

// Original, deterministic score: no downloaded samples or external services.
export function synthesizeDreamTrack(rate = 44100) {
  const samples = new Float32Array(40 * rate * 2);
  const chords = [[57, 60, 64, 71], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 69]];
  const melody = [76, 71, 72, 79, 76, 72, 71, 67, 69, 72, 76, 79, 81, 79, 76, 72];
  const events = [3.4, 8.1, 16, 24, 33.5, 35];
  for (let i = 0; i < samples.length / 2; i++) {
    const t = i / rate;
    const chord = chords[Math.floor(t / 4) % chords.length];
    const beat = t % 0.4;
    const index = Math.floor(t / 0.4);
    const arp = frequency(chord[index % 4] + 12);
    const square = Math.sin(2 * Math.PI * arp * t) >= 0 ? 1 : -1;
    const pluck = square * 0.028 * Math.exp(-beat * 12) * Math.min(1, beat * 150);
    const leadBeat = t % 0.8;
    const lead = Math.sin(2 * Math.PI * frequency(melody[Math.floor(t / 0.8) % 16]) * t) * 0.035 * Math.exp(-leadBeat * 4) * Math.min(1, leadBeat * 80);
    let pad = 0;
    for (const n of chord) pad += Math.sin(2 * Math.PI * frequency(n) * t) * 0.018;
    const bass = Math.sin(2 * Math.PI * frequency(chord[0] - 12) * t) * 0.045 * (0.7 + 0.3 * Math.cos(t * Math.PI * 5));
    let magic = 0;
    for (const start of events) {
      const dt = t - start;
      if (dt >= 0 && dt < 1.6) {
        const n = [72, 76, 79, 84][Math.min(3, Math.floor(dt / 0.12))];
        magic += Math.sin(2 * Math.PI * frequency(n) * dt) * 0.09 * Math.exp(-dt * 2.4) * Math.min(1, dt * 100);
      }
    }
    const fade = Math.min(1, t / 1.5, (40 - t) / 2);
    const pan = Math.sin(t * 0.7) * 0.18;
    const mono = (pluck + lead + pad + bass + magic) * fade;
    samples[i * 2] = mono * (1 - pan);
    samples[i * 2 + 1] = mono * (1 + pan);
  }
  return samples;
}

export function encodeWav(samples, rate) {
  const wav = Buffer.alloc(44 + samples.length * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVE', 8);
  wav.write('fmt ', 12); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(2, 22); wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 4, 28);
  wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36);
  wav.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((sample, i) => wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), 44 + i * 2));
  return wav;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = path.resolve('public/dream-dungeon');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'dream-score.wav'), encodeWav(synthesizeDreamTrack(), 44100));
  console.log('Generated original 40-second stereo dream score.');
}
