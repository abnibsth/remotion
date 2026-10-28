# Implementation Plan: When UI Escapes the Screen

The supplied brief authorizes the complete staged production and export. Preserve all existing compositions. Build a real Three.js continuous shot, with a shared deterministic timeline and locally installed fonts.

## Architecture decisions
- One shared `createFilm()` Three.js engine used by the Remotion composition and the Playwright `window.seek(t)` capture page.
- UI objects begin as the same textured/colored meshes on the display plane. Thickness, peel deformation, gravity, contact and vortex returns are functions of absolute time.
- Browser content uses UVs on a deformable subdivided mesh; the texture is never swapped for a blank panel.
- Closed-form deterministic ballistic/spring curves replace realtime physics. Original stereo synthesized score and sound effects use the same fixed event times.

## Ordered tasks and acceptance
1. Foundation: test deterministic states, screen mapping, continuity and contacts; open Studio. Verify node tests and browser readiness.
2. First seven seconds: art-direct studio/monitor/UI; extrude folder and land with one bounce. Capture and inspect normal/emerge/impact style frames. Render and decode exactly 420 prototype frames before full production.
3. Remaining motion: browser peel, eleven readable notification cards, controlled stacking/sliding and folder nudge, DELETE suction and restoration. Verify sampled/full-frame finite transforms and random-access pixel identity.
4. Sound: synthesize 48 kHz stems and mix. Verify duration, synchronization event schedule, approximately -14 LUFS integrated and <= -1 dBTP.
5. Quality: inspect seven-beat contact sheet, monitor registration, shadows, UV continuity, collisions, readable safe titles, final calm gag and loop composition. Check source types and browser errors.
6. Delivery: capture exactly 1500 frames, H.264/AAC 1080x1920 60fps 25s; FFprobe, full decode and actual video playback. Deliver source, audio/license notes and an evidence-based QC report.

## Checkpoints
- Tests before timeline implementation.
- Folder visual review and verified seven-second prototype before full export.
- Full contact sheet before master render.
- Exact metadata, decode, deterministic seeking, loudness and playback before claiming completion.

## Constraints
No remote fonts, assets or unseeded randomness. No edits to earlier films. Browser peel is a deterministic flexible-sheet mesh approximation rather than cloth simulation. Contact shadows use real shadow mapping plus analytic soft contact patches. No hard cuts in the continuous camera route.
