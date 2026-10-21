import { chromium } from "playwright-core";
import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../../", import.meta.url));
const out = path.join(root, "out/abni-portfolio");
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const summary = {};
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 360 },
  });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  for (const [file, type] of [
    ["abni-github-banner.gif", "image/gif"],
    ["abni-github-banner.webp", "image/webp"],
  ]) {
    const encoded = (await readFile(path.join(out, file))).toString("base64");
    const result = await page.evaluate(
      async ({ encoded, type }) => {
        const decoder = new ImageDecoder({
          data: Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)),
          type,
        });
        await decoder.tracks.ready;
        const count = decoder.tracks.selectedTrack.frameCount;
        const canvas = document.createElement("canvas");
        canvas.width = 1280;
        canvas.height = 360;
        const context = canvas.getContext("2d");
        let first;
        let last;
        let still;
        let end = 0;
        for (let i = 0; i < count; i++) {
          const { image } = await decoder.decode({ frameIndex: i });
          context.clearRect(0, 0, 1280, 360);
          context.drawImage(image, 0, 0);
          if (i === 0) first = context.getImageData(0, 0, 1280, 360).data;
          if (
            image.timestamp <= 6650000 &&
            image.timestamp + image.duration >= 6650000
          )
            still = canvas.toDataURL();
          if (i === count - 1)
            last = context.getImageData(0, 0, 1280, 360).data;
          end = image.timestamp + image.duration;
          image.close();
        }
        let difference = 0;
        for (let i = 0; i < first.length; i++)
          difference += Math.abs(first[i] - last[i]);
        const result = {
          frames: count,
          seconds: end / 1000000,
          seamMeanError: difference / first.length,
          still,
        };
        decoder.close();
        return result;
      },
      { encoded, type },
    );
    assert.ok(Math.abs(result.seconds - 8) < 0.02);
    assert.ok(result.seamMeanError < 1, `${file}: compressed seam is visible`);
    assert.ok(result.still, "Reveal frame must be decodable");
    await page.setContent(
      `<html><style>html,body{margin:0;background:#101215}img{display:block;width:1280px;height:360px}</style><img src="${result.still}"></html>`,
    );
    await page.screenshot({
      path: path.join(
        out,
        file.endsWith(".gif")
          ? "gif-reveal-proof.png"
          : "webp-reveal-proof.png",
      ),
    });
    delete result.still;
    summary[file] = result;
  }
  for (const frame of [0, 239]) {
    const result = spawnSync(
      "ffmpeg",
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        path.join(out, "abni-github-motion.mp4"),
        "-vf",
        `select=eq(n\\,${frame}),scale=1280:360`,
        "-frames:v",
        "1",
        "-update",
        "1",
        path.join(out, `master-${frame}.png`),
      ],
      { encoding: "utf8" },
    );
    if (result.status !== 0) throw new Error(result.stderr);
  }
  await writeFile(
    path.join(out, "export-verification.json"),
    JSON.stringify(summary, null, 2),
  );
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
