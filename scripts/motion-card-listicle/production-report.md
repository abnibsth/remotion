# Motion Card Listicle — Production Report

## Delivery

Title: **5 Motion Principles That Change Everything**

- Final: `motion-card-listicle-final.mp4` — 1080 × 1920, 60 fps, 1500 frames, exactly 25.000 s.
- Preview: `motion-card-listicle-preview.mp4` — 540 × 960, 60 fps, 1500 frames, exactly 25.000 s.
- Contact sheet: `motion-card-listicle-contact-sheet.png` — seven representative style frames and five transition samples.
- Thumbnail: `thumbnail.png` — extracted from the encoded final frame.
- Prototype: `motion-card-listicle-prototype.mp4` — opening 390 video frames / 6.5 s; generated before the full film.
- Motion audit: `encoded-motion-audit.png` — 50 samples extracted from the final MP4.
- Editable source: `src/MotionCardListicle/`, `scripts/motion-card-listicle/`, and `public/motion-card-listicle/audio/soundtrack.wav`.

## Direction

Swiss-inspired editorial cards on warm ivory. Oversized Space Grotesk numbers, Inter explanatory copy, IBM Plex Mono technical labels. Palette follows the supplied hex values. Each principle uses one principal accent rather than all accents together. No branding or creator handle was invented.

| Time | Scene | Demonstration / connective geometry |
|---|---|---|
| 00.00–02.50 | Deck | Black dot, line expansion, staggered physical card stack, headline |
| 02.50–06.50 | Easing | Simultaneous equal-distance linear and cubic-Bezier eased circles; circular vermilion iris |
| 06.50–10.50 | Anticipation | Arrow pulls left and compresses, releases right, then motivates card displacement |
| 10.50–14.50 | Squash & Stretch | Quadratic gravity-like descent, reciprocal X/Y deformation, decreasing bounce arcs, line morph |
| 14.50–18.50 | Follow-Through | Parent block stops; delayed deforming ribbon overshoots and settles; ribbon-shaped wipe |
| 18.50–22.50 | Timing | Same easing/distance over 27, 66, and 120 frames; circles converge |
| 22.50–25.00 | Final composition | Central dot/card reconstruction, staggered five-card stack, supplied takeaway |

## Implementation

Main composition: `MotionCardListicle`, registered in `src/Root.tsx`. Prototype composition: `MotionCardListiclePrototype`.

The master is rendered by **Remotion 4.0.534**, not by an unrelated video engine. React wraps shared SVG geometry, loaded local fonts, and the original WAV soundtrack. The same pure `svgAt(time)` function powers a Playwright seek preview and contact-sheet checks. `window.seek(seconds)` is exposed in the separate seek preview. No accumulated simulation, unseeded visual randomness, CSS animation, or previous-frame dependency is used.

Utilities include linear interpolation, cubic Bezier evaluation, closed-form damped springs, damped oscillation, stagger, analytic-time anticipation, reciprocal squash/stretch, delayed secondary motion, and bounded velocity-driven directional ghosting on the arrow. Camera position and zoom are restrained and time-derived.

## Sound

Original seeded oscillator/noise synthesis, no external samples and no voiceover. Sparse 120 BPM percussion, rounded plucks, warm bass/harmony, card clicks, elastic ball accents, and a short ribbon brush. Normalized with two-pass FFmpeg loudnorm. Final AAC independently measures **−14.00 LUFS integrated**, **−1.95 dBTP**, below the required −1 dBTP ceiling. WAV is 48 kHz stereo PCM24; video delivery uses AAC stereo 48 kHz.

## Reproduce

```sh
npm run dev
npm run cards:test
npm run cards:audio
npm run cards:style
npm run cards:prototype
npm run cards:render
npm run cards:verify
npm run cards:playback
npm run cards:seek
```

Studio: http://localhost:3000/MotionCardListicle

Seek preview: http://127.0.0.1:3098 after `npm run cards:seek`; call `window.seek(12.5)` in its console. It is a deterministic inspection page, not a transport/player UI.

## Additional authored copy

Supporting labels added beyond the requested main copy: “FIVE NOTES ON BETTER MOVEMENT”, “01 — 05 / AN ANIMATED FIELD GUIDE”, “A STUDY IN INTENTION”, “PRINCIPLE”, “DESIGN / IN MOTION”, “THE CARDS TEACH THROUGH MOVEMENT”, “CONSTANT SPEED”, “SLOW → FAST → SLOW”, “SAME DISTANCE. DIFFERENT FEEL.”, “LOAD”, “RELEASE”, “A LITTLE BACK. A LOT FORWARD.”, “VOLUME ≈ CONSTANT”, “WEIGHT IN THE FALL. LIFE IN THE BOUNCE.”, “PARENT / MOVING”, “PARENT / STOPPED”, “RIBBON / FOLLOWING”, “RIBBON / STILL SETTLING”, “THE OBJECT STOPS. THE MOTION DOESN’T.”, “SAME ACTION. THREE EMOTIONS.”, and “THE TAKEAWAY”. These are editable in the scoped source files.

## Limitations / adaptations

- Depth is editorial 2.5D: SVG layering, rotation, scale, a narrow fold/unfold, shadows and virtual camera transforms. There is no true 3D mesh folding, physical depth buffer, or perspective-correct lighting.
- The camera remains mostly restrained to keep text readable. The arrow has subtle velocity-dependent ghosting rather than full shutter-sampled blur on every layer.
- “Pop Cinematic Motion” was read from the root `SKILL.md`; separate `spring-motion` and `motion-studio` skills were not installed in the inspected skill directories. The supplied editorial brief overrides that skill’s comic textures, posterized timing and neon/impact effects.
- Design hex colors are authored as sRGB in the browser. Final H.264 is standard limited-range BT.709/yuv420p, the conventional interoperable video encoding rather than an RGB video stream.
- Safe-margin checks concern readable hold frames; geometry and text can intentionally leave the canvas during transitions. Tiny technical marginalia is secondary; names and explanations use larger sizes.
- Automated playback and audio decoding were verified, but no claim is made of a human listening session or subjective approval from the user.
- Source rendering uses shared SVG strings in React (consistent with an existing project pattern). Text/geometry are editable in source, not separate Studio text tracks.
