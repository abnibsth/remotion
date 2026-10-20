# Click a Link

An original 30-second, 1920 × 1080, 60 fps educational motion film. Main composition `ClickALink`; prototype `ClickALinkPrototype` (600 frames / 10 seconds).

- `lib/motion.ts`: absolute-time timeline, camera, route and progressive page state.
- `lib/design.ts`: palette, typography, browser, endpoints, request objects and chrome.
- `lib/film.ts`: full deterministic evaluator `svgAt(seconds)`.
- `scenes/`: eight editable scene evaluators.

`npm run click:audio` synthesizes original 48 kHz audio. `click:style` generates representative frames. Render `click:prototype` before `click:render` (prototype gate). `click:verify` checks final metadata, full decoding, black intervals, fonts, margins, pixel determinism, AAC loudness, Studio and actual Chromium video playback. Studio must be running for the final check.

`click:test` runs physics/timeline and educational consistency tests. `click:seek` serves http://127.0.0.1:3099; call `await window.seek(seconds)`.

Final deliverables live in `out/click-a-link/`. Production, technical accuracy and QC reports are retained under `scripts/click-a-link/` and copied to the output directory.

Scenario: fresh illustrative HTTP/2 TCP+TLS navigation with DNS required, HTML response and separate resource requests, progressive rendering. Not a universal mandatory protocol sequence. 203.0.113.10 is an intentionally fictional documentation address. GET /page and 200 OK are simplified semantic labels, not HTTP/2 wire encodings.
