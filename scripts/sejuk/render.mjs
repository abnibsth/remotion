import { build } from "esbuild";
import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import http from "node:http";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validFramePNG } from "./frame-cache.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = path.join(root, "out/sejuk");
const buildDir = path.join(output, ".preview");
const FPS = 30;
const DURATION = 29;
const TOTAL_FRAMES = FPS * DURATION;
const full = process.argv.includes("--full");
const resume = process.argv.includes("--resume");
const previousReport = resume
  ? JSON.parse(
      await fs.readFile(path.join(output, "render-report.json"), "utf8"),
    )
  : null;
const unknown = process.argv
  .slice(2)
  .filter((arg) => !["--full", "--contact", "--resume"].includes(arg));
if (unknown.length)
  throw new Error(
    `Unknown arguments: ${unknown.join(" ")}. Use --contact (default) or --full.`,
  );

function run(binary, args, quiet = false) {
  const result = spawnSync(binary, args, {
    cwd: root,
    encoding: "utf8",
    stdio: quiet ? "pipe" : "inherit",
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${binary} exited ${result.status}: ${result.stderr || ""}`,
    );
  return result.stdout;
}
const ffmpeg = (args) =>
  run(process.env.FFMPEG_PATH || "ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "warning",
    "-nostats",
    "-y",
    ...args,
  ]);
const sha256 = (bytes) =>
  crypto.createHash("sha256").update(bytes).digest("hex");

async function installedBrowser() {
  const candidates = [process.env.CHROME_PATH, process.env.EDGE_PATH];
  const cacheRoots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    path.join(process.env.LOCALAPPDATA || os.homedir(), "ms-playwright"),
  ].filter(Boolean);
  for (const cache of cacheRoots) {
    const entries = await fs
      .readdir(cache, { withFileTypes: true })
      .catch(() => []);
    for (const entry of entries
      .filter(
        (e) =>
          e.isDirectory() &&
          /^(chromium|chromium_headless_shell)-/.test(e.name),
      )
      .sort((a, b) =>
        b.name.localeCompare(a.name, undefined, { numeric: true }),
      )) {
      for (const relative of [
        "chrome-win64/chrome.exe",
        "chrome-win/chrome.exe",
        "chrome-headless-shell-win64/headless_shell.exe",
        "chrome-headless-shell-win64/chrome-headless-shell.exe",
        "chrome-linux/chrome",
        "chrome-linux64/chrome",
        "chrome-mac/Chromium.app/Contents/MacOS/Chromium",
      ]) {
        candidates.push(path.join(cache, entry.name, relative));
      }
    }
  }
  for (const base of [
    process.env.PROGRAMFILES,
    process.env["PROGRAMFILES(X86)"],
    process.env.LOCALAPPDATA,
  ].filter(Boolean)) {
    candidates.push(
      path.join(base, "Google/Chrome/Application/chrome.exe"),
      path.join(base, "Microsoft/Edge/Application/msedge.exe"),
    );
  }
  candidates.push(
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  );
  for (const candidate of candidates.filter(Boolean)) {
    if (
      await fs
        .stat(candidate)
        .then((s) => s.isFile())
        .catch(() => false)
    )
      return candidate;
  }
  throw new Error(
    "No installed Chromium found. Set CHROME_PATH to existing Chrome/Edge. This script never downloads browsers.",
  );
}

await fs.mkdir(buildDir, { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: [path.join(root, "scripts/sejuk/preview.tsx")],
  bundle: true,
  outdir: buildDir,
  loader: { ".woff2": "file", ".woff": "file" },
  assetNames: "fonts/[name]-[hash]",
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
});
await fs.writeFile(
  path.join(buildDir, "index.html"),
  '<!doctype html><html><head><meta charset="utf-8"><title>Sejuk frame preview</title><link rel="icon" href="data:,"><link rel="stylesheet" href="/preview.css"><style>html,body,#root{margin:0;width:1080px;height:1920px;overflow:hidden}body{background:#141235}</style></head><body><div id="root"></div><script src="/preview.js"></script></body></html>',
);
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
};
const server = http.createServer(async (request, response) => {
  try {
    const urlPath = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const base =
      urlPath.startsWith("/sejuk/") || urlPath.startsWith("/public/")
        ? path.join(root, "public")
        : buildDir;
    const relative =
      urlPath === "/"
        ? "index.html"
        : urlPath.replace(/^\/public\//, "/").replace(/^\/+/, "");
    const file = path.resolve(base, relative);
    if (!file.startsWith(base + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    const data = await fs.readFile(file);
    response
      .writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      })
      .end(data);
  } catch {
    response.writeHead(404).end();
  }
});
let browser;
const report = {
  mode: full ? "full" : "contact",
  width: 1080,
  height: 1920,
  fps: FPS,
  duration: DURATION,
  totalFrames: TOTAL_FRAMES,
  browserErrors: [],
  resourceErrors: [],
  consoleErrors: [],
  seekChecks: [],
};
try {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  report.browserExecutable = await installedBrowser();
  let page;
  const openBrowser = async () => {
    browser = await chromium.launch({
      executablePath: report.browserExecutable,
      headless: true,
      args: [
        "--disable-gpu",
        "--font-render-hinting=none",
        "--force-color-profile=srgb",
      ],
    });
    page = await browser.newPage({
      viewport: { width: 1080, height: 1920 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    page.on("pageerror", (error) => report.browserErrors.push(String(error)));
    page.on("console", (message) => {
      if (message.type() === "error") report.consoleErrors.push(message.text());
    });
    page.on("requestfailed", (request) =>
      report.resourceErrors.push(
        `${request.url()}: ${request.failure()?.errorText}`,
      ),
    );
    page.on("response", (response) => {
      if (response.status() >= 400)
        report.resourceErrors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`, {
      waitUntil: "networkidle",
    });
    await page.waitForFunction(
      () => Boolean(window.ready),
      {},
      { timeout: 30000 },
    );
    await page.evaluate(() => window.ready);
    report.fonts = await page.evaluate(() => ({
      status: document.fonts.status,
      anton: document.fonts.check("400 100px Anton"),
      inter: [400, 600, 700, 900].every((weight) =>
        document.fonts.check(`${weight} 40px Inter`),
      ),
      loaded: [...document.fonts]
        .filter((face) => face.status === "loaded")
        .map((face) => ({
          family: face.family,
          weight: face.weight,
          status: face.status,
        })),
    }));
    if (
      report.fonts.status !== "loaded" ||
      !report.fonts.anton ||
      !report.fonts.inter ||
      !report.fonts.loaded.some((face) => face.family.includes("Anton")) ||
      !report.fonts.loaded.some((face) => face.family.includes("Inter"))
    )
      throw new Error("Font verification failed");
  };
  await openBrowser();
  const verifyBrowser = () => {
    if (
      report.browserErrors.length ||
      report.resourceErrors.length ||
      report.consoleErrors.length
    )
      throw new Error("Browser validation failed; see render-report.json");
  };
  const capture = async (time, file) => {
    // seek flushes React synchronously; screenshot waits for fonts, not animation clocks.
    await page.evaluate((time) => window.seek(time), time);
    const bytes = await page.screenshot({
      path: file,
      type: "png",
      animations: "disabled",
      caret: "hide",
      timeout: 60000,
    });
    verifyBrowser();
    return bytes;
  };
  // Keep explicit scene events even where they coincide with beats: 64 tiles, 8 by 8.
  const times = [
    ...Array.from({ length: 58 }, (_, i) => i * 0.5),
    0.333,
    15.5,
    17.5,
    24.4,
    25.5,
    28.8,
  ].sort((a, b) => a - b);
  const contacts = path.join(output, "contact-frames");
  await fs.mkdir(contacts, { recursive: true });
  report.contactFrames = times.map((time, index) => ({
    time,
    file: `contact-frames/${String(index).padStart(3, "0")}.png`,
  }));
  for (let index = times.length - 1; index >= 0; index--) {
    const frame = report.contactFrames[index];
    frame.sha256 = sha256(
      await capture(frame.time, path.join(output, frame.file)),
    );
    if ((times.length - index) % 30 === 0)
      console.log(`CONTACT ${times.length - index}/${times.length}`);
  }
  for (const time of [0.333, 15.5, 17.5, 24.4, 25.5, 28.8]) {
    const before = report.contactFrames.find(
      (frame) => frame.time === time,
    ).sha256;
    await capture(28.99);
    await capture(0);
    await capture(16.117);
    const after = sha256(await capture(time));
    report.seekChecks.push({ time, before, after, match: before === after });
  }
  report.seekSafe = report.seekChecks.every((check) => check.match);
  if (!report.seekSafe)
    throw new Error("Repeated out-of-order seek screenshots differ");
  ffmpeg([
    "-framerate",
    "1",
    "-i",
    path.join(contacts, "%03d.png"),
    "-vf",
    `scale=216:384:flags=lanczos,tile=8x${Math.ceil(times.length / 8)}:padding=8:margin=8:color=0x0c1620`,
    "-frames:v",
    "1",
    "-update",
    "1",
    path.join(output, "contact-sheet.png"),
  ]);
  console.log(
    `CONTACT READY: ${times.length} frames; repeated seek hashes match`,
  );
  if (full) {
    const audio = path.join(root, "public/sejuk/audio/mix-normalized.wav");
    await fs.access(audio);
    const frames = path.join(output, "frames");
    await fs.mkdir(frames, { recursive: true });
    const reusable = new Set();
    if (resume) {
      // Reuse only complete PNGs whose representative pixels still match this build.
      for (const check of previousReport.contactFrames || []) {
        if (Math.abs(check.time * FPS - Math.round(check.time * FPS)) > 1e-8)
          continue;
        const file = path.join(
          frames,
          `${String(Math.round(check.time * FPS)).padStart(4, "0")}.png`,
        );
        const bytes = await fs.readFile(file).catch(() => null);
        if (
          bytes &&
          validFramePNG(bytes) &&
          sha256(bytes) !== sha256(await capture(check.time))
        )
          throw new Error(
            `Cached artwork differs at ${check.time}s; run without --resume`,
          );
      }
      for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
        const bytes = await fs
          .readFile(path.join(frames, `${String(frame).padStart(4, "0")}.png`))
          .catch(() => null);
        if (bytes && validFramePNG(bytes)) reusable.add(frame);
      }
      console.log(
        `RESUME ${reusable.size}/${TOTAL_FRAMES} complete frames verified`,
      );
    }
    report.reusedFrames = reusable.size;
    report.browserRestarts = 0;
    let batchCount = 0;
    for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
      if (reusable.has(frame)) continue;
      if (batchCount >= 90 || !browser.isConnected()) {
        await browser.close().catch(() => {});
        await openBrowser();
        batchCount = 0;
        report.browserRestarts++;
      }
      await capture(
        frame / FPS,
        path.join(frames, `${String(frame).padStart(4, "0")}.png`),
      );
      batchCount++;
      if ((frame + 1) % 30 === 0)
        console.log(`FRAMES ${frame + 1}/${TOTAL_FRAMES}`);
    }
    verifyBrowser();
    const master = path.join(output, "sejuk-master.mp4");
    const delivery = path.join(output, "sejuk-delivery.mp4");
    const inputs = [
      "-framerate",
      String(FPS),
      "-start_number",
      "0",
      "-i",
      path.join(frames, "%04d.png"),
      "-i",
      audio,
    ];
    const common = [
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-pix_fmt",
      "yuv420p",
      "-r",
      String(FPS),
      "-fps_mode",
      "cfr",
      "-t",
      String(DURATION),
    ];
    const audioArgs = ["-c:a", "aac", "-b:a", "192k", "-ar", "48000"];
    ffmpeg([
      ...inputs,
      ...common,
      "-crf",
      "16",
      ...audioArgs,
      "-movflags",
      "+faststart",
      master,
    ]);
    const pass = [
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-b:v",
      "7800k",
      "-maxrate",
      "12000k",
      "-bufsize",
      "16000k",
      "-pix_fmt",
      "yuv420p",
      "-r",
      String(FPS),
      "-fps_mode",
      "cfr",
      "-t",
      String(DURATION),
      "-passlogfile",
      path.join(output, "delivery-pass"),
    ];
    ffmpeg([
      "-framerate",
      String(FPS),
      "-start_number",
      "0",
      "-i",
      path.join(frames, "%04d.png"),
      ...pass,
      "-pass",
      "1",
      "-an",
      "-f",
      "null",
      process.platform === "win32" ? "NUL" : "/dev/null",
    ]);
    ffmpeg([
      ...inputs,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      ...pass,
      "-pass",
      "2",
      ...audioArgs,
      "-movflags",
      "+faststart",
      delivery,
    ]);
    report.videos = [];
    for (const file of [master, delivery]) {
      const metadata = JSON.parse(
        run(
          process.env.FFPROBE_PATH || "ffprobe",
          ["-v", "error", "-show_format", "-show_streams", "-of", "json", file],
          true,
        ),
      );
      await fs.writeFile(
        `${file}.ffprobe.json`,
        JSON.stringify(metadata, null, 2),
      );
      const video = metadata.streams.find(
        (stream) => stream.codec_type === "video",
      );
      const audioStream = metadata.streams.find(
        (stream) => stream.codec_type === "audio",
      );
      const summary = {
        file: path.basename(file),
        duration: Number(metadata.format.duration),
        size: Number(metadata.format.size),
        width: video?.width,
        height: video?.height,
        videoCodec: video?.codec_name,
        audioCodec: audioStream?.codec_name,
        frameRate: video?.avg_frame_rate,
        frames: Number(video?.nb_frames),
      };
      report.videos.push(summary);
      if (
        Math.abs(summary.duration - DURATION) > 0.05 ||
        summary.width !== 1080 ||
        summary.height !== 1920 ||
        summary.videoCodec !== "h264" ||
        summary.audioCodec !== "aac" ||
        summary.frames !== TOTAL_FRAMES ||
        summary.frameRate !== "30/1" ||
        !summary.size
      )
        throw new Error(`Output verification failed: ${file}`);
    }
    console.log("FULL RENDER READY: master + two-pass delivery verified");
  }
  verifyBrowser();
  report.success = true;
} catch (error) {
  report.success = false;
  report.error = String(error?.stack || error);
  throw error;
} finally {
  await fs.writeFile(
    path.join(output, "render-report.json"),
    JSON.stringify(report, null, 2),
  );
  if (browser) await browser.close();
  if (server.listening) await new Promise((resolve) => server.close(resolve));
}
