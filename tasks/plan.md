# Implementation Plan: Where Did My Money Go?

Build the user's supplied six-beat, 20-second brief as a new Remotion composition, without altering earlier films. The user explicitly authorized the complete staged production and export.

## Architecture
- One continuously deforming receipt surface; React/SVG geometry driven only by frame time.
- Shared pure timeline, finance, camera and correspondence-based morph functions.
- Existing Remotion Studio plus a standalone deterministic `window.seek(seconds)` QA surface using the same component.
- Locally installed Space Grotesk and IBM Plex Mono; original synthesized audio.
- Keep social output 1920×1080/60, as specified; use a smaller bitrate rather than inventing a vertical crop.

## Ordered tasks
1. Inspect skills/tooling; validate finance and easing/morph functions with node tests. Acceptance: exact totals and 1200 finite deterministic frame states.
2. Build salary→receipt→timeline prototype. Acceptance: five designed style poses, readable type, 300-frame prototype rendered and inspected before full-film render.
3. Build expenses→balance→silence→folded final panel. Acceptance: every settled balance exact, all handoffs share geometry, final title has a comfortable hold.
4. Synthesize 48 kHz score/SFX keyed to shared event times. Acceptance: silence window, measured loudness near -14 LUFS and true peak ≤ -1 dBTP.
5. Capture full contact sheet, test seeking out of order, inspect paths/type/fonts/browser errors. Acceptance: no detected invalid paths, missing fonts or overflow at hold poses.
6. Render 1200-frame master, preview and social. Verify ffprobe metadata, full decode, frame count, clipping and nonblank samples; produce short honest production report.

## Checkpoints
- Arithmetic tests before visual implementation.
- Style frames and five-second prototype before full export.
- Contact-sheet inspection and source checks before master.
- Metadata and decode verification after delivery encodes.

## Constraints
- No network font dependence; no nondeterministic physics or CSS animation.
- The silence beat intentionally uses very small balance typography.
- sRGB-authored graphics convert to tagged BT.709 YUV for conventional H.264 delivery; disclose this distinction.
- Automated tests support, not replace, visual inspection; report limitations honestly.
