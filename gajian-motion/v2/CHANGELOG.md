# Gajian — V2 production notes

## Perubahan dari V1

| Aspek | V1 | V2 |
|---|---|---|
| Art direction | Comic poster, navy/kuning, burst radial | Editorial vector, ivory/near-black/coral/lime/lavender |
| Tipografi | Anton, extrusion dan pop seragam | Space Grotesk Bold / Archivo Black; angka terurai, type ekspansif, CTA elastis |
| Karakter | Figur outline kecil, pose preset | Rig vector baru tanpa outline tebal, anggota tubuh/facial terpisah, footprint lebih besar |
| Adegan pembuka | Reveal ponsel lalu poster gajian | Angka langsung hadir, karakter meloncat ke platform saldo |
| Transisi | Panel diagonal menutup perubahan layout | Platform saldo berubah menjadi uang; kalender mengembang dan berubah menjadi dompet |
| Pengeluaran | Empat kartu besar di tengah layout | Serangan coral, tumble karakter, kartu beruntun dan lembar uang terlepas |
| Saldo | Dashboard perbankan | Angka fisik dengan digit jatuh, tangan menjangkau saldo, ukuran menyusut ke Rp12.500 |
| Beat hening | Detik 20 | Detik 19–24, musik/SFX benar-benar berhenti |
| Ending | Meja dan kalender statis | Kalender membesar, berubah jadi dompet kosong, karakter jatuh ke dalam, CTA hold >1,5 detik |
| Audio | Comic funk/brass | Electronic funk orisinal, percussion kering, cue elastis, cue sheet baru |

## Infrastruktur dipertahankan

- Remotion + React, Playwright, esbuild, FFmpeg dan FFprobe.
- Fungsi spring closed-form dan utilitas easing V1 yang telah diuji.
- Primitive sintesis audio V1, tetapi arrangement, timing dan cues V2 baru.
- Font dimuat lokal; tidak memakai remote assets atau bank nyata.
- Source/render V1 tidak ditimpa.

## Lokasi source

- `src/GajianV2/`: Opening, Attack, Deduction, Silence, Finale, Performer, Objects, motion.
- `scripts/gajian-v2/`: render, preview seek adapter, audio, verify, motion tests.
- `public/gajian-v2/audio/`: stem, mix final, cue sheet dan pengukuran loudness.
- `gajian-motion/v2/output/`: deliverable V2; terpisah dari folder output V1.

## Perintah

```sh
npm run dev
# Studio: http://localhost:3000/GajianV2
npm run gajian-v2:audio
npm run gajian-v2:test
npm run gajian-v2:style
npm run gajian-v2:prototype
npm run gajian-v2:storyboard
npm run gajian-v2:render
npm run gajian-v2:verify
```

`window.seek(t)` mengambil detik dan memilih frame terdekat. Rig dan gerak merupakan fungsi waktu murni. Renderer memakai software SVG rasterization agar pembulatan subpixel tidak berbeda saat seek terbalik. Tidak menggunakan CSS animation atau physics berbasis akumulasi frame.

## Tahapan produksi

1. Membaca skill asli dan mengaudit source/contact sheet/60 frame progression dari MP4 V1.
2. Membuat style system, rig editorial baru dan style sheet pembuka.
3. Merender prototipe 7 detik/210 frame dan menginspeksi 21 frame progression.
4. Memperbaiki overlap kepala/judul dan menyusun sisa cerita.
5. Membuat storyboard 30 keyframe, memperbaiki jalur kartu/wajah dan saldo/kepala.
6. Render ulang prototype yang telah diperbaiki, lalu render 900 frame final.
7. Verifikasi kedua MP4 melalui FFprobe, decode penuh, blackdetect, dan loudness.

## Pemeriksaan output

Prototipe berdurasi 7,000 detik / 210 frame. Final berdurasi 30,000 detik / 900 frame. Keduanya 1080×1920, 30 fps, H.264/yuv420p, AAC stereo 48 kHz. Pemeriksaan decode penuh dan blackdetect dilakukan dengan FFmpeg; browser Chromium membuka kedua MP4 dan melakukan seek pada beberapa bagian. Hasil terperinci tersedia di `output/verification.json` serta `output/playback-check.json`.

Frame representatif diuji maju dan mundur dengan SHA-256 screenshot yang identik pada 30 waktu sampel. Font Space Grotesk/Archivo Black termuat lokal, tanpa browser runtime error. Full-sequence progression dan aksi masuk dompet diinspeksi dari MP4 hasil encode. Tes keuangan/rig dan silence stem lulus; ESLint/TypeScript lulus.

Loudness final terukur sekitar **−15,08 LUFS**, true peak **−1,25 dBTP**; prototipe sekitar **−15,30 LUFS / −1,98 dBTP**. Headroom disisakan untuk menghindari lonjakan AAC. Sumber WAV tidak memiliki sample nonzero selama detik 19–24.

V1 master dan TikTok dicek terhadap SHA-256 manifest sebelumnya: keduanya tetap identik, tidak tertimpa.

## Paket source portabel

ZIP `output/gajian-v2-editable-source.zip` menyertakan source V2, audio, serta dua helper V1 yang memang dipakai kembali. Setelah ekstrak dan `npm install`, buka hanya V2 dengan:

```sh
npx remotion studio scripts/gajian-v2/entry.tsx
```

Buat ulang paket dengan `python -I scripts/gajian-v2/package.py`.

## Catatan jujur

- Ini limited-animation vector rig, bukan full hand-drawn frame-by-frame.
- Perubahan shape menggunakan geometri/rounded rectangle dan masked/opacity handoff; bukan morph font-outline topologis penuh.
- Pipeline SVG memakai gerak tajam tanpa post motion-blur global. Teks sengaja tidak diburamkan.
- Persentase palet dipakai sebagai arah keseluruhan, bukan pengukuran pixel per frame.
- Audio sepenuhnya sintesis orisinal; tanpa voice-over dan tanpa rekaman instrumen nyata.
- Copy tambahan: `Tanggal favorit semua orang.`, `Satu notifikasi. Seribu rencana.`, `Bulan ini, aman. Kayaknya.`, `Saldo tebal. Gaya ikut tebal.`, `Baru senang sebentar.`, `Yang pergi bukan cuma dia.`, `Kosong.`
