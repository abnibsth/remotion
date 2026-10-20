# What Happens When You Click a Link? — Production

## Concept

**One click. A whole journey.** A browser action becomes a URL, a directory lookup, a secure channel, a moving HTTP request, a returning HTML response, a progressively rendered page, and finally an overview reduced to a headline.

1920 × 1080, 60 fps, 30 seconds / 1800 frames. Main on-screen language English. No narration required. No invented brand or subscribe animation.

## Design system

- Deep Navy #0B1220; Midnight Blue #14243A; Electric Blue #4D8CFF; Signal Cyan #5DE1E6; Warm Amber #FFB45C; Soft White #F3F7FB; Muted Slate #8FA3B8.
- Local Space Grotesk 700 and IBM Plex Mono 500.
- Matte panels, thin directional pathways, generous negative space, high-contrast labels. No particles, binary rain, glitching or indiscriminate glow.
- Blue identifies browser/request; cyan marks network/security/active explanation; amber marks returned address and response processing.

## Timeline and cues

| Time | Scene | Motion and cue |
|---|---|---|
| 0–3 | Click | Cursor approaches, click at .7, ripple, title and link-to-line handoff |
| 3–6 | URL | Segment scheme/hostname/path at 3.35/3.7/4.05; isolate hostname |
| 6–10 | DNS | Hostname arrives at resolver, directory highlights, example IP returns, destination marker |
| 10–14 | Connection | Route traces, symbolic TCP exchange, TLS negotiation, lock at 12.35 |
| 14–18 | Request | GET /page follows protected route and arrives 16.65 |
| 18–22 | Response | Example 200/HTML returns; separate resource requests branch from browser |
| 22–27 | Render | HTML-to-document handoff, parse/style/layout/paint/composite; text paints before image finishes |
| 27–30 | Finale | Browser scales down, connected journey overview compresses into stroke, final headline holds |

## Implementation and reproducibility

The main composition `ClickALink` and 600-frame prototype `ClickALinkPrototype` are registered in `src/Root.tsx`. Visuals are a deterministic SVG evaluator wrapped in a Remotion React component with local fonts and a Remotion audio track. Rendering uses Remotion, while Playwright provides shared seekable style-frame inspection. `window.seek(seconds)` is exposed on the separate preview served at port 3099.

Pure absolute-time functions include cubic ease-in-out, closed-form spring, normalized route interpolation, camera position/zoom, progressive rendering state, request/response positions and timed masks/opacity. No CSS animation, accumulating simulation or unseeded visual randomness.

```sh
npm run dev
npm run click:test
npm run click:audio
npm run click:style
npm run click:prototype
npm run click:render
npm run click:verify
npm run click:seek
```

Studio: http://localhost:3000/ClickALink

## Audio

Original 114 BPM oscillator/noise synthesis, warm centered bass, evolving minor/suspended-to-major harmony, restrained rhythmic pulse and 32 sample-positioned event cues. No external samples or voice. Source WAV: 48 kHz stereo PCM24, exactly 1,440,000 sample frames. Normalized by two-pass loudnorm; final encoded delivery is measured by `click:verify`.

## Files

- `src/ClickALink/`: editable film, motion/design utilities and eight scene evaluators.
- `scripts/click-a-link/`: rendering, seek preview, original audio generator, tests, verification and three production reports.
- `public/click-a-link/audio/soundtrack.wav`: original generated mix.
- `out/click-a-link/`: final MP4, preview MP4, contact sheet, prototype, thumbnail, measurements and QC evidence.

## Adaptations and limitations

Depth is restrained illustrated 2.5D, not a true 3D camera or a simulated network. Endpoints and message objects are educational symbols, not actual packet sizes or hardware internals. Camera primarily uses position/zoom; the project does not claim a genuine volumetric fly-through or mesh perspective. Transitions use object continuity, tracing and designed overlap rather than full glyph-outline morphing.

Some small footer/annotation labels are secondary and intended for full-screen viewing. The key steps have large titles and central message labels. A single frozen frame does not communicate all motion; see the encoded motion audit.

Colors are sRGB-authored in browser graphics; final H.264 is interoperable BT.709/yuv420p rather than RGB archival encoding. Exact duration is enforced by copying rendered video and re-encoding audio from the original WAV to avoid AAC padding changing the container duration.

The root `SKILL.md` contains Pop Cinematic Motion and was read in this conversation. Separate spring-motion/motion-studio skills were unavailable in inspected skill directories; motion and pipeline are implemented using the project's existing deterministic patterns. Comic styling from that general skill is intentionally not applied to this technology-documentary brief.

No user approval of subjective aesthetics or human listening sign-off is implied by automated verification. Detailed educational scope and sources are in `technical-accuracy-review.md`.
