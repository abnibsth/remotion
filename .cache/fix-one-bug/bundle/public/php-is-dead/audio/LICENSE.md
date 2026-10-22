# PHP IS DEAD (AGAIN) — original soundtrack license

The WAV mix, synthesized stems, AAC quality-control encode, and accompanying timing/measurement metadata in this directory are original procedural audio created specifically for this project. All sound is generated mathematically by `scripts/php-is-dead/audio.py` using NumPy, a fixed RNG seed, and FFmpeg processing.

No external recordings, copyrighted samples, sample packs, impulse-response recordings, stock music, recognizable quoted melodies, speech, or voiceover are used. The heroic passage is an original synthesized harmonic sequence and rising call, not an adaptation of a film or commercial theme. Keyboard sounds, stamps, low impacts, brass-like voices, and diffusion are entirely synthesized.

## Permission

To the extent copyright or related rights apply to these generated assets, they are dedicated to the public domain under **CC0 1.0 Universal**. You may copy, modify, synchronize, distribute, perform, and use these audio assets commercially or noncommercially without attribution or payment. No warranty is provided.

CC0 legal text: https://creativecommons.org/publicdomain/zero/1.0/legalcode

The generation script is provided under the same CC0 dedication. NumPy and FFmpeg are tools used to generate and encode the assets; their own software licenses remain applicable to their respective software, and no software binaries are included here.

## Deliverables and reproducibility

- `mix.wav`: authoritative, sample-exact, 20-second stereo 48 kHz / 24-bit PCM soundtrack.
- `stem-impacts.wav`, `stem-timeline.wav`, `stem-hero.wav`, `stem-phrases.wav`, `stem-keyboard.wav`: full-length, sample-aligned premaster stems. A common premaster gain preserves relative levels. They are not separately normalized and do not sum exactly to the nonlinear final master.
- `mix-aac-qc.m4a`: actual 320 kb/s AAC quality-control encode of the delivered master, retained for inspection; use the WAV for editing/rendering.
- `metrics.json`: measured final WAV/AAC loudness and true peaks, exact duration and silence checks, hashes, timing manifest, and actual two-pass loudnorm data.
- `timing-notes.txt`: cue sheet and integration notes.

Run from the project root with installed NumPy/FFmpeg/FFprobe:

`python -I scripts/php-is-dead/audio.py`

Verify without resynthesizing the WAV/stems:

`python -I scripts/php-is-dead/audio.py --verify`

Synthesis seed: 20261022. No network access or downloads are required. Repeated generation with the same NumPy/FFmpeg versions produces identical WAV data; codec/tool version changes can change encoded bytes or measurement rounding.
