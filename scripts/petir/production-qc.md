# Kenapa Petir Bisa Muncul? — Produksi dan QC

## Hasil export terverifikasi

51 pemeriksaan delivery lolos. Master/preview tepat 30.000 detik / 1800 frame / 60 fps; prototype tepat 10.000 detik / 600 frame. Master 1080 × 1920, preview 540 × 960. Semua MP4 H.264/yuv420p + AAC stereo 48 kHz, decode penuh tanpa error dan berhasil seek/play aktual di Chromium. Timestamp frame merata tanpa duplikasi/lompatan. AAC final: **−14.54 LUFS / −1.35 dBTP**. Encode pertama mencapai −0.97 dBTP; gain dikurangi 0.5 dB saat encode ulang audio, tanpa render ulang gambar. 60 sampel motion audit dari final MP4 telah diinspeksi. 11 tes source, TypeScript dan scoped ESLint lolos. **Narasi suara belum tersedia**; naskah/SRT/subtitle dan musik/efek original adalah fallback yang dikirim.

## Konsep

Di balik satu kilatan petir: badai luar → interior awan → tumbukan kristal es/graupel → pemisahan muatan → medan listrik → jalur perintis → penghubung dari tanah → sambaran balik naik → gelombang tekanan/guntur.

Composition Remotion: `KenapaPetirBisaMuncul`, 1080 × 1920, 60 fps, 30 detik / 1800 frame. Prototype: `PetirPrototype`, 10 detik / 600 frame. Semua teks terlihat dan subtitle berbahasa Indonesia. Tidak ada header/footer dekoratif berulang.

## Status narasi — keterbatasan penting

Layanan Edge TTS untuk id-ID-ArdiNeural dan id-ID-GadisNeural gagal dengan WSServerHandshakeError. Tidak ada narasi suara di versi ini; audio berisi ambience, musik dan efek original. Sesuai opsi fallback brief, naskah Indonesia serta berkas SRT bertiming disertakan, dan subtitle Indonesia sudah tertanam di video. Jangan menyebut versi ini memiliki VO. Generator dapat mencoba TTS lagi jika layanan tersedia, atau rekaman pengguna dapat dipasang memakai timing yang sama.

## Visual dan sumber

Tiga cloud plate RGBA dibuat secara original dari seeded multiscale noise menggunakan NumPy/Pillow, tanpa foto eksternal. Lapisan transparan bergerak dengan parallax terkontrol untuk memberi kedalaman 2.5D. Ini bukan simulasi awan volumetrik 3D atau foto badai sungguhan. Kristal dan graupel merupakan model edukatif makro, bukan citra mikroskop.

Warna mengikuti brief: navy badai, slate, violet, cyan, amber, putih kilat. Space Grotesk 700 untuk headline, Inter 500 untuk subtitle, IBM Plex Mono untuk label. Kilatan dibatasi oleh envelope lembut; tidak ada white frame penuh atau strobe berulang. Geometri percabangan tetap seeded dan tidak mendidih acak antarframe.

## Akurasi sains

- Tumbukan melibatkan kristal es dan graupel serta arus naik; partikel kecil naik lebih cepat dalam ilustrasi.
- Tanda positif/negatif ditampilkan sebagai dua wilayah dominan yang disederhanakan. Teks “POLA MUATAN AWAN BISA BERBEDA” mencegah klaim semua badai identik. Tidak menyatakan hanya satu tumbukan menghasilkan seluruh pemisahan muatan.
- Garis medan adalah ilustrasi, bukan kabel fisik. Udara terionisasi digambarkan sebagai bakal kanal, bukan DNS/teknologi futuristik yang tidak relevan.
- Scene sambaran diberi label “CONTOH PETIR NEGATIF AWAN–TANAH”. Petir lain termasuk intracloud tidak dijelaskan sebagai selalu menuju tanah.
- Jalur perintis violet berkembang bertahap ke bawah. Penghubung cyan tumbuh dari tanah ke atas. Sambaran balik putih merambat dari bawah ke atas melalui clip mask terarah setelah keduanya tersambung. Arah arus/gerak elektron tidak disamakan dengan arah front bercahaya.
- Guntur digambarkan sebagai gelombang tekanan akibat pemanasan cepat udara, bukan tabrakan awan. Delay bunyi hook dipilih secara sinematik, bukan angka jarak universal.

### Referensi yang diperiksa

- NOAA NSSL, Severe Weather 101 / Lightning: https://www.nssl.noaa.gov/education/svrwx101/lightning/
- NWS, Negative Cloud-to-Ground Flash: https://www.weather.gov/safety/lightning-science-negative-charged-flash
- NWS, Thunder: https://www.weather.gov/safety/lightning-science-thunder

Dua alamat halaman NWS lama untuk initiation/leaders mengembalikan Page Not Found; tidak diperlakukan sebagai bukti. Halaman negative-charged-flash ditemukan lewat pencarian dan menyatakan front return stroke merambat ke atas.

## Timeline subtitle/naskah

1. 00.350–02.850: Pernah kepikiran, kenapa petir bisa muncul?
2. 03.250–07.650: Di dalam awan badai, partikel es saling bertabrakan.
3. 08.250–13.600: Tumbukan ini membantu memisahkan muatan listrik.
4. 14.300–19.600: Saat medan listrik cukup kuat, udara mulai terionisasi.
5. 20.200–25.600: Terbentuklah jalur listrik, lalu muncul kilatan petir!
6. 26.000–29.900: Udara memanas sangat cepat. Itulah yang menghasilkan guntur.

## Pipeline

`svgAt(seconds)` adalah evaluator visual murni dan dipakai oleh React/Remotion serta preview `window.seek(t)`. Tidak ada CSS animation, physics terakumulasi, unseeded randomness atau ketergantungan urutan frame. Audio original disintesis terpisah. Master dirender Remotion lalu audio dikodekan ulang dari WAV dengan batas durasi untuk menghindari padding AAC menambah panjang container.

```sh
npm run dev
npm run petir:clouds
npm run petir:audio
npm run petir:test
npm run petir:style
npm run petir:prototype
npm run petir:render
npm run petir:verify
npm run petir:seek
```

## QC yang dilakukan

- 6 style frames + 6 transisi, typography/subtitle safe margins dan font diperiksa di Chromium; pixel hash seek acak identik.
- Prototype 10 detik dirender sebelum final: 600 frame 1080 × 1920 / 60 fps, audio/video/container tepat 10.000 detik. Contact sheet hasil encode diperiksa pada ukuran smartphone.
- 11 tes mencakup 1800 state finite SVG, stabilitas geometri seeded, arah leader/streamer/return stroke, batas flash, kecepatan relatif es/graupel, label sains, subtitle maksimal dua baris dan determinisme.
- False positive awal tes finite geometry berasal dari urutan huruf “NaN” di data base64 gambar, bukan koordinat; tes sekarang mengecualikan payload PNG dan tetap memeriksa markup geometri.
- Push-in interior dikurangi untuk mempertahankan safe margin judul. Vignette dikurangi agar label tetap terbaca.
- Verifier akhir menguji metadata tepat, frame timestamp, decode penuh, playback aktual Chromium, font, safe margin, loudness AAC dan akses Studio. Hasil angka final ada di `verification.json`.

## Batasan

Animasi memperlambat proses kilat untuk kejelasan; bukan rekaman kecepatan nyata. Tahap-tahap merupakan penyederhanaan satu skenario, bukan keseluruhan mikroﬁsika badai. Lapisan 2.5D bersifat ilustratif dan transparan, tidak diklaim fotorealistik penuh. Warna sRGB-authored dikodekan ke format video interoperabel BT.709/yuv420p. Tidak ada klaim pemeriksaan pendengaran manusia. VO belum tersedia; naskah dan subtitle adalah fallback yang disengaja dan dilaporkan.
