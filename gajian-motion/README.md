# Gajian Baru Masuk, Udah Habis?!

Animasi comic-pop editorial orisinal, enam adegan. Bahasa Indonesia; karakter dan transaksi fiktif. Tidak menggunakan merek bank, foto orang nyata, stok karakter, atau rekaman musik pihak ketiga.

## Hasil produksi

Semua hasil render berada di `gajian-motion/output/`:

- `gajian-master.mp4` — H.264 CRF16, yuv420p, AAC stereo 320 kb/s, 48 kHz, faststart.
- `gajian-tiktok.mp4` — H.264 two-pass dengan target 7,5 Mb/s, AAC stereo dari stream master (tanpa generasi lossy tambahan), 48 kHz, faststart.
- `contact-sheet.png` — 25 frame representatif dari keenam adegan.
- `keyframes/` — PNG resolusi penuh untuk pemeriksaan visual.
- `preview-check.json` — pemeriksaan font, safe area, runtime, dan determinisme seek.
- `verification.json` — hasil FFprobe, decode penuh, loudness, true peak, dan metadata kedua MP4.

Spesifikasi target: **1080 × 1920, 30 fps, 900 frame, tepat 30 detik**.

## Hasil QC render final

Kedua MP4 telah diverifikasi menggunakan FFprobe dan decode penuh FFmpeg:

- Tepat 30,000 detik, 900 frame, 1080 × 1920, 30 fps.
- H.264, yuv420p, AAC stereo 48 kHz, faststart aktif.
- Master: 18.092.788 byte; TikTok: 26.962.331 byte.
- Keduanya: **−13,9 LUFS**, **−1,2 dBTP**, tanpa error decoding.
- Tidak terdeteksi interval nyaris hitam ≥0,10 detik.
- 25 keyframe lolos seek SHA-256 teracak, font lokal termuat, tiga viewport tanpa error runtime, serta teks utama di safe area.
- Lima tes motion/perhitungan dan lima tes audio lulus. ESLint dan TypeScript proyek lulus.
- Adegan hening dan frame akhir diperiksa pada PNG resolusi penuh.

Versi TikTok menyalin AAC dari master karena encode ulang AAC 192 kb/s sempat menaikkan true peak. Script render sudah memakai stream copy agar masalah ini tidak berulang. Master lebih kecil dari versi bitrate-target karena grafis flat dapat dikompresi sangat efisien dengan CRF; ini bukan tanda kualitas master lebih rendah.

## Preview dan edit

Dari root proyek:

```sh
npm install
npm run dev
```

Buka `http://localhost:3000/Gajian`. Keenam adegan juga terdaftar terpisah dalam folder `Gajian-Scenes` di Remotion Studio.

Source utama:

| File | Fungsi |
| --- | --- |
| `src/Gajian/index.tsx` | Timeline, audio, transisi diagonal, composition utama |
| `src/Gajian/motion.mjs` | Token warna, spring closed-form, timing, saldo, seeded hash |
| `src/Gajian/design.tsx` | Tipografi, ponsel, uang, confetti, tekstur, UI reusable |
| `src/Gajian/Character.tsx` | Karakter SVG berlapis, anggota tubuh, ekspresi, aksesori |
| `src/Gajian/SalaryScene.tsx` | 00:00–00:04: notifikasi gaji dan perayaan |
| `src/Gajian/SultanScene.tsx` | 00:04–00:08: kacamata, takhta, uang parallax |
| `src/Gajian/RealityScene.tsx` | 00:08–00:14: empat serangan pengeluaran dan ledger |
| `src/Gajian/BalanceScene.tsx` | 00:14–00:20: saldo berkurang dan kebutuhan lain |
| `src/Gajian/SilenceScene.tsx` | 00:20–00:25: hard cut, hening, saldo Rp12.500 |
| `src/Gajian/WaitingScene.tsx` | 00:25–00:30: kalender, dompet kosong, punchline |
| `scripts/gajian/preview.tsx` | Adapter frame Remotion, `window.seek(t)` dan `window.ready` |
| `scripts/gajian/render.mjs` | Esbuild, Chromium, Playwright, PNG, FFmpeg encode |
| `scripts/gajian/audio.py` | Sintesis musik dan SFX orisinal, normalisasi loudness |
| `scripts/gajian/verify.mjs` | Verifikasi output final |

Font Anton dan Inter dimuat lokal dari paket `@fontsource`, tanpa layanan font eksternal.

## Paket source portabel

`gajian-motion/output/gajian-editable-source.zip` berisi source enam adegan, karakter, motion library, script render/QC, WAV/stem audio, dan dependency manifests. Tidak menyertakan `node_modules`, 900 PNG sementara, atau video proyek lain.

Setelah ekstrak ke direktori kosong:

```sh
npm install
npx remotion studio scripts/gajian/entry.tsx
```

Entry khusus ini hanya mendaftarkan `Gajian`, sehingga paket tidak membutuhkan composition lain dari proyek asal. Untuk render, perintah `npm run gajian:render` tetap tersedia. Buat ulang ZIP menggunakan `node scripts/gajian/package-source.mjs`.

## Audio

Aset berada di `public/gajian/audio/`:

- `music.wav`: stem musik comic-funk orisinal 120 BPM.
- `sfx.wav`: stem efek suara orisinal.
- `mix.wav`: campuran sebelum normalisasi, bukan input render final.
- `mix-normalized.wav`: campuran final, input kedua render dan Remotion Studio.
- `events.json`: cue sheet dalam detik dan sample.
- `loudness-report.json`: pengukuran WAV dan validasi.

Semua WAV: stereo, PCM24, 48 kHz, 30 detik. Musik berhenti tepat 20,000 detik; 20,000–20,700 detik digital silence. Setelah itu hanya ambience sangat pelan dan aksen komedi terisolasi. Tanpa voice-over; cerita dapat dipahami tanpa narasi.

Untuk regenerasi audio, dibutuhkan Python dan NumPy:

```sh
python -m pip install numpy
npm run gajian:audio
python -I scripts/gajian/test_audio.py
```

## Render dan QC

Dibutuhkan Node.js, browser Chromium/Chrome terpasang, FFmpeg, dan FFprobe pada PATH. Tidak ada pengunduhan browser otomatis. Bila deteksi browser tidak berhasil, atur `CHROME_PATH` ke executable yang sudah terpasang.

```sh
npm run gajian:test
npm run lint
npm run gajian:preview
# Periksa contact-sheet.png sebelum render penuh.
npm run gajian:render
npm run gajian:verify
# Opsional: pemeriksaan interval frame nyaris hitam.
node scripts/gajian/verify.mjs --blackdetect
```

Renderer menggunakan komponen React/Remotion yang sama dengan Studio, melalui `Thumbnail` untuk penangkapan frame. `window.seek(t)` menerima detik dan memilih frame terdekat, dibatasi 0–899. Render selalu meminta `seek(frame / 30)`. Tidak ada physics berbasis akumulasi frame, CSS animation, atau random tanpa seed. Pemanggilan seek teracak dibandingkan dengan SHA-256 screenshot baseline untuk semua 25 beat.

## Perhitungan saldo

| Transaksi | Potongan | Saldo setelah transaksi |
| --- | ---: | ---: |
| Gaji awal | — | Rp5.000.000 |
| Kos | Rp1.500.000 | Rp3.500.000 |
| Makan | Rp1.200.000 | Rp2.300.000 |
| Cicilan | Rp1.000.000 | Rp1.300.000 |
| Transport | Rp500.000 | Rp800.000 |
| Kebutuhan lain | Rp787.500 | **Rp12.500** |

Total pengeluaran Rp4.987.500. Angka di antara checkpoint merupakan counter transisi, bukan transaksi tambahan.

## Copy tambahan yang dapat diganti

Selain teks brief: `DOMPET DEMO`, `Hari Paling Ditunggu`, `Mental Jutawan`, `Plot Twist Bulanan`, `Simulasi Keuangan Fiktif`, `Hening Sejenak`, `Siklus Kehidupan`, `Catatan Akhir Bulan`, `Halo, pejuang kantor.`, `Bulan ini, aman.`, `Akhirnya, tanggal gajian.`, `Kerja keras terbayar juga.`, `Realita menyerang.`, `Gaji: masuk. Tagihan: ikut masuk.`, `Uangnya ke mana?`, `Habis?!`, `Masih 25 hari lagi.`, serta keterangan bahwa ilustrasi ini fiktif.

## Batasan dan substitusi

- Referensi utama: `SKILL.md` di root, bernama `pop-cinematic-motion` dalam frontmatter. Direktori skill terpisah dengan nama tersebut tidak tersedia.
- Skill `spring-motion` dan `motion-studio` terpisah tidak tersedia. Diganti spring closed-form deterministik dan pipeline Playwright/FFmpeg, tanpa dependency animasi baru.
- Pendekatan karakter adalah limited-animation SVG editorial, bukan full frame-by-frame animation atau simulasi kain.
- Musik, brass, piano, dan trombone dibuat melalui sintesis, bukan rekaman instrumen akustik.
- Kalender fiktif memakai 28 hari dan menunjukkan 25 hari tersisa; bukan kalender bulan/tahun nyata.
- WAV deterministik pada toolchain yang sama. Encoding/normalisasi dapat berbeda sedikit bila versi FFmpeg berubah.
- File video besar, WAV, dan frame render diabaikan Git; tetap tersedia di disk. Regenerasikan audio sebelum render di checkout baru.
