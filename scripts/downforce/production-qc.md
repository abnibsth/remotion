# The Science of Downforce — Production and QC

## Final measured result — PASS with visual limitations

46 delivery checks passed. Final/preview have exactly 30.000-second video/audio/container duration, 1800 decoded frames at 60 fps; prototype is exactly 10.000 seconds / 600 frames. Master 1080 × 1920, preview 540 × 960, H.264/yuv420p and AAC stereo 48 kHz. All three files fully decode without errors and actually seek/play in Chromium. Final AAC: **−14.01 LUFS / −2.82 dBTP**. Frame timestamps are uniformly spaced. Six source tests, TypeScript and scoped ESLint pass; random-order preview screenshots are pixel-identical and sampled typography safe margins pass. The 60-sample encoded final motion sheet was visually inspected. This verifies technical delivery, not photorealism or CFD accuracy; limitations below remain material.

## Film and deliverables

30-second vertical engineering film, 1080 × 1920, 60 fps / 1800 frames. Composition `ScienceOfDownforce`; 10-second / 600-frame `DownforcePrototype`. Source under `src/Downforce/`, tools under `scripts/downforce/`, generated audio under `public/downforce/audio/`, outputs under `out/downforce/`.

## Original 3D asset

No usable vehicle model or Blender installation was found in inspected asset/install paths. External search did not establish a ready-to-use high-quality GT asset with verified geometry and license. An original Three.js GT-inspired car was therefore authored: custom longitudinal body mesh, extruded curved cabin, airfoil-like rear wing, splitter, floor, diffuser/strakes, wheel arches, tires, brakes, spokes, lights and panel details. No brand logo or manufacturer geometry is copied.

**Quality limitation:** this is a procedural educational GT-inspired model, not a production CAD model or a photorealistic commercial automotive asset. The stylized arch/cabin/detail quality does not imply manufacturer-level accuracy. ThreeCanvas performs actual perspective 3D rendering; floor reflections are material/light highlights, not ray-traced wet-road reflections. The final environment uses moving curbs/barriers to suggest a tracking corner, not a validated vehicle-dynamics simulation.

## Production stages

0–3: graphite car, low-angle tracking, engine rise, hook.
3–7: illustrative upper airflow and net downward arrow.
7–13: rear wing close-up with qualitative pressure-color regions.
13–19: transparent cutaway, road/floor clearance and diffuser paths.
19–25: rear wheel, small contact markers, downward load and lateral arrow.
25–30: overlays retract and road/curb tracking returns, final title.

No persistent decorative top/bottom chrome. All visible typography is English. Upper educational title and lower annotations remain within generous mobile-safe region. Optional narration is not included; English script/SRT are delivered. The film uses original synthesized automotive music/SFX, not recorded engine samples.

## Determinism

Camera transforms, wheel angle, scene states and streamline pulse positions are evaluated from absolute seconds. Continuous camera keyframe route uses closed-form smooth easing. No `useFrame` animation loop or accumulating physics. Preview at http://127.0.0.1:3102 exposes `await window.seek(t)` through a frame-addressed Remotion Player. Render source is shared with ThreeCanvas master, not a separate visual recreation.

## QC performed

- First six style frames inspected. Found and fixed flat tire torus orientation, too-tight vertical framing, overbright cyan lighting and excessive wheel-arch domes.
- 10-second prototype rendered before final. Encoded 20-sample motion sheet inspected for camera continuity, readable hook, wheel orientation, wing flow.
- Six logic tests cover exact frame count, continuous/finite camera route, upper flow envelope, underfloor clearance, deterministic seeking and educational scene assignment.
- TypeScript and scoped ESLint pass after JSX closure/unused binding fixes.
- Playwright seek preview: identical screenshot hash at 9.6 s before/after unrelated seeks, no page errors, no visible text safe-margin violations at six representative timestamps (`preview-qc.json`).
- Frame metadata, AV decode, uniform timestamps, actual Chromium video seek/playback and AAC loudness measured by `downforce:verify`; see `verification.json` for final results.

Airflow geometry tests are coarse envelope guards, not a full surface intersection/CFD solver. Pressure planes are illustrative overlays; camera/model intersections should be judged from contact sheets and encoded motion audit, not inferred physically validated from those tests.

## Commands

```sh
npm run dev
npm run downforce:test
npm run downforce:audio
npm run downforce:style
npm run downforce:prototype
npm run downforce:seek
node scripts/downforce/preview-check.mjs
npm run downforce:render
npm run downforce:verify
```

## Dependencies and existing changes

Three.js, React Three Fiber, Remotion Three integration and types installed. Existing merge markers in Root/package were resolved by retaining both Petir and previous composition/script sets, removing duplicate dependency keys. No Git merge/rebase continuation or commit performed.

See `technical-notes.md` for engineering assumptions and source references. No CFD, quantitative downforce, measured pressure coefficient, tire-load linearity, or universal performance improvement is claimed. This model cannot substantiate a numerical aerodynamic result.
