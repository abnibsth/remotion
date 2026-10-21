# LUMORA — Cinematic Product Showcase

Editable 30-second, 1920×1080, 60 FPS landscape advertisement. All 1,800 frames are rendered from an HTML/CSS/JavaScript composition with deterministic `window.seek(seconds)`.

## Deliverables

- `output/lumora-master.mp4` — H.264 CRF 16, yuv420p, 60 FPS, AAC stereo 48 kHz / 320 kbps, fast-start.
- `output/lumora-social.mp4` — landscape H.264, 4.2 Mbps target / 6.5 Mbps maximum, same AAC audio, fast-start.
- `output/contact-sheet.png` — 16 authored keyframes, chronological row-major order.
- `output/encoded-contact-sheet.png` — frames decoded from the final master.
- `output/verification.json` — metadata, actual decoded frame counts, full decode and encoded-audio measurements.
- `output/visual-check.json` — font/image readiness, browser errors and pixel-identical random-access seek check.
- `audio/soundtrack.wav`, `audio/generate_soundtrack.py`, `audio/audio-report.json` — original synthesized score, editable generator and measured mastering results.

## Preview and reproduction

Run from repository root:

```sh
npm ci --prefix lumora-motion/tooling
node --test lumora-motion/motion.test.mjs
node lumora-motion/render.mjs preview
node lumora-motion/render.mjs keyframes
node lumora-motion/render.mjs render
node lumora-motion/verify.mjs
```

Preview defaults to http://127.0.0.1:3210. Set `PORT` to select another port, such as 3211. The page includes playback with soundtrack and a frame-stepped time scrubber. `?render` hides transport controls.

Requirements: Node 22+, Chrome (default Windows path, override via `CHROME_PATH`), FFmpeg and FFprobe on PATH. Audio regeneration additionally requires Python with NumPy:

```sh
python -I lumora-motion/audio/generate_soundtrack.py
```

## Source structure

- `comp.js`: authored seven-scene timeline and pure-time animation updates.
- `style.css`: brand colors, local Poppins / Geist fonts, scene layouts, browser shells.
- `lib/motion.js`: analytical springs for underdamped, critically damped and overdamped systems; different text/browser/card/camera/small-element presets.
- `lib/camera.js`: perspective, position, scale and rotation helper.
- `browser-check.mjs`: compares decoded RGB pixels for eight scene states after reverse-order seeks, checks headline bounds and confirms every scene switch is fully covered. Run with the preview active on port 3211.

Capture uses software compositing to prevent GPU layer promotion from changing antialiasing after random seeks. Opening display type is rasterized from the loaded official Poppins font at 2× resolution before capture, then animated with deterministic transforms. All other type remains local-font browser text.
- `render.mjs`: local HTTP serving, Playwright capture, parallel frame encoding, audio mux and social encode.
- `capture.mjs`, `capture-details.mjs`: repeatable live-site capture (network required only for re-capture).
- `assets/live-20261016/`: high-resolution screenshots and local brand assets; `inventory.json` records origins and extracted content.
- `references/live-20261016/landing.json`: scraped live content / HTML reference.

No network access is needed for preview or final rendering once assets exist. No external APIs or AI provider are called by the film.

## Timeline

| Seconds | Content |
| --- | --- |
| 0–4 | Official logo; “SETIAP BISNIS / PUNYA CERITA.” |
| 4–8 | Actual landing page and original hero imagery / navigation / CTAs |
| 8–13 | Actual discovery cards; category controls; focal Aksara Lokal example |
| 13–18 | Actual Aksara Lokal profile; journey and Business Model Canvas screenshot layers |
| 18–23 | Actual AI interface screenshot with clearly labeled illustrative conversation and draft |
| 23–27 | Profile and discovery views linked as an illustration of connecting opportunities |
| 27–30 | Official logo, story headline, supporting CTA and website hold |

## Accuracy and limitations

The live desktop landing, discovery and Aksara Lokal profile pages were actually opened and captured on 2026-10-16. Product source was also located at `D:/laragon/www/lumora-next/frontend`. This video does not replace those real screens with an invented dashboard.

- The official white logo and symbol were reused from that local product source; the colored navigation logo was downloaded from the live website. Logo aspect ratios are preserved.
- Live CSS defines forest `#123f32`, deep forest `#0b3027`, lime `#b7df68`, ivory `#f5f2e9`, surface `#fbfaf6`. Product fonts were downloaded from its served Next.js font resources.
- Discovery examples are Aksara Lokal, Arunika Bakery and Kopi Ruang Senja. Persistent labels identify business data as examples / illustrations, not verified customers or real performance claims. Repeated photographs are the actual website's current imagery, not different customer photographs sourced for the film.
- Business timeline, chart and Business Model Canvas originate in real website screenshots. No new financial figures or chart data were invented. Fine UI body text remains an authentic screen texture; key ad headlines and illustrative AI copy are separately typeset for 1080p readability.
- Category chips are reconstructed from the actual homepage category controls using its text, palette, pill shape and active-state styling, with larger advertising-readable type. They are not a claim that the explore page uses the same filter control.
- AI is the captured public landing-page chat interface, not an authenticated dashboard. The typed message, two responses and editable-draft callout are **illustrative motion overlays**, not a live AI session or evidence of an automatically generated profile workflow. The video labels this explicitly. It states that the owner reviews the draft.
- The split-screen connection is a storytelling overlay, not evidence of an agreed partnership, guaranteed funding or investment approval.
- `spring-motion` and `motion-studio` skills were not available. The full root `SKILL.md` / pop-cinematic-motion was read. Local closed-form springs and Playwright/FFmpeg implement its deterministic contract; comic colors and effects were deliberately not used because the brief requires authentic LUMORA branding.
- No voice-over, external music samples, paid stock, login-only UI or fabricated testimonials are used.

Additional editorial copy beyond the supplied storyboard: “Cerita yang tersusun. Potensi yang ditemukan.”, “Jelajahi cerita, perjalanan, dan kebutuhan UMKM.”, “Dari cerita sederhana menjadi draf yang bisa kamu edit.”, “Kenali bisnisnya. Mulai percakapannya.”, plus scene kickers, disclaimers, draft labels and the illustrative AI conversation. All are editable in `comp.js`.

The existing Remotion compositions are left unchanged. This deliverable is a self-contained HTML motion project using the alternate pipeline explicitly permitted in the brief.
