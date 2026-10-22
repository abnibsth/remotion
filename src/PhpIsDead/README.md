# PHP Is Dead (Again)

20-second vertical developer meme. 1080×1920, 60 fps, 1200 frames. All on-screen copy is English. Original SVG lettering and procedural server-rack art; no downloaded PHP logo, screenshots, stock footage, voiceover or third-party audio.

## Edit / preview

- `npm run dev` → composition `PhpIsDead`, with six named scene tracks.
- Each scene also has a standalone composition in `PHP-Scenes`.
- `scenes/*.ts` contain editable SVG text, vector layouts and time choreography.
- `design.ts` contains palette and typography helpers.
- `motion.mjs` contains the shared closed-form spring, seeded hash and cue times.
- `npm run php:seek` → local deterministic preview on port 3104; `await window.seek(12.8)` accepts absolute seconds from 0 through 20. No real-time animation or accumulated transforms.

## Reproduce

```sh
npm run php:test
npm run php:audio
npm run php:style
npm run php:prototype
node scripts/php-is-dead/playback.mjs --prototype
npm run php:render
npm run php:playback
npm run php:verify
```

The full export requires a decoded 480-frame prototype report first. Output: `out/php-is-dead/`. Render uses the installed local Chromium and H.264 encoder, then converts the JPEG-derived full-range picture to limited-range BT.709 YUV420p and muxes exact-duration original WAV to 48kHz AAC. FFprobe checks dimensions, frame rate, codec, duration and frame count, followed by a full decode.

## Sound / licensing

`public/php-is-dead/audio/` contains the original 24-bit/48kHz stereo mix, five time-aligned premaster stems, measurement JSON, timing notes and CC0 license declaration. `scripts/php-is-dead/audio.py` synthesizes everything using NumPy with a fixed seed; no API credentials or downloads are needed. NumPy and FFmpeg must be installed locally.

Fonts come from installed Fontsource packages, with licenses retained there: Archivo Black (SIL OFL 1.1), IBM Plex Mono (SIL OFL 1.1), Space Grotesk (SIL OFL 1.1). No external font requests at render time.

## Editorial interpretation

- Years 2005 / 2010 / 2015 / 2020 / 2026 are stylized meme history, not documented quotations; the scene says so.
- `STILL ALIVE.` is a fictional meme response, not actual `php -v` output; the end card says so.
- Added supporting copy: `A DEVELOPER TRAGEDY`, `THE INTERNET HAS SPOKEN.`, `AN EXTREMELY SERIOUS MOTION PICTURE`, `NO LANGUAGE DIES THIS DRAMATICALLY.`, `THE SAME PREDICTION.`, `ON REPEAT.`, `A VERY UNOFFICIAL TIMELINE`, `MEANWHILE, IN PRODUCTION.`, `NO DRAMA.`, `PHP WOULD LIKE A WORD.`, `BACKEND / STILL ON DUTY`. All are editable in scene modules.
- Backend activity is intentionally abstract and fictional, not a measurement or real product interface.
- Impact blur is a short SVG/CSS blur envelope, not shutter-sampled temporal motion blur. The title/lettering remains vector text throughout authoring; H.264 export is raster video.
