import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { alignmentToWords, fitVoice } from './dream-narration-utils.mjs';

process.loadEnvFile('.env.local');
const key = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
if (!key || !voiceId || !/^[A-Za-z0-9_-]+$/.test(voiceId)) throw new Error('Configure a valid ElevenLabs API key and Bian voice ID in .env.local');

const scenes = [
  { id: 'bedroom', from: 0.5, budget: 6.8, text: 'Saat kamu tertidur, petualangan otakmu belum berakhir. Sebuah portal membuka jalan menuju dunia mimpi.' },
  { id: 'arrival', from: 8.2, budget: 6.8, text: 'Pulau melayang, langit berbintang. Kenapa mimpi bisa terasa nyata, sekaligus begitu aneh?' },
  { id: 'guardian', from: 16.2, budget: 6.8, text: 'Penjaga Mimpi punya petunjuk. Tubuhmu beristirahat, tetapi otakmu tetap aktif. Mimpi yang jelas sering muncul saat tidur REM.' },
  { id: 'rem', from: 24.2, budget: 9, text: 'Ingatan dan emosi dapat berpadu menjadi cerita yang tak biasa. Mimpi mungkin membantu pemrosesan keduanya. Namun, fungsi pasti mimpi masih diteliti.' },
  { id: 'victory', from: 34.2, budget: 5.4, text: 'Misi selesai! Kamu mendapatkan Kristal Mimpi. Saat kamu tidur, otakmu tetap bekerja.' },
];
const clips = [];
for (const scene of scenes) {
  const dir = path.resolve('public/dream-dungeon/narration', scene.id);
  const cache = path.resolve('.cache/dream-voice', scene.id);
  mkdirSync(dir, { recursive: true });
  mkdirSync(cache, { recursive: true });
  const resultFile = path.join(cache, 'response.json');
  let result;
  if (existsSync(resultFile)) {
    result = JSON.parse(readFileSync(resultFile, 'utf8'));
    if (result.script !== scene.text) throw new Error(`Cached script differs for ${scene.id}; review before regenerating paid audio`);
    console.log(`Using cached ${scene.id}`);
  } else {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: scene.text, model_id: 'eleven_multilingual_v2', language_code: 'id', voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1.05 } }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs ${response.status}: ${String(body.detail?.status ?? 'generation failed')}. No secret values logged.`);
    }
    result = { ...(await response.json()), script: scene.text };
    if (!result.audio_base64 || !result.alignment) throw new Error(`Missing audio/alignment for ${scene.id}`);
    writeFileSync(resultFile, JSON.stringify(result));
  }
  const audioFile = path.join(dir, 'voice.mp3');
  writeFileSync(audioFile, Buffer.from(result.audio_base64, 'base64'));
  const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', audioFile], { encoding: 'utf8' }).trim());
  const fit = fitVoice(duration, scene.budget);
  const captions = alignmentToWords(result.alignment).map((word) => ({ ...word, startMs: Math.round(word.startMs / fit.playbackRate + scene.from * 1000), endMs: Math.round(word.endMs / fit.playbackRate + scene.from * 1000), timestampMs: Math.round(word.timestampMs / fit.playbackRate + scene.from * 1000) }));
  clips.push({ id: scene.id, from: scene.from, duration: fit.duration, playbackRate: fit.playbackRate, text: scene.text, src: `dream-dungeon/narration/${scene.id}/voice.mp3`, captions });
  console.log(`${scene.id}: source ${duration.toFixed(2)}s, timeline ${fit.duration.toFixed(2)}s, rate ${fit.playbackRate.toFixed(3)}`);
}
writeFileSync('src/DreamDungeon/narration.json', JSON.stringify(clips, null, 2) + '\n');
console.log('Narration and word timestamps generated.');
