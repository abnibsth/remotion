# Verve — Product in Motion

## Approved direction

MYKONOS Verve Extrait de Parfum 50 ml, selected Verve variant. User confirmed promotional use of the supplied photographs and logo on 2026-10-19. The live Shopee listing required login; evidence is the user's listing screenshot and two product photographs. Asset hashes and processing notes are in `public/product-commercial/verve/asset-manifest.json`.

**Black & Gold — Quiet Luxury.** Charcoal #100F0D, muted gold #C5A56A, ivory #EFE8D9. These are campaign staging colors sampled/interpreted from the supplied photography, not asserted official brand tokens. Product pixels retain their original colors. Local Inter with Georgia display typography; no fabricated wordmark or redrawn bottle label.

## Five-beat direction

1. 0–3: Actual front photo enlarged to a cap/shoulder macro. Controlled light sweep; slight diagonal framing settles into reveal.
2. 3–7: Continuous pullback on the same bottle pixels. Verified product name, concentration and volume.
3. 7–12: Supplied diagonal photograph tracked across its plane. Captions describe visible black silhouette and gold-colored cap/label only; no ingredient inference from flowers or berries.
4. 12–17: Return to full frontal silhouette, warm studio separation and campaign tagline.
5. 17–20: Stable front-photo packshot, verified product identity, CTA “Temukan di Shopee”.

Campaign copy “Hadir. Tanpa banyak kata.” is original editorial copy, not an official MYKONOS tagline or a performance claim. No price, discount, rating, longevity, material specification, fragrance-note claim or Shopee endorsement is included.

## Technical approach

Remotion Studio and standalone Playwright capture surface share `VerveFilm`. Camera and opacity derive only from absolute seconds. `window.seek(t)` aliases the async frame setter; wait for the promise to resolve to ensure fonts and image decoding are ready. Photo planes are translated/rotated in 2D only; no false 360-degree orbit, fake geometry or generative reconstruction. The photographic cutout uses a traced alpha matte around actual pixels.

Source resolution is limited: hero 459×463, detail 449×448; clean front cutout 132×239, alternate styled front 172×317. Enlarged macro frames are intentionally soft; these assets cannot supply genuine high-resolution product detail. No synthetic upscaling/detail is claimed. Brand identity appears authentically on the supplied bottle; additional MYKONOS typography is plain product identification, not a recreated official logo.

Original 96 BPM synthesized soundtrack uses restrained harmonic bass, soft electronic notes, short movement swells and tactile ticks. Foley is abstract sound design, not a claim of an actual perfume sprayer recording. No narration is included unless separately supplied/approved.

## Reproduction

- `npm run verve:test` — deterministic camera, product-fact and photographic asset-hash guards.
- Asset preparation additionally requires Pillow: `python -m pip install Pillow`; then `python -I scripts/verve/prepare-assets.py <reference-directory>` with the supplied files named 3.png, 4.png, 5.png.
- `npm run verve:audio` — original 48 kHz score, Python + NumPy + FFmpeg.
- `npm run verve:style` — representative poses and visual QC.
- `npm run verve:prototype` — 420-frame, seven-second reveal.
- `npm run verve:render` — full 1200-frame final + lighter preview; prototype gate required.
- `npm run verve:verify` — metadata, full decode, audio and blank-frame QC.
- `npm run verve:seek` — local visual-only frame surface at http://127.0.0.1:3097.
- `npm run dev` — select VerveCommercial in Studio for audio playback.

Assets in `public/product-commercial/verve/`, sources in `src/Verve/`, tooling in `scripts/verve/`, outputs in `out/verve-commercial/`. Existing films are not overwritten.

## Validation boundaries

Contact sheets and full-resolution key frames are visually reviewed, with deterministic out-of-order pixel checks, font/image loading checks and text safe-area tests. Full video decoding and frame counts validate the exports. Metered original audio does not substitute for human listening approval. Color is sRGB-authored/captured, with sRGB transfer and BT.709 primaries/matrix in limited-range H.264 YUV delivery, not an RGB archival file.
