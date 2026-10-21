# Motion Card Listicle — QC Report

## Result: PASS with documented adaptations

### Final media checks

| Check | Final master | Preview |
|---|---|---|
| Duration (container + video + audio) | 25.000 s | 25.000 s |
| Dimensions | 1080 × 1920 | 540 × 960 |
| Video frames | 1500 | 1500 |
| Frame rate | 60/1 | 60/1 |
| Codec / pixel format | H.264 / yuv420p | H.264 / yuv420p |
| Audio | AAC stereo / 48000 Hz | AAC stereo / 48000 Hz |
| Full FFmpeg AV decode | PASS, zero errors | PASS, zero errors |
| Chromium playback | PASS: seek + playback advances, readyState 4, no media error | PASS: seek + playback advances, readyState 4, no media error |

AAC final-master integrated loudness: **−14.00 LUFS**. True peak: **−1.95 dBTP**. 27 delivery checks pass. See `verification.json`, the per-video FFprobe JSON files, and `playback-report.json` for machine-readable evidence.

### Source and determinism checks

- 12 tests pass: duration/frame contract, Bezier endpoints and pacing, spring rest/settling, anticipation reversal, reciprocal deformation and decaying bounce, ordered timing arrivals, ribbon continuation/settling, finite function outputs, all 1500 SVG states, requested explanations, final takeaway/no invented creator, out-of-order SVG identity.
- Playwright out-of-order rendered pixel hash at 16.4 s is identical after seeking to unrelated timestamps.
- Browser page errors: 0.
- Essential/visible text safe-margin overflow on sampled hold frames: 0.
- TypeScript `npx tsc --noEmit`: PASS.
- Scoped ESLint `npx eslint src/MotionCardListicle`: PASS.
- `git diff --check`: PASS (Git prints standard LF-to-CRLF notices for existing edited files).
- Studio composition route responds HTTP 200 and displays the composition and audio track. Screenshot: `studio-check.png`.

### Visual inspection performed

The style contact sheet, full-size squash/stretch and final frames, encoded prototype sheet, first encoded frame, Studio screenshot, and the 50-sample encoded final motion audit were inspected. The opening begins as a black dot, then forms a line and deck. Principle titles remain readable during their holds. Easing trajectories differ, the arrow reverses before launch, ball deformation changes on landing, ribbon oscillation continues after the parent stops, and timing variants arrive separately before convergence. The final takeaway remains on screen as the deck settles.

### Issues found and corrected

1. An off-screen incoming squash card leaked into the anticipation hold. It is now mounted only during its transition.
2. Safe-margin checks initially counted completely transparent opening content. They now account for ancestor opacity.
3. The initial ball coordinate placement crossed the title band. Its final rendered motion is constrained to the demonstration area above the baseline.
4. Anticipation card displacement originally opposed the arrow. Card and arrow now move in the same direction.
5. Remotion’s initial AAC packet padding made the container 25.003 s although the video had exactly 1500 frames. Audio is now re-encoded from the original WAV with an explicit 25-second trim while copying video; final stream and container durations are exactly 25.000 s.
6. Loudness JSON parsing initially included trailing FFmpeg summary text. Parsing now extracts the bounded JSON object; final verification passes.

### Scope notes

No voiceover or creator credit was added. This is a stylized 2.5D editorial film, not a physically simulated 3D card scene. Secondary small labels are intentionally less prominent than the principle title/explanation. Transition samples intentionally include off-screen shapes; the automatic text safe-margin test applies to hold frames. Color is encoded as conventional BT.709 H.264 from sRGB-authored graphics. No subjective human listening approval is claimed.
