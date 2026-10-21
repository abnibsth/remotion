# Words Have Weight — Production and QC

## Final verified result — PASS

55 delivery checks passed. Final and preview are exactly 20.000 seconds with 1200 decoded frames at 60 fps; prototype is exactly 8.000 seconds / 480 frames. Master: 1080 × 1920. Preview: 540 × 960. H.264/yuv420p, AAC stereo 48 kHz, fast-start MP4. Final encoded audio measures **−14.02 LUFS / −1.75 dBTP**. All three videos fully decode and actually seek/play in Chromium without media errors. Final timestamps are uniformly spaced without duplicates/skips. All 1200 browser states have valid SVG paths and no unintended text overflow. 13 source tests, TypeScript and scoped ESLint pass. The 60-sample encoded final motion audit was visually inspected after rendering.

## Clean-layout revision — 2026-10-21

Removed the persistent top title, VOL. 01, scene-number footer, 60 FPS footer and their separator rules. Central scene content, physical animation, timing and original audio are unchanged. Prototype, final, preview, style frames, contact sheet and thumbnail were rendered again. The clean exports passed all 55 delivery checks, including full decoding and actual Chromium playback. A new regression test asserts absence of the editorial header/footer at every timestamp; 14 source tests pass. A frame extracted from the clean final MP4 was visually checked. A repeat standalone geometry audit was attempted after session restart but its preview server was unavailable; the earlier complete geometry audit remains applicable to unchanged central geometry, while the clean rerender performed new sampled bounds and seek checks.

## Film

**What if words obeyed physics?** A vertical kinetic typography experiment with five distinct physical signatures. 1080 × 1920, 60 fps, exactly 20 seconds / 1200 frames. Remotion compositions: `WordsHaveWeight` and `WordsHaveWeightPrototype` (480 frames / 8 seconds).

## Editorial direction

Warm Ivory #F3EFE7, Ink Black #171717, Electric Cobalt #315BFF, Vermilion Orange #F36A45, Soft Lime #DCEB8B. Space Grotesk 700 for heavy display and final copy; Space Grotesk 300 for LIGHT; IBM Plex Mono 500 for annotations. Core typography stays in generous mobile-safe margins; no critical content in the bottom interface area. FAST intentionally travels out of frame briefly; HEAVY intentionally enters from above.

## Timeline and physical behavior

| Time | Behavior | Visual / sound signature |
|---|---|---|
| 0–2 | Hook | “WHAT IF WORDS…”; HEAVY accelerates under stylized gravity and impacts at .72 s; compressed type, bent floor, shockwave; “…HAD PHYSICS?” |
| 2–5 | HEAVY | Damped word settling, subtle stepped extrusion, contact shadow, responsive geometric neighbors and loaded baseline; floor reverses upward |
| 5–8 | LIGHT | Thin spacious letterforms, gentle independent drifts, buoyant rise, cobalt field; a letter-adjacent line extends into the next speed route |
| 8–11 | FAST | Cubic acceleration, brief offscreen overshoot, camera tracking, italic skew, limited stretch and velocity-driven directional ghosting; long brake into next word |
| 11–14 | SLOW | Restrained quartic deceleration, subtle subpixel orbit, slowly falling cobalt droplet; touch becomes elastic pull handle |
| 14–17 | ELASTIC | Genuine glyph outlines stretch with anchored left edge and secondary letter delays, damped closed-form snap recovery at 15.15 s; collapses to line |
| 17–20 | Payoff | Line expands into stacked “WORDS HAVE WEIGHT.” / “MOTION GIVES THEM MEANING.”; five small accents recall weight, drift, speed, slow drift and spring recovery |

## Real typographic geometry

`outline.py` uses fontTools to read the installed OFL-licensed Space Grotesk 700 WOFF2, preserves real glyph contours and advance metrics, and writes deterministic outlines for HEAVY, FAST, SLOW and ELASTIC. LIGHT remains real live Space Grotesk 300, not a fake thin outline. Extreme motion is applied to genuine SVG paths rather than substituting unrelated letter shapes.

The spring, gravity-inspired fall, inertia/braking, buoyancy and secondary oscillation are pure absolute-time functions. The animation has no accumulated simulation, uncontrolled CSS animation, unseeded visual randomness or dependency on previous frames. `window.seek(seconds)` is exposed in the shared visual inspection preview at http://127.0.0.1:3100 after `npm run words:seek`.

## Original sound

An original sparse score supports differentiated physical cues: deep short HEAVY impact, airy LIGHT shimmer, directional FAST rise, stretched SLOW atmosphere, tension and ELASTIC snap, warm final resolution. No external samples or voiceover. WAV is exactly 20 seconds, 48 kHz stereo PCM24. Generator and independent WAV/AAC loudness measurements are included. Final encoded AAC measurements are recorded in `verification.json`.

## Workflow and evidence

1. Existing Pop Cinematic Motion skill from root `SKILL.md` read in this conversation; editorial brief takes precedence over its comic style. Separate spring-motion and motion-studio skill packages were not available in inspected directories.
2. Generated actual font outlines and wrote failing physics tests before implementation; tests then passed.
3. Rendered six representative full-resolution style frames and the exact requested 15 timestamps: 0, 1, 2, 3.5, 5, 6.5, 8, 9.5, 11, 12.5, 14, 15.5, 17, 18.5, 19.5 seconds. Inspected contact sheet at small vertical viewing size and ELASTIC at full resolution.
4. Rendered and inspected 8-second prototype before final. FFprobe confirms 480 frames, 1080 × 1920, 60 fps, exactly 8.000-second audio/video/container. Encoded prototype motion audit inspected.
5. 13 tests cover physics differences, finite full timeline, real glyph metrics, required copy and arbitrary seek determinism. TypeScript and scoped ESLint checked.
6. Chromium audit visits all 1200 timestamps, checks SVG path lengths and safe text bounds. Initial audit found SLOW near the right margin during transition; starting center shifted left. Corrected audit has zero invalid paths, zero unexpected text overflow, zero missing SVG states and zero browser errors. HEAVY entrance and FAST offscreen motion are explicitly exempted because leaving the frame is intentional.
7. Pixel-hash comparison after out-of-order seeks confirms identical rendered frames. Bold/light/mono fonts checked as loaded.
8. Final verifier checks exact metadata, all frame timestamps, complete decode, browser seek/playback, Studio availability and final AAC loudness. See machine-readable results for final measured status.

## Commands

```sh
npm run dev
python -I scripts/words-have-weight/outline.py
npm run words:test
npm run words:audio
npm run words:style
npm run words:prototype
npm run words:seek
npm run words:audit
npm run words:render
npm run words:verify
```

Outputs: `out/words-have-weight/`. Editable visuals: `src/WordsHaveWeight/`. Audio: `public/words-have-weight/audio/soundtrack.wav`. Tooling: `scripts/words-have-weight/`. No existing video was overwritten.

## Adaptations and limitations

The film is a stylized typography physics experiment, not a calibrated real-world material simulator. Floor distortion, extrusion and camera are illustrated 2D/2.5D. Directional blur uses bounded velocity-driven trail copies, not shutter-sampled optical blur. ELASTIC applies related per-glyph affine deformations to real outlines; it is not a connected soft-body mesh across every counter and stroke. Transitions use connected objects, masks/scale and overlap rather than impossible topology-changing glyph morph claims. No seamless-loop claim is made; the final readable hold is deliberate.

Colors are authored as sRGB graphics; H.264 delivery uses conventional BT.709/yuv420p. Audio is remuxed from the source WAV with explicit duration, avoiding AAC padding extending the container. Metered audio and automated playback do not constitute subjective human listening approval. Small technical annotations are secondary; five main words and final statement are the mobile-readable focus.

Additional authored supporting copy: “MASS CHANGES EVERYTHING.”, “GRAVITY. IMPACT. INERTIA.”, “ALMOST NOTHING TO HOLD.”, “BUOYANCY / NO HURRY”, “BLINK. YOU MISSED IT.”, “ACCELERATE → OVERSHOOT → BRAKE”, “TAKE YOUR TIME.”, “LESS SPEED. MORE PRESENCE.”, “TENSION NEEDS A RELEASE.”, “PULL. SNAP. RECOVER.”, and “FIVE WORDS. FIVE PHYSICAL IDENTITIES.” No creator credit or branding was invented.
