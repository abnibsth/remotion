# Words Have Weight

20-second / 1200-frame vertical typography physics film, 1080 × 1920 at 60 fps.

Studio: `WordsHaveWeight`. Prototype: `WordsHaveWeightPrototype` (8 seconds).

- `lib/motion.ts`: pure time-derived physics, camera and palette interpolation.
- `lib/outlines.json`: genuine Space Grotesk outlines generated with `scripts/words-have-weight/outline.py`.
- `lib/design.ts`: SVG glyph and typographic helpers.
- `lib/film.ts`: full film evaluator, shared with seek preview.
- `scenes/`: six continuous word/payoff evaluators; hook and HEAVY share one unbroken impact scene.

Use `npm run words:audio`, `words:style`, `words:prototype`, and `words:render`. Tests: `words:test`. Delivery: `words:verify`. Browser geometry audit: start `words:seek`, then `words:audit`. The seek page at port 3100 exposes `await window.seek(seconds)`.

Generated videos, contact sheet and evidence: `out/words-have-weight/`. Production/QC report: `scripts/words-have-weight/production-qc-report.md`.

Fonts are installed locally. Outline regeneration requires Python fontTools and Brotli (present at production time); the already-generated outline JSON is included for editing/rendering without regenerating it. Soundtrack regeneration uses the included original synthesis script and FFmpeg.
