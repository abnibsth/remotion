import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  selectComposition,
  renderStill,
} from "@remotion/renderer";
import { chromium } from "playwright-core";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../../", import.meta.url));
const out = path.join(root, "out/showreel");
const executable =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
await mkdir(out, { recursive: true });
const errors = [];
const ui = await chromium.launch({
  executablePath: executable,
  headless: true,
});
let renderer;
try {
  const page = await ui.newPage({ viewport: { width: 1600, height: 1000 } });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://localhost:3000/MotionShowreel", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page
    .getByText("MAKE", { exact: true })
    .first()
    .waitFor({ timeout: 60000 });
  await page.keyboard.press("Space");
  await page.waitForTimeout(900);
  await page.keyboard.press("Space");
  await page.screenshot({ path: path.join(out, "studio.png") });
  const audioResponse = await page.request.get(
    "http://localhost:3000/public/showreel/score.wav",
  );
  assert.equal(audioResponse.status(), 200, "Studio must serve the score");
  console.log("Studio composition loaded; audio responds 200.");

  const serveUrl = await bundle({
    entryPoint: path.join(root, "src/index.ts"),
    onProgress: () => {},
  });
  renderer = await openBrowser("chrome", { browserExecutable: executable });
  const composition = await selectComposition({
    serveUrl,
    id: "MotionShowreel",
    browserInstance: renderer,
  });
  assert.equal(composition.durationInFrames, 900);
  assert.equal(composition.fps, 60);
  assert.equal(composition.width, 1920);
  assert.equal(composition.height, 1080);
  const frames = [
    54, 165, 330, 498, 651, 834, 0, 119, 120, 269, 270, 419, 420, 599, 600, 749,
    750, 899,
  ];
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  const render = async (frame, file) => {
    await renderStill({
      serveUrl,
      composition,
      browserInstance: renderer,
      frame,
      output: file,
      scale: 0.5,
      imageFormat: "png",
      onBrowserLog: (log) => {
        if (log.type === "error") errors.push(log.text);
      },
    });
    return readFile(file);
  };
  for (const frame of frames) {
    await render(frame, path.join(out, `frame-${frame}.png`));
    console.log(`Verified frame ${frame}/899`);
  }
  const repeat = await render(498, path.join(out, "seek-repeat.png"));
  assert.equal(
    hash(repeat),
    hash(await readFile(path.join(out, "frame-498.png"))),
    "Out-of-order seeking must preserve pixels",
  );
  const cards = await Promise.all(
    frames.map(
      async (frame) =>
        `<figure><img src="data:image/png;base64,${(await readFile(path.join(out, `frame-${frame}.png`))).toString("base64")}"><figcaption>FRAME ${String(frame).padStart(3, "0")} · ${(frame / 60).toFixed(2)}s</figcaption></figure>`,
    ),
  );
  await page.setViewportSize({ width: 1440, height: 1750 });
  await page.setContent(
    `<html><style>body{margin:0;padding:24px;background:#252727;color:#eee;font:14px Arial}main{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}figure{margin:0}img{width:100%;display:block}figcaption{padding:8px 0;font-size:12px;letter-spacing:2px}</style><h1>MAKE IT MOVE / FRAME REVIEW</h1><main>${cards.join("")}</main></html>`,
  );
  await page.screenshot({
    path: path.join(out, "contact.png"),
    fullPage: true,
  });
  assert.deepEqual(errors, [], "No runtime browser errors");
  await writeFile(
    path.join(out, "verification.json"),
    JSON.stringify(
      {
        composition: {
          id: composition.id,
          width: composition.width,
          height: composition.height,
          fps: composition.fps,
          frames: composition.durationInFrames,
        },
        checkedFrames: frames,
        seekPixelMatch: true,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS: Studio, 18 frames, seek determinism, metadata and browser errors. Contact sheet: ${out}/contact.png`,
  );
} finally {
  if (renderer) await renderer.close({ silent: true });
  await ui.close();
}
