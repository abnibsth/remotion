import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { transformSync } from "esbuild";

const source = readFileSync(
  new URL("../../src/AbniBanner/motion.ts", import.meta.url),
  "utf8",
);
const { code } = transformSync(source, { loader: "ts", format: "esm" });
const { stateAt, roundedPath, spring, wrapTime } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);

test("portfolio screen blend stays bounded and preserves loop endpoints", async () => {
  const source = readFileSync(
    new URL("../../src/AbniBanner/portfolio.ts", import.meta.url),
    "utf8",
  );
  const { code } = transformSync(source, { loader: "ts", format: "esm" });
  const { portfolioAt, portfolioAssets } = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
  );
  assert.ok(portfolioAssets.desktop.endsWith("/desktop.png"));
  assert.ok(portfolioAssets.mobile.endsWith("/mobile.png"));
  assert.equal(portfolioAt(2.8).mobileBlend, 0);
  assert.equal(portfolioAt(4.9).mobileBlend, 1);
  assert.deepEqual(portfolioAt(0), portfolioAt(8));
  for (let f = 0; f < 240; f++) {
    const state = portfolioAt(f / 30);
    assert.ok(Object.values(state).every(Number.isFinite));
    assert.ok(state.mobileBlend >= 0 && state.mobileBlend <= 1);
  }
});

test("eight-second timeline wraps both forwards and backwards", () => {
  assert.equal(wrapTime(8), 0);
  assert.equal(wrapTime(16.5), 0.5);
  assert.equal(wrapTime(-0.5), 7.5);
  assert.deepEqual(stateAt(0), stateAt(8));
});

test("morph has real browser and phone proportions at storyboard checkpoints", () => {
  const browser = stateAt(2.8);
  const phone = stateAt(4.9);
  assert.ok(browser.width > 400 && browser.width / browser.height > 1.7);
  assert.ok(phone.width < 150 && phone.height / phone.width > 1.8);
  assert.ok(stateAt(6.6).identity > 0.99);
  assert.equal(stateAt(0).identity, 0);
});

test("the final frame is the same loop origin, not a fading reset", () => {
  const start = stateAt(0);
  const end = stateAt(239 / 30);
  for (const key of Object.keys(start))
    assert.ok(Math.abs(start[key] - end[key]) < 1e-8, key);
  assert.equal(start.cursor, 1);
  assert.equal(start.code, 0);
});

test("layout state stays continuous at scene boundaries and finite at every frame", () => {
  for (const cut of [1.5, 3.5, 5.5, 7.2, 7.96]) {
    const a = stateAt(cut - 0.00001);
    const b = stateAt(cut + 0.00001);
    for (const key of Object.keys(a))
      assert.ok(Math.abs(a[key] - b[key]) < 0.1, `${cut}: ${key}`);
  }
  for (let frame = 0; frame < 240; frame++) {
    assert.ok(Object.values(stateAt(frame / 30)).every(Number.isFinite));
  }
});

test("closed-form spring is causal, settles and does not need previous frames", () => {
  assert.equal(spring(-1), 0);
  assert.equal(spring(0), 0);
  assert.ok(Math.abs(spring(2) - 1) < 0.001);
  const a = stateAt(4.3);
  [7.9, 0.2, 6.7].forEach(stateAt);
  assert.deepEqual(stateAt(4.3), a);
});

test("SVG outline keeps the same path topology throughout the morph", () => {
  const commandPattern = roundedPath(0, 0, 5, 5, 1).replace(/[-\d. ,]/g, "");
  for (const t of [0, 1.5, 2, 3.5, 4.5, 6, 7.5]) {
    const s = stateAt(t);
    const d = roundedPath(s.x, s.y, s.width, s.height, s.radius);
    assert.equal(d.replace(/[-\d. ,]/g, ""), commandPattern);
    assert.ok(!/NaN|Infinity/.test(d));
  }
});
