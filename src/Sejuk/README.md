# SEJUK SIGAP — AC MATI, HATI PANAS

Promo fiktif 9:16, 1080×1920, 30 fps, 29 detik / 870 frame.

## Preview dan render

- Remotion Studio: `npm run dev`, komposisi `SejukSigap` / `http://localhost:3000/SejukSigap`.
- Tes motion: `npm run sejuk:test`.
- Sintesis ulang audio + grain: `npm run sejuk:audio` (Python + NumPy, FFmpeg di PATH).
- Contact sheet: `npm run sejuk:contact`.
- Render seluruh frame dan dua ekspor: `npm run sejuk:render`. Chromium diganti setiap 90 frame untuk membatasi akumulasi memori pada capture panjang.
- Recovery opsional: `npm run sejuk:render -- --resume`. Hanya PNG lengkap yang dipakai ulang; renderer membandingkan frame sampel cache dengan build aktif dan menolak resume jika hasil berbeda. Jika ditolak, lakukan render penuh tanpa `--resume`.
- Verifikasi output: `npm run sejuk:verify`.
- Jika browser tidak otomatis ditemukan, set `CHROME_PATH` ke executable Chrome/Chromium/Edge yang sudah terpasang. Tidak ada download browser otomatis.

## Output

Di `out/sejuk/`:

- `sejuk-master.mp4`: H.264 CRF16, AAC192k.
- `sejuk-delivery.mp4`: H.264 2-pass7800k (≈8 Mbps, memberi margin agar ukuran tetap di bawah30MB), maxrate12000k, bufsize16000k, AAC192k, faststart.
- `contact-sheet.png`: 64 frame termasuk semua beat120BPM dan beberapa event penting.
- `contact-sheet-before-fixes.png`: contact sheet sebelum perbaikan visual.
- `render-report.json`: font, error browser/resource/console, uji hash seek, metadata video.
- `final-verification.json`: verifikasi master/delivery dan loudness delivery setelah AAC.
- `frames/`: 870 PNG sumber ekspor.

## Timing

| Waktu     | Adegan                  |
| --------- | ----------------------- |
| 0–3       | Hook kamar panas        |
| 3–7.5     | Janji sebentar lagi     |
| 7.5–11.5  | Harga gaib              |
| 11.5–15   | Montir ilang            |
| 15–16.5   | Tenang / musik drop     |
| 16.5–19.5 | Reveal badge / wordmark |
| 19.5–23.5 | UI tiga langkah         |
| 23.5–26.5 | Gag dingin              |
| 26.5–29   | End card                |

## Implementasi

Root `SKILL.md` dibaca. Skill terpisah `spring-motion` / `motion-studio` tidak terpasang, jadi kontraknya diimplementasikan langsung: `motion.ts` memakai solusi analitik spring under/critical/overdamped, preview menyediakan `window.seek(t)` melalui React `flushSync`, renderer memakai Playwright + FFmpeg. Tidak mengklaim menggunakan paket/skill yang tidak tersedia.

`SejukFrame({time})` sama untuk Studio dan capture. Tidak ada CSS transition, CSS animation, requestAnimationFrame, atau Math.random pada source animasi. Noise memakai seed; visual adegan masalah dan gag diposterize8fps; transisi/flash/shake memakai waktu riil. Setiap seek preview me-remount stage untuk menghindari cache raster SVG/filter dari adegan sebelumnya. Capture reverse-order dan pengulangan screenshot memeriksa determinisme.

Audio disintesis NumPy120BPM: kick, clap, hat, bass, pluck, whoosh, jam, chat, thud, beep, bel, ding, dan hembusan angin. Musik drop15–16.5; total silence15.23–16.49 setelah scratch/whoosh. Loudnorm I=-14 TP=-1 LRA=11, dengan limiter setelah resampling; WAV terukur−14.29LUFS /−1.01dBTP.

Ilustrasi orang, montir, kucing, ruangan, badge, nota, dan UI digambar khusus menggunakan SVG. Tidak memakai tokoh, merek, atau screenshot aplikasi nyata. Peta UI adalah skema fiktif, bukan peta geografis. Foto kucing pada brief ditafsirkan sebagai kartu gambar kucing komik agar konsisten dengan gaya.

## QA visual

Contact sheet awal dilihat langsung. Tiga koreksi prioritas:

1. Tulisan NGIIING tertutup rambut → dipindah ke burst foreground di samping kepala.
2. Caption adegan menabrak kaki karakter → label masalah diberi panel terpisah, caption Tenang dipindah ke ruang di bawah headline; karakter Tenang diturunkan.
3. Efek kismis kurang terbaca → shrink diperbesar dan warna/wrinkles dipertegas.

Contact sheet ditangkap ulang dan dilihat lagi. Pemeriksaan seek awal menemukan satu hash gag tidak stabil akibat cache raster saat stage dipakai ulang; keyed stage menghilangkannya tanpa timer atau animation loop.

## Semua teks dan label

Daftar lengkap: [COPY.json](COPY.json). Memisahkan copy dari brief dan copy tambahan karangan. File ini adalah inventaris, bukan konfigurasi runtime; ganti string di file adegan yang tercantum di `edit_locations`.

Semua harga, ETA15menit, gratis cek kerusakan, dan klaim ketepatan waktu adalah materi fiktif untuk demo, bukan jaminan layanan nyata. Tombol unduh adalah visual, tidak mengarah ke aplikasi nyata. Belum ada voice-over.
