# What If Fonts Had Feelings?

20-second / 1200-frame / 60fps / 1080×1920 typographic character film. All picture is editable SVG text and geometry, generated deterministically from absolute time. No screenshots, rasterized typography, real-time physics or CSS animation.

## Edit / preview

- Composition `FontsHaveFeelings`; nine-second `FontsHaveFeelingsPrototype`.
- Six standalone views in Studio's `Font-Personalities` folder.
- `motion.mjs`: reusable character profiles, anticipation/drop/arc/step motion, opening positions, per-letter reassembly.
- `design.ts`: palette, actual font faces, layout helpers.
- `Opening.ts`: editorial question and four type specimens.
- `Performances.ts`: heavy impact, fast directional smear, graceful serif arcs, precise glyph-grid steps.
- `Assembly.ts`: eleven traveling glyphs; four source specimens reassemble into PERSONALITY using opposing local clip masks. No hard-cut word replacement. Reverse reassembly returns toward the opening.
- `film.ts`: shared absolute-time picture orchestration.

```sh
npx remotion studio
node --test scripts/fonts-have-feelings/motion.test.mjs
python -I scripts/fonts-have-feelings/audio.py
node scripts/fonts-have-feelings/render.mjs
node scripts/fonts-have-feelings/render.mjs --prototype
node scripts/fonts-have-feelings/playback.mjs --prototype
node scripts/fonts-have-feelings/render.mjs --full
node scripts/fonts-have-feelings/playback.mjs
node scripts/fonts-have-feelings/verify.mjs
```

`node scripts/fonts-have-feelings/render.mjs --serve` exposes the same picture at port 3106. `window.seek(seconds)` accepts absolute times 0–20. Fonts are loaded before capture. Opening and closing SVG picture pixels are compared, and random-seek pixels are checked for identity.

## Typefaces

Actual local font files, not faux italic or browser substitutes:
- Archivo Black regular — heavy character.
- Inter Tight 800 Italic — fast character.
- Cormorant Garamond 500 — elegant character.
- IBM Plex Mono 500 — precise character.

All are SIL Open Font License 1.1. Licenses are retained in their Fontsource packages and copied into `out/fonts-have-feelings/licenses/`. The two new Fontsource packages are pinned to 5.3.0.

## Sound

Original fixed-seed NumPy score and sound motifs. No VO, downloaded samples or copyrighted music. Mix and five time-aligned premaster stems are in `public/fonts-have-feelings/audio/` with CC0 notes and AAC metrics. Use the final `mix.wav`; summing premaster stems does not exactly reconstruct the mastered mix. The 4.03s BOLD impact, italic sweeps, serif bell tones and 12.15s+ cell clicks are authored explicitly in the synthesis script.

## Editorial choices / scope

The final PERSONALITY is a single readable mixed-type word: PER in bold, SON in italic, ALI in serif and TY in mono. Mixed glyph widths were measured in the browser at final size to avoid artificial equal spacing. The loop uses reverse letter movement plus a short overlapping match back to the original specimen layout, with an identical static endpoint hold; it is not a contour-perfect font-to-font interpolation. Transitions use authored lines/arcs/grid and short overlaps, not a claim of mathematically normalized outline morphs. Directional smear is vector text trails, not shutter-sampled motion blur.

Added supporting labels: `TYPE / IN MOTION`, `FOUR VOICES. NO WORDS SPOKEN.`, `AN EXERCISE IN EXPRESSION.`, `A STUDY IN PERSONALITY`, `09 GLYPHS / 09 CELLS / ZERO GUESSWORK`, `FOUR TEMPERAMENTS. ONE VOICE.`. They are editable in the scene sources. Primary words and captions follow the supplied brief.
