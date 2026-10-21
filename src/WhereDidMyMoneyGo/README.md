# Where Did My Money Go?

Original receipt-led editorial finance film. 1920×1080, 60 fps, 20 seconds / 1200 frames. Existing films are not reused or replaced.

## Edit and preview

```sh
npm run dev
# Select WhereDidMyMoneyGo in Studio
npm run money:seek
# Open http://127.0.0.1:3096 and call await window.seek(11.95)
```

The Studio composition and seekable capture surface both render `MoneyFilm`. All geometry, camera, typography and amounts derive from absolute time; no accumulated animation state, CSS animation or random simulation.

- `index.tsx`: shared SVG stage, single deforming receipt surface, camera and Remotion audio.
- `motion.mjs`: fictional finance data, event times, closed-form spring, camera, normalized perimeter geometry and path morphs.
- `Payday.tsx`: opening and thermal printing.
- `Expenses.tsx`: line-to-card unfolding and proportional salary deductions.
- `Balance.tsx`: remaining balance, numerical descent and comedic pause.
- `Finale.tsx`: folded-paper handoff and final typographic panel.
- `design.tsx`: local fonts, palette and masked reveals.

## Production commands

```sh
npm run money:test
npm run money:audio
npm run money:style
npm run money:prototype
npm run money:render
npm run money:verify
node scripts/money/studio-check.mjs
```

Audio synthesis requires Python with NumPy and FFmpeg on PATH. Rendering uses existing `playwright-core`, esbuild and an installed Chromium; set CHROME_PATH if browser discovery needs an override. No remote assets or fonts are required.

The full renderer requires a previously rendered 300-frame prototype. PNG captures are in `.cache/money/`; deliverables and QC reports are in `out/where-did-my-money-go/`. WAVs and captures are generated/ignored; `audio.py` recreates the soundtrack.

## Narrated edition (2026-10-19)

The user supplied an ElevenLabs MP3 in `public/money/audio/`. The original source is preserved. Phrase timing is in `scripts/money/narration-plan.mjs`; `npm run money:narration` generates aligned narration, a ducked 48 kHz stereo mix, and separate `*-master-vo.mp4`, `*-preview-vo.mp4`, `*-social-vo.mp4` outputs. It requires the original full-length no-VO exports and soundtrack to exist. No external speech service is used during alignment.

Select **WhereDidMyMoneyGoVO** in Studio for the narrated mix. The original composition remains music/SFX only. The capture-only `money:seek` surface is visual and does not play audio.

Opening VO is pitch-preservingly accelerated 1.12× to fit the first five seconds. Other phrases keep original speed and are placed at measured natural pauses: expense names follow their cards, “Tunggu” at 14 seconds, “Tinggal segini” at 14.59 seconds, final line at 16.85 seconds. Original video frames are stream-copied, not recompressed. Music gain is reduced during speech with additional sidechain compression. Final encoded AAC is measured again; see `narration-report.json`.

## Style guide

- Matte warm paper `#F5F1E8`, ink `#191919`, vermilion `#F05A42`, green `#B7DF79`, gray `#A7A49E`.
- Space Grotesk 700 for primary titles; IBM Plex Mono 400/500 for precise transaction copy. Both bundled locally via Fontsource.
- One unbroken receipt perimeter with 192 corresponding sampled points. Flat printed grain, minimal offset shadow, restrained perspective camera; no particles, neon or cartoon protagonist.
- Salary bar is a single linear magnitude encoding anchored at Rp0. Its length and the printed balance use the same finance function. Black outlines and explicit values avoid color-only reading.
- Three rhythmic deductions; tension and descending figures; near-silent negative-space pause; vermilion final panel.

## Ledger

| Transaction | Expense | Settled balance |
|---|---:|---:|
| Salary | — | Rp5.000.000 |
| Rent | Rp1.500.000 | Rp3.500.000 |
| Food | Rp1.200.000 | Rp2.300.000 |
| Installments | Rp1.000.000 | Rp1.300.000 |
| Transport | Rp500.000 | Rp800.000 |
| Other expenses | Rp787.500 | Rp12.500 |

Total expenses Rp4.987.500. Remaining 0.25%. All figures fictional. Intermediate animated amounts are interpolation, not additional transactions.

## Delivery interpretation and limits

- Master, preview and social retain the requested 1920×1080 / 60 fps framing; preview/social differ in bitrate, not crop. No vertical version is implied.
- Graphics are authored/captured in sRGB. H.264 delivery uses yuv420p, BT.709 primaries/matrix with sRGB transfer metadata; it is not an RGB archival codec.
- Receipt folding is an editorial 2D/2.5D correspondence morph with illustrated creases, not a physically simulated 3D paper mesh. Text/shape handoffs use designed overlap rather than individual glyph-outline morphs.
- Camera tracking is a deliberately authored time-based trajectory, not a physics-based target solver.
- Automated geometry/font/safe-area checks and visual contact-sheet review do not constitute exhaustive perceptual evaluation on every display. Sound is synthesized and metered; no human listening sign-off is claimed.

## Additional editorial copy

In addition to the supplied brief: “A study in everyday expenses”, “Financial field notes / 001”, “The best notification of the month”, “For a moment, it’s all yours”, “Keep this receipt”, “Then life takes its cut”, “The everyday expense track”, “Still yours”, “And the little things?”, “The monthly disappearing act”, and “Money doesn’t disappear. It becomes expenses.” All are editable in source.
