# Original sound and font notes

All audio in this directory is original procedural synthesis created by `scripts/fonts-have-feelings/audio.py`, using fixed-seed NumPy noise, generated oscillators and FFmpeg mastering. No downloaded music, sample packs, copyrighted recordings, speech or narration are used. To the extent copyright applies, the generated audio and synthesis script are dedicated under CC0 1.0 Universal, without warranty.

`mix.wav` is the 20-second 48kHz stereo 24-bit edit master. Five `stem-*.wav` files are full-length, time-aligned premaster stems; summing stems does not reconstruct shared loudness mastering exactly. `aac-qc.m4a` is an actual 320kb/s codec check. `metrics.json` records decoded AAC `input_i` / `input_tp` measurements; the `output_*` fields are hypothetical normalizer results, not delivered measurements.

Typography uses licensed local Fontsource packages: Archivo Black, Inter Tight, Cormorant Garamond and IBM Plex Mono. Each is under SIL Open Font License 1.1. Full font licenses remain in the corresponding `node_modules/@fontsource/<family>/LICENSE` and are copied to the production output's `licenses/` folder. No font is synthesized by the renderer: bold is Archivo Black regular, italic is Inter Tight 800 Italic, serif is Cormorant Garamond 500, mono is IBM Plex Mono 500.
