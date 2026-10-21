# Chaos to Order — Production Notes

## Film

20-second vertical procedural editorial experiment, 1080 × 1920, 60 fps / 1200 frames. Main Remotion composition `ChaosToOrder`; prototype `ChaosToOrderPrototype` (8 s / 480 frames).

## Design-first choreography

ORDER is sampled from actual Space Grotesk Bold glyph silhouettes using fontTools/Pillow. The final design contains 245 purpose-assigned fragments (all silhouette samples at 16-pixel sampling). Each fragment has a stable identity, initial 3D position, organized grid position, depth-compensated reveal position, rotation, scale, color, delay, duration, phase, bend and motion-profile metadata.

The organized layout is a 16-column modular grid with fixed 45/46-unit spacing. Seeded starting positions are derived only after designing the final silhouettes. The objects remain letters, bars, circles, squares or cross markers throughout—no unrelated ORDER overlay replaces them.

## Perspective construction

The SVG engine explicitly rotates world-space XYZ coordinates by camera yaw/pitch, applies focal-distance perspective division, sorts by depth and draws crisp SVG fragments. Reveal positions at varying depths are precompensated by `(1500-z)/1500`, so their projected centers coincide with letter-silhouette samples at the reveal camera angle. Tests assert each projection. This is a genuine analytic 2.5D perspective composition, not a Three.js mesh/volumetric scene. Fragments face the viewer; they are billboards with depth and parallax rather than fully oriented solids.

From 11–15 s, fragments move from grid into depth-compensated positions while the camera explores a specific off-axis angle and settles at the reveal angle. Thus the reveal combines geometric choreography with perspective alignment, not a camera-only illusion over an otherwise frozen construction. No full-size word overlay is used.

## Timeline

- 0–3: looping seeded chaos drift, brief question.
- 3–6: cobalt organizing scan, small object alignment response and emerging grid, “FIND THE PATTERN.”
- 6–11: individual staggered quintic path choreography into precise grid.
- 11–15: orbital 2.5D depth separation, spatial letter alignment.
- 15–18: ORDER silhouette readable hold; “ORDER WAS ALWAYS THERE.”
- 18–20: continuous return to original periodic chaos phase/camera.

No repeated header/footer graphics, unnecessary captions, particles without assignment or external brands. Original palette follows supplied ivory/ink/cobalt/vermilion/lime. Main explanatory text remains inside phone-safe margins.

## Loop

The time evaluator wraps modulo20. Initial drift uses a 20-second sinusoidal period. Return envelopes use quintic smoothstep with zero first and second derivative at endpoints. Object position, rotation, scale and camera agree at t0/t20, while finite-difference velocity tests verify both sides of the boundary. The final exported frame is1199/60 rather than a duplicate t20 frame, preserving natural progression into frame0.

Audio uses original seeded synthesis and first/last100ms digital silence. This avoids clicks at the seam but is a short near-silent breath, not continuously sustained musical ambience. WAV and AAC loop checks are recorded in the audio report.

## Commands

```sh
npm run chaos:design
npm run chaos:test
npm run chaos:audio
npm run chaos:style
npm run chaos:prototype
npm run chaos:render
npm run chaos:verify
npm run chaos:seek
```

Seek preview: http://127.0.0.1:3103 with `await window.seek(seconds)`. Shared pure `svgAt(time)` powers both preview and Remotion.

Editable code: `src/ChaosToOrder/`; assets/choreography generator, renderer, tests, audio generator and verifier: `scripts/chaos-to-order/`; original mix: `public/chaos-to-order/audio/mix.wav`; outputs/reports: `out/chaos-to-order/`.

## Quality boundaries

The fragmented word is intended to be recognized as a bold letter silhouette rather than solid typeset text. Small individual fragments are texture, not individually readable captions. Rendered-frame visual inspection complements coordinate math. The film uses prescribed analytic paths, not a physical particle collision solver. Grid alignment uses quintic ease rather than simulated spring overshoot, prioritizing stable controlled arrival. The included spring helper/motion-profile metadata are available for future variants but do not imply every object currently has a different physics law. Original music is generated, no VO or external samples.

Colors are sRGB-authored; H.264/yuv420p is conventional video encoding, not RGB archival media. Output AAC is trimmed from source WAV to avoid padding extending container duration. No human listening sign-off is claimed.
