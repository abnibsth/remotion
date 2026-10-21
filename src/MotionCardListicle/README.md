# Motion Card Listicle

25-second vertical editorial film: five motion principles demonstrated by moving cards.

- Studio composition: `MotionCardListicle` (1080 × 1920, 60 fps, 1500 frames).
- Prototype: `MotionCardListiclePrototype` (390 frames).
- `lib/motion.ts`: pure time-based physics and camera helpers.
- `lib/design.ts`: shared editorial card tokens and markup.
- `lib/film.ts`: full film evaluator, `svgAt(seconds)`.
- `scenes/`: independently editable scene evaluators.
- `scripts/motion-card-listicle/`: rendering, seek preview, original audio synthesis, unit tests, delivery verification and browser playback checks.

Run `npm run cards:audio`, `npm run cards:style`, `npm run cards:prototype`, then `npm run cards:render`. Verify with `npm run cards:test`, `npm run cards:verify`, and `npm run cards:playback` (Studio running for the latter).

Outputs and production/QC reports are in `out/motion-card-listicle/`. Original generated audio lives in `public/motion-card-listicle/audio/`.

`npm run cards:seek` exposes http://127.0.0.1:3098 and `window.seek(seconds)`. Both this preview and Remotion use the same deterministic visual evaluator.

The master is Remotion-rendered with local fonts, original synthesized music, and SVG layered-card geometry. Final audio is re-encoded from WAV at exactly 25 seconds to avoid AAC padding changing the container duration. Source colors are sRGB; the H.264 file uses conventional BT.709/yuv420p. No creator credit is assumed.
