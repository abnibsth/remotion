# NOTIFIKASI OVERLOAD!

Video comic-pop orisinal, Bahasa Indonesia. 20 detik, 1080 × 1920, 30 fps, 600 frame.

## Preview dan editing

Jalankan dari root proyek:

```sh
npm install
npm run dev
```

Pilih **NotifikasiOverload** di Remotion Studio, atau buka `http://localhost:3000/NotifikasiOverload`. Tujuh scene juga terdaftar sendiri di folder **Notifikasi-Scenes**. Struktur proyek dan komposisi lama tetap dipertahankan.

- `index.tsx`: timeline Remotion dan audio.
- `Hook.tsx` s.d. `Payoff.tsx`: tujuh scene yang bisa diedit terpisah.
- `design.tsx` dan `style.css`: ilustrasi SVG, karakter fiktif, smartphone, kartu notifikasi, font dan token.
- `motion.mjs`: closed-form springs, seeded noise, scene boundaries dan camera shake.
- `View.tsx`: komposisi visual bersama untuk Remotion dan capture browser.
- `../../scripts/notifikasi/preview.tsx`: adapter `window.seek(t)`; waktu dalam detik, independen dari frame sebelumnya.

## Reproduksi output

Prasyarat: Node.js, Python 3 + NumPy, FFmpeg dan ffprobe di PATH, serta Chromium yang sudah terpasang.

```sh
npm run notifikasi:test
npm run notifikasi:audio
npm run notifikasi:preview
# Tinjau out/notifikasi-overload/contact-sheet.png sebelum render penuh.
npm run notifikasi:render
npm run notifikasi:verify
```

Renderer menggunakan Playwright untuk menangkap **600 PNG 1080 × 1920**, kemudian FFmpeg untuk H.264/yuv420p/CFR 30 fps, AAC stereo 48 kHz, fast-start MP4. Master CRF 16; social 2-pass sekitar 8 Mbps. Audio MP4 hasil encode diuji lagi, bukan hanya WAV sumber.

Chromium Windows yang ditemukan otomatis berada di `%LOCALAPPDATA%/ms-playwright/chromium-1234/chrome-win64/chrome.exe`. Di komputer lain, set `CHROME_PATH` ke executable Chromium/Chrome yang telah terpasang. Tidak ada download browser otomatis. NumPy dapat dipasang dengan `python -m pip install numpy` bila belum tersedia.

Alternatif ekspor langsung memakai Remotion:

```sh
npx remotion render src/index.ts NotifikasiOverload out/notifikasi-overload/remotion-export.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p
```

File yang diserahkan diproduksi dengan pipeline Playwright + FFmpeg; bukan perintah alternatif di atas. Kedua jalur memakai komponen visual React yang sama.

## Versi 60 FPS

Komposisi **NotifikasiOverload60** di Studio memakai 1200 frame / 60 fps dengan durasi tetap 20 detik. Versi 30 fps tidak diganti.

```sh
node --test scripts/notifikasi/motion.test.mjs scripts/notifikasi/render-settings.test.mjs
node scripts/notifikasi/render.mjs --fps=60
node scripts/notifikasi/render.mjs --full --fps=60
node scripts/notifikasi/verify.mjs --fps=60
```

Output terpisah di `out/notifikasi-overload-60fps/`: master CRF16 dan social 2-pass sekitar 12 Mbps. Setiap frame dihitung langsung dari waktu `frame/60`, bukan duplikasi/interpolasi video 30 fps. Kamera, tipografi, dan UI berjalan 60 fps; reaksi karakter yang sengaja stepped 8 fps serta grain 15 fps tetap dipertahankan. Audio dan cut hening tetap di 12.500 detik (frame 750).

## Timing

| Scene | Detik | Frame |
|---|---|---|
| The hook | 0–2.5 | 0–74 |
| It keeps coming | 2.5–5.5 | 75–164 |
| Total chaos | 5.5–9.5 | 165–284 |
| The breakdown | 9.5–12.5 | 285–374 |
| Silence | 12.5–15.5 | 375–464 |
| The solution | 15.5–18 | 465–539 |
| Final payoff | 18–20 | 540–599 |

Musik dan seluruh notifikasi berhenti di sampel 600000 / 12.500 detik. Room tone sangat pelan menggantikan chaos. Ketukan layar di 15.02 dan 16.35 detik; konfirmasi di 16.40 detik. Audio sintesis orisinal 120 BPM, seed tetap 271828; tidak ada rekaman atau sampel pihak ketiga. Musik dan SFX terpisah tersedia di `public/notifikasi/audio/`.

## Art direction

Referensi utama: root `SKILL.md` (pop-cinematic-motion), dibaca lengkap. `spring-motion` dan `motion-studio` tidak ditemukan terpasang: closed-form springs dan pipeline capture/render dibuat secara eksplisit sebagai pengganti, bukan diklaim sebagai dependensi yang ada.

Anton digunakan sebagai font display condensed dengan bobot bawaan 400 (font ini tidak menyediakan face bold terpisah). Inter 800/900 untuk teks pendukung dan UI. Keduanya lokal via Fontsource; lisensi SIL Open Font License ada dalam paket font.

Semua headline berasal dari brief. Copy tambahan yang dibuat untuk cerita dan bisa diubah: “SEBUAH HARI YANG BIASA.”, kicker MASALAH 01–03, “BARU JUGA DUDUK.”, “SEMUA MINTA CEPAT.”, “OTAK IKUT GETAR.”, “Bisa revisi?”, “Bisa revisi sekarang?”, “Balas dong...”, “OTAK: SEDANG MENGHUBUNGKAN ULANG...”, “Nggak semuanya harus dijawab sekarang.”, “SATU SENTUHAN. AMBIL KENDALI.”, “Dunia tetap jalan. Kamu boleh pelan.”, “OFF DULU. HIDUP DULU.”, “NOTIFIKASI BOLEH RAMAI. KEPALA JANGAN.”, serta label UI fiktif TIM KREATIF, GRUP KANTOR, PROJECT BARU, PENGATURAN FOKUS, Mode hening, Waktunya ambil jeda.

Tidak ada voice-over; cerita disampaikan lewat tipografi, ilustrasi, musik dan SFX. Safe area headline diperiksa secara otomatis dan contact sheet ditinjau visual dua kali. Notifikasi periferal sengaja sebagian keluar bingkai saat chaos; headline, wajah, dan pesan utama tetap diprioritaskan.

## Output dan QC

Di `out/notifikasi-overload/`:

- `notifikasi-overload-social.mp4`
- `notifikasi-overload-master.mp4`
- `contact-sheet.png`
- `transition-check.png`
- `studio-preview.png`
- `verification.json` dan kedua `*-ffprobe.json`
- `preview-check.json`, `audio-report.json`, `audio-normalization.log`
- `frames/`: 600 frame sumber, tidak dimasukkan ke ZIP source agar ukuran tetap praktis.

Batasan: audio disintesis, bukan performa musisi/aktor; ilustrasi karakter adalah SVG buatan kode, bukan frame-by-frame hand animation. Tidak ada peniruan merek/OS atau individu nyata. Penilaian komposisi dilakukan dari still, contact sheet, cut boundaries dan playback Studio; pemeriksaan teknis MP4 meliputi decoding penuh, black-frame scan, loudness, true peak, dan durasi stream.
