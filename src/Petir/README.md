# Kenapa Petir Bisa Muncul?

30 detik, 1080 × 1920, 60 fps, 1800 frame. Composition: `KenapaPetirBisaMuncul`; prototype 600 frame: `PetirPrototype`.

`lib/motion.ts` mengatur timeline, subtitle dan fisika ilustratif; `lib/design.ts` berisi awan/lampu/partikel/tipografi; `lib/film.ts` menggabungkan scene. `clouds.json` memuat tiga plate original sebagai data URI agar seek preview dan renderer memakai aset identik. `scripts/petir/clouds.py` meregenerasi aset seeded; `audio.py` meregenerasi efek/musik dan mencoba narasi Indonesia jika layanan tersedia.

Narasi suara belum tersedia pada produksi ini karena koneksi layanan TTS gagal. `public/petir/audio/mix.wav` berisi musik/efek saja. Naskah dan SRT tetap disertakan; subtitle Indonesia tertanam pada visual.

Jalankan `petir:style`, `petir:prototype`, lalu `petir:render`. Validasi dengan `petir:test` dan `petir:verify`. `petir:seek` melayani http://127.0.0.1:3101 dan `await window.seek(seconds)`. Studio harus berjalan untuk cek playback terakhir.

Laporan produksi/sains/QC: `scripts/petir/production-qc.md`. Hasil export dan bukti pemeriksaan: `out/petir/`. Semua scene dan subtitle bisa diedit di source, tanpa mengubah video lain.
