# Click a Link — Quality Control

## Production gates

- First ten seconds were rendered as a 600-frame 1920 × 1080 / 60 fps prototype before final rendering. FFprobe reported exact 10.000-second video, audio and container duration.
- Prototype encoded motion sheet inspected: cursor click, line handoff, URL segmentation, hostname tracking, DNS query/directory and returned example address.
- Sixteen style frames cover eight scene holds and eight transitions. Font availability, pixel-identical out-of-order seek and sampled safe margins were checked.
- A complete 1800-state Chromium audit checks SVG path lengths, visible content and hold-frame text margins. The first run found opening camera margin encroachment; camera movement was reduced and header/footer were removed from camera transforms. The corrected audit passes all 1800 states with no invalid paths or hold overflows.

## Source checks

14 tests cover full timeline assignment, easing/spring determinism, path endpoints, request and response directions, lock timing, progressive paint before last image, finite camera properties, all SVG states, out-of-order state equality, DNS semantics, transport labels, resource semantics, simplified scope and lack of fabricated latency values.

TypeScript and scoped ESLint are checked separately. Machine-readable render/delivery evidence lives in `out/click-a-link/`.

## Final measured result — PASS

40 delivery checks passed. Master and preview both have exactly 30.000-second video, audio and container duration, 1800 decoded frames at 60 fps, and uniformly spaced frame timestamps with no duplicates or skips. Master is 1920 × 1080; preview is 960 × 540. Both are H.264/yuv420p with AAC stereo 48 kHz, fully decode without errors, and seek/play in Chromium with advancing time and no media error. Final AAC measures **−14.00 LUFS integrated / −2.40 dBTP**. No unexpected fully black intervals were detected. Studio returns HTTP 200. The 60-sample encoded final motion audit was visually inspected after rendering.

## Final delivery validation

`npm run click:verify` validates both master and preview:

- exact 30.000-second container/video/audio duration;
- 1800 decoded video frames at 60 fps;
- H.264/yuv420p, 1920 × 1080 master and 960 × 540 preview;
- AAC stereo 48 kHz;
- complete FFmpeg audio/video decode with no errors;
- no unexpected fully black intervals at the defined detector threshold;
- integrated audio near −14 LUFS and true peak at/below −1 dBTP;
- loaded Space Grotesk and IBM Plex Mono fonts;
- pixel-identical random-order seek;
- 1800-state browser geometry and hold-margin audit;
- Studio HTTP 200 and composition screenshot;
- actual Chromium video seek/playback, advancing currentTime and no media error.

See `verification.json` for measured results rather than relying on this procedural checklist. `*-ffprobe.json` contains stream metadata; `frame-audit.json` contains complete audit totals. Final encoded motion samples and thumbnail are extracted directly from the deliverable, not only source SVG.

## Review boundaries

No universal protocol ordering, latency, method or status guarantee is asserted. HTTP/2 pseudoheaders are represented with accessible semantic labels rather than packet-accurate frames. Rendering stages are a conceptual sequence and real browsers may revisit/overlap work. Diagram points and messages are not literal hardware, photons or packet dimensions.

The video is designed to work without voiceover; small footer/annotation labels are secondary to main titles. Automated audio measurement/playback does not constitute human subjective listening approval. Transitions intentionally move/fade selected objects; safe-margin checking applies to holds, not geometry intentionally traveling out of frame. See the technical accuracy review for source references and assumptions.
