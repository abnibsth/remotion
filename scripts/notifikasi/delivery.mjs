import fs from 'node:fs/promises';
import path from 'node:path';
const dir=path.resolve('out/notifikasi-overload');
const verification=JSON.parse(await fs.readFile(path.join(dir,'verification.json'),'utf8'));
const report=[
  '# NOTIFIKASI OVERLOAD! — Production summary',
  '',
  'Video Bahasa Indonesia, 20.000 detik, 1080 × 1920, 9:16, 30 fps, 600 frame.',
  '',
  '## Deliverables',
  ...verification.files.map(f=>`- ${f.name}: ${(f.bytes/1000000).toFixed(2)} MB; ${f.loudnessLUFS} LUFS; ${f.truePeakDbTP} dBTP; H.264/yuv420p + AAC stereo 48 kHz; fast-start.`),
  '- contact-sheet.png: 12 keyframes dari ketujuh scene.',
  '- notifikasi-overload-source.zip: source Remotion standalone, aset audio, renderer, tes, dan panduan. Tidak berisi .env, node_modules, atau proyek lama.',
  '',
  '## Production',
  'Ilustrasi SVG karakter fiktif dan UI fiktif. Palet navy/cream/yellow/red, Anton lokal dan Inter 800/900. Closed-form springs, seeded grain, camera push/shake, diagonal comic wipes, stepped character reaction, dan hard cut ke silence di 12.500 detik.',
  'Musik elektronik 120 BPM dan seluruh SFX dibuat orisinal dengan Python/NumPy. Tidak menggunakan audio stok atau sampel pihak ketiga. No voice-over.',
  'Komposisi dapat diedit di Remotion Studio: http://localhost:3000/NotifikasiOverload. Renderer Playwright menjalankan komponen React yang sama via window.seek(t), menangkap 600 PNG, lalu FFmpeg menghasilkan master CRF16 dan social 2-pass 8 Mbps.',
  '',
  '## Verified',
  ...verification.checks.map(c=>`- ${c}.`),
  '- Tes motion 5/5; TypeScript, ESLint, production bundle, dan Studio playback berhasil.',
  '- Contact sheet ditinjau dua kali; posisi notifikasi, safe area, teks pendukung dan iris reveal diperbaiki. Boundary MP4 dan final frame juga diperiksa.',
  '',
  '## Dependencies and limitations',
  'spring-motion dan motion-studio tidak tersedia. Fungsi spring deterministik dan pipeline Playwright + FFmpeg dibuat sebagai pengganti. Root SKILL.md adalah referensi pop-cinematic-motion.',
  'Audio adalah sintesis; karakter dianimasikan dari SVG berbasis kode, bukan ilustrasi frame-by-frame manual. Voice-over tidak dibuat (opsional dalam brief). Notifikasi periferal sengaja sebagian terpotong saat chaos; pesan utama tetap di safe area.',
  'Copy UI/gag tambahan dan cara mengubahnya dijelaskan di src/Notifikasi/README.md.',
  '',
];
await fs.writeFile(path.join(dir,'production-summary.md'),report.join('\n'));
console.log('Production summary generated from verified final files.');
