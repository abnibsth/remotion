import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

// Compile TypeScript in memory so the tests work on Node versions without TS stripping.
const compiled = await build({
  entryPoints: [
    fileURLToPath(new URL("../../src/Sejuk/motion.ts", import.meta.url)),
  ],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
  logLevel: "silent",
});
const { spring, hash, sceneAt, visualTime, DURATION } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`
);

test("spring is deterministic, starts at rest, and converges", () => {
  for (const damping of [11, 2 * Math.sqrt(170), 27, 50]) {
    assert.equal(spring(-1, 170, damping), 0);
    assert.equal(spring(0, 170, damping), 0);
    assert.ok(Math.abs(spring(12, 170, damping) - 1) < 1e-6);
    for (const time of [0.01, 0.1, 0.4, 1, 2]) {
      const expected = spring(time, 170, damping);
      for (const seek of [28, 0, 17.5, 0.333]) spring(seek, 170, damping);
      assert.equal(spring(time, 170, damping), expected);
      assert.ok(Number.isFinite(expected));
    }
  }
});

test("critically damped spring increases monotonically without overshoot", () => {
  let previous = 0;
  for (let frame = 0; frame <= 600; frame++) {
    const value = spring(frame / 120, 170, 2 * Math.sqrt(170));
    assert.ok(value >= previous - 1e-12, `decreased at ${frame}`);
    assert.ok(value >= 0 && value <= 1 + 1e-12);
    previous = value;
  }
});

test("hash is deterministic and stays in the unit interval", () => {
  for (let n = -100; n <= 100; n++) {
    const expected = hash(n);
    hash(n + 719);
    assert.equal(hash(n), expected);
    assert.ok(expected >= 0 && expected < 1);
  }
});

test("29 seconds are covered by the declared scene vocabulary", () => {
  assert.equal(DURATION, 29);
  const names = new Set([
    "hook",
    "wait",
    "price",
    "ghost",
    "calm",
    "reveal",
    "ui",
    "gag",
    "end",
  ]);
  const observed = new Set();
  for (let frame = 0; frame < 870; frame++) {
    const name = sceneAt(frame / 30);
    assert.ok(names.has(name), `unknown scene ${name}`);
    observed.add(name);
  }
  assert.deepEqual(observed, names);
  assert.equal(sceneAt(0), "hook");
  assert.equal(sceneAt(28.8), "end");
});

test("poster intervals hold subframes while other intervals stay smooth", () => {
  for (const start of [0, 1, 8, 14, 23.5, 24, 25, 26]) {
    assert.equal(visualTime(start + 0.001), visualTime(start + 0.002));
  }
  for (const time of [15, 15.5, 17.5, 20, 23.49, 26.5, 27, 28.8]) {
    assert.equal(visualTime(time), time);
    assert.equal(visualTime(time + 0.001), time + 0.001);
  }
  for (const time of [0.333, 15.5, 17.5, 24.4, 25.5, 28.8]) {
    const expected = visualTime(time);
    visualTime(28.9);
    visualTime(0);
    assert.equal(visualTime(time), expected);
  }
});
