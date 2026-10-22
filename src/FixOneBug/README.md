# Fix One Bug. Create Ten More.

Editable procedural 2.5D motion film. Composition `FixOneBug` is 1080×1920, 60fps, 1200 frames. `FixOneBugPrototype` covers 600 frames.

## Picture system

- `motion.mjs`: seeded object manifest, pixel-letter footprints, closed-form spring, camera and roof projection. Every error object has ID, initial position, spawn time, target position, scale, rotation, velocity profile, city position and reveal position.
- `Editor.ts`: original editable vector editor UI. Fictional JS context changes `calculateTotal(items)` to `calculateTotal(items ?? [])`; no claim that this fixes a real diagnosed bug.
- `City.ts`: ten error cards fracture outward, then procedural UI prisms rise at the final glyph footprints. The camera banks from an oblique city view to directly overhead. The roof polygons remain the same objects; no punchline text layer or text mask replaces them.
- `film.ts`: continuous absolute-time orchestration, editorial copy, terminal and marker reset.
- `design.ts`: palette, fonts and UI-card styling.

## Run

```sh
npx remotion studio
node --test scripts/fix-one-bug/motion.test.mjs
python -I scripts/fix-one-bug/audio.py
node scripts/fix-one-bug/render.mjs
node scripts/fix-one-bug/render.mjs --prototype
node scripts/fix-one-bug/playback.mjs --prototype
node scripts/fix-one-bug/render.mjs --full
node scripts/fix-one-bug/playback.mjs
node scripts/fix-one-bug/verify.mjs
```

`node scripts/fix-one-bug/render.mjs --serve` exposes the shared SVG film at localhost port 3105. `window.seek(seconds)` renders a pure absolute-time state. All font files are local Fontsource assets; no network, real-time physics, CSS animation or unseeded random source is used.

## Sound / rights

Original seeded NumPy synthesis, WAV + five time-aligned premaster stems and CC0 notes are in `public/fix-one-bug/audio/`. AAC measurement is saved there. No external samples, stock music or voice. Font licenses remain in the installed Fontsource packages (Archivo Black and IBM Plex Mono, SIL OFL).

## Editorial notes

All error labels are illustrative, not necessarily consequences of the fictional correction. Added copy: `PATCH / 001`, `A SMALL CHANGE.`, `TOTAL MISMATCH`, `LOCAL`, `RESOLVED`, `BUILD / ERROR DISTRICT`, `A PERFECTLY REASONABLE EXPLANATION.`, `SAME CITY. DIFFERENT PERSPECTIVE.`, plus the contextual disclaimers. These are editable in source.

The glyph design is deliberately modular/pixel-like because the letters are built from rooftop cards rather than a font overlay. This is an SVG 2.5D orthographic projection, not a full Three.js scene or rigid-body simulation. The reset ends on a red marker to connect to the beginning; it is not a claim of a pixel-identical seamless loop.
