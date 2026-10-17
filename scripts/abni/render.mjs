import { build } from "esbuild";
import { chromium } from "playwright-core";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../../", import.meta.url));
const out = path.join(root, "out/abni-portfolio");
const buildDir = path.join(out, ".preview");
const full = process.argv.includes("--full");
const browserPath =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
await mkdir(buildDir, { recursive: true });
await mkdir(path.join(out, "contact-frames"), { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: [path.join(root, "scripts/abni/preview.tsx")],
  bundle: true,
  outdir: buildDir,
  loader: { ".woff2": "file", ".woff": "file" },
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
});
const html =
  '<!doctype html><html><head><meta charset="utf-8"><title>Abni — from code to creation</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{width:100%;height:100%;margin:0;overflow:hidden;background:#101215}svg{display:block}</style></head><body><div id="root"></div><script src="/preview.js"></script></body></html>';
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".png": "image/png",
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html" }).end(html);
      return;
    }
    const base =
      url.pathname.startsWith("/abni-portfolio/") ||
      url.pathname.startsWith("/public/")
        ? path.join(root, "public")
        : buildDir;
    const assetPath = decodeURIComponent(url.pathname).replace(
      /^\/public\//,
      "/",
    );
    const file = path.resolve(base, "." + assetPath);
    if (!file.startsWith(base + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    res
      .writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      })
      .end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
const report = {
  width: 1280,
  height: 360,
  masterWidth: 2560,
  masterHeight: 720,
  fps: 30,
  seconds: 8,
  errors: [],
  loopExact: false,
  seekSafe: false,
  files: {},
};
const run = (bin, args) => {
  const result = spawnSync(bin, args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${bin} failed: ${result.stderr}`);
  return result.stdout;
};
const ffmpeg = (args) =>
  run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args]);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
let browser;
try {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  browser = await chromium.launch({
    executablePath: browserPath,
    headless: true,
    args: ["--font-render-hinting=none", "--force-color-profile=srgb"],
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 360 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => report.errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") report.errors.push(msg.text());
  });
  page.on("requestfailed", (req) =>
    report.errors.push(req.url() + ": " + req.failure()?.errorText),
  );
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => window.ready);
  const capture = async (time, file) => {
    await page.evaluate((t) => window.seek(t), time);
    return page.screenshot({
      path: file,
      animations: "disabled",
      caret: "hide",
    });
  };
  const times = [
    0,
    0.5,
    1.2,
    1.7,
    2.5,
    3.5,
    4,
    4.8,
    5.5,
    6,
    6.7,
    7.2,
    7.4,
    7.7,
    7.9,
    239 / 30,
  ];
  const hashes = new Map();
  for (let i = times.length - 1; i >= 0; i--)
    hashes.set(
      times[i],
      digest(
        await capture(
          times[i],
          path.join(out, `contact-frames/${String(i).padStart(2, "0")}.png`),
        ),
      ),
    );
  report.loopExact = hashes.get(0) === hashes.get(239 / 30);
  assert.ok(
    report.loopExact,
    "First and last rendered frames must be pixel-identical",
  );
  await capture(0.2);
  await capture(7.8);
  report.seekSafe = hashes.get(4.8) === digest(await capture(4.8));
  assert.ok(report.seekSafe, "Seek must not accumulate state");
  await capture(6.65, path.join(out, "abni-github-banner.png"));
  ffmpeg([
    "-framerate",
    "1",
    "-i",
    path.join(out, "contact-frames/%02d.png"),
    "-vf",
    "scale=640:180:flags=lanczos,tile=2x8:padding=12:margin=12:color=0x20242a",
    "-frames:v",
    "1",
    "-update",
    "1",
    path.join(out, "contact-sheet.png"),
  ]);
  // Actual README-sized presentation against both GitHub page themes.
  const still = (
    await readFile(path.join(out, "abni-github-banner.png"))
  ).toString("base64");
  const proof = await browser.newPage({
    viewport: { width: 1100, height: 820 },
  });
  await proof.setContent(
    `<html><style>body{margin:0;background:#777;font:14px Arial}.theme{padding:30px 60px}.light{background:#fff;color:#1f2328}.dark{background:#0d1117;color:#e6edf3}.readme{max-width:920px;margin:auto}img{width:100%;display:block}h2{font-size:16px;font-weight:500}</style><section class="theme light"><div class="readme"><h2>GitHub README · light · 920px</h2><img src="data:image/png;base64,${still}"></div></section><section class="theme dark"><div class="readme"><h2>GitHub README · dark · 920px</h2><img src="data:image/png;base64,${still}"></div></section></html>`,
  );
  await proof.screenshot({
    path: path.join(out, "readme-theme-proof.png"),
    fullPage: true,
  });
  await proof.close();
  console.log(
    "CONTACT READY: loop pixel-match, seek-safe, local fonts loaded, theme proof generated.",
  );
  if (full) {
    await mkdir(path.join(out, "frames"), { recursive: true });
    await page.setViewportSize({ width: 2560, height: 720 });
    for (let f = 0; f < 240; f++) {
      await capture(
        f / 30,
        path.join(out, `frames/${String(f).padStart(4, "0")}.png`),
      );
      if ((f + 1) % 30 === 0) console.log(`CAPTURE ${f + 1}/240`);
    }
    const master = path.join(out, "abni-github-motion.mp4");
    ffmpeg([
      "-framerate",
      "30",
      "-i",
      path.join(out, "frames/%04d.png"),
      "-an",
      "-c:v",
      "libx264",
      "-crf",
      "16",
      "-preset",
      "slow",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-frames:v",
      "240",
      master,
    ]);
    const gif = path.join(out, "abni-github-banner.gif");
    const makeGif = (colors) =>
      ffmpeg([
        "-i",
        master,
        "-filter_complex",
        `[0:v]scale=1280:360:flags=lanczos,split[a][b];[a]palettegen=max_colors=${colors}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
        "-loop",
        "0",
        "-gifflags",
        "+transdiff",
        gif,
      ]);
    makeGif(128);
    if ((await stat(gif)).size > 5_000_000) makeGif(96);
    assert.ok((await stat(gif)).size < 5_000_000, "GIF exceeds 5MB budget");
    ffmpeg([
      "-i",
      master,
      "-vf",
      "scale=1280:360:flags=lanczos",
      "-c:v",
      "libwebp_anim",
      "-lossless",
      "0",
      "-quality",
      "88",
      "-compression_level",
      "6",
      "-loop",
      "0",
      "-an",
      path.join(out, "abni-github-banner.webp"),
    ]);
    for (const name of ["abni-github-motion.mp4", "abni-github-banner.gif"]) {
      const info = JSON.parse(
        run("ffprobe", [
          "-v",
          "error",
          "-count_frames",
          "-show_entries",
          "stream=codec_name,width,height,r_frame_rate,nb_read_frames,duration:format=duration,size",
          "-of",
          "json",
          path.join(out, name),
        ]),
      );
      assert.equal(info.streams[0].nb_read_frames, "240");
      assert.ok(Math.abs(Number(info.format.duration) - 8) < 0.02);
      report.files[name] = info;
      ffmpeg(["-v", "error", "-i", path.join(out, name), "-f", "null", "-"]);
    }
    // Browser decoding validates animated WebP even where FFmpeg demuxers lack ANIM support.
    const imageInfo = await page.evaluate(
      async (data) => {
        const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
        const decoder = new ImageDecoder({ data: bytes, type: "image/webp" });
        await decoder.tracks.ready;
        const track = decoder.tracks.selectedTrack;
        const first = await decoder.decode({ frameIndex: 0 });
        const last = await decoder.decode({ frameIndex: track.frameCount - 1 });
        const result = {
          frameCount: track.frameCount,
          animated: track.animated,
          width: first.image.displayWidth,
          height: first.image.displayHeight,
          lastTimestamp: last.image.timestamp,
        };
        first.image.close();
        last.image.close();
        decoder.close();
        return result;
      },
      (await readFile(path.join(out, "abni-github-banner.webp"))).toString(
        "base64",
      ),
    );
    assert.ok(imageInfo.animated && imageInfo.frameCount > 1);
    report.files["abni-github-banner.webp"] = imageInfo;
    for (const name of [
      "abni-github-banner.gif",
      "abni-github-banner.webp",
      "abni-github-banner.png",
      "abni-github-motion.mp4",
      "contact-sheet.png",
    ]) {
      const bytes = (await stat(path.join(out, name))).size;
      assert.ok(bytes > 100);
      report.files[name] = { ...report.files[name], bytes };
      console.log(`OUTPUT ${name}: ${(bytes / 1024 / 1024).toFixed(3)} MB`);
    }
  }
  assert.deepEqual(report.errors, []);
  await writeFile(
    path.join(out, "render-report.json"),
    JSON.stringify(report, null, 2),
  );
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
