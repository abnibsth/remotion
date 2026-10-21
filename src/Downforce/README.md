# The Science of Downforce

Original Three.js GT-inspired educational film in Remotion, 30 seconds / 1800 frames, 1080 × 1920 at 60 fps.

- `Car.tsx`: custom mesh body/cabin/wing and detailed vehicle assemblies.
- `Scene.tsx`: lighting, floor/track, airflow, pressure overlays, vectors and camera application.
- `motion.ts`: deterministic camera route and illustrative flow functions.
- `Overlay.tsx`: English explanatory typography, scope notes and final title.
- `index.tsx`: ThreeCanvas/Remotion compositions and audio.

Studio composition: `ScienceOfDownforce`. Prototype: `DownforcePrototype`.

Use `downforce:style`, `downforce:prototype`, then `downforce:render`. Tests: `downforce:test`. Delivery check: `downforce:verify`. `downforce:seek` starts port3102 and exposes `await window.seek(seconds)`.

Model is original, stylized and procedural; no external model license needed. Not a photoreal manufacturer CAD asset. Airflow and pressure are explicitly illustrative, not validated CFD. Optional English voiceover is not included; script/SRT provided. Original synthesized engine/wind/score source is included.

Reports: `scripts/downforce/technical-notes.md` and `production-qc.md`. Output media, contact sheet, source ZIP and QC JSON: `out/downforce/`.
