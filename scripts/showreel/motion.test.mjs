import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { transformSync } from "esbuild";

const source = readFileSync(
  new URL("../../src/Showreel/motion.ts", import.meta.url),
  "utf8",
);
const { code } = transformSync(source, { loader: "ts", format: "esm" });
const { clamp, progress, noise, torusMesh } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);

test("progress clamps before and after a move and is continuous inside it", () => {
  assert.equal(progress(-1, 0, 1), 0);
  assert.equal(progress(2, 0, 1), 1);
  assert.equal(progress(0.5, 0, 1), 0.5);
  assert.ok(
    Math.abs(progress(0.50001, 0, 1) - progress(0.49999, 0, 1)) < 0.001,
  );
  assert.equal(clamp(-5), 0);
  assert.equal(clamp(5), 1);
});

test("seeded noise is bounded and independent of seek order", () => {
  const expected = noise(72);
  [5, 100, 1, -50].forEach(noise);
  assert.equal(noise(72), expected);
  for (let i = -100; i < 100; i++) assert.ok(noise(i) >= 0 && noise(i) < 1);
});

test("chrome mesh stays finite, depth sorted and seek safe", () => {
  const expected = torusMesh(2.1);
  [0, 14, 4, 0.2].forEach(torusMesh);
  assert.deepEqual(torusMesh(2.1), expected);
  for (const time of [0, 1, 4, 10, 15]) {
    const mesh = torusMesh(time);
    assert.equal(mesh.length, 768);
    mesh.forEach((patch, i) => {
      assert.ok(Number.isFinite(patch.depth));
      assert.ok(!/NaN|Infinity/.test(patch.d));
      if (i) assert.ok(mesh[i - 1].depth <= patch.depth);
    });
  }
});

test("score is exactly fifteen seconds of stereo PCM with safe headroom and silent tail", () => {
  const wav = readFileSync(new URL("../../public/showreel/score.wav", import.meta.url));
  assert.equal(wav.toString("ascii", 0, 4), "RIFF");
  assert.equal(wav.readUInt16LE(22), 2);
  assert.equal(wav.readUInt32LE(24), 44100);
  assert.equal(wav.readUInt16LE(34), 16);
  assert.equal(wav.readUInt32LE(40), 15 * 44100 * 2 * 2);
  let peak = 0;
  for (let i = 44; i < wav.length; i += 2) peak = Math.max(peak, Math.abs(wav.readInt16LE(i)));
  assert.ok(peak > 1000 && peak < 30000);
  assert.equal(wav.readInt16LE(wav.length - 2), 0);
  assert.equal(wav.readInt16LE(wav.length - 4), 0);
});

test("authored scene nodes fill exactly fifteen seconds with no overlaps", () => {
  const timeline = readFileSync(
    new URL("../../src/Showreel/index.tsx", import.meta.url),
    "utf8",
  );
  const durations = [
    ...timeline.matchAll(/durationInFrames=\{([\d.]+) \* fps\}/g),
  ].map((m) => Number(m[1]));
  assert.deepEqual(durations, [2, 2.5, 2.5, 3, 2.5, 2.5]);
  assert.equal(durations.reduce((a, b) => a + b, 0) * 60, 900);
});
