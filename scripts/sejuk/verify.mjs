import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import {parseLoudness} from './loudness.mjs';
const probe = (file) => {
  const r = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_format", "-show_streams", "-of", "json", file],
    { encoding: "utf8" },
  );
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
};
const report = JSON.parse(
  await fs.readFile("out/sejuk/render-report.json", "utf8"),
);
assert.equal(report.success, true);
assert.equal(report.seekSafe, true);
assert.equal(
  report.browserErrors.length +
    report.resourceErrors.length +
    report.consoleErrors.length,
  0,
);
const videos = [];
for (const name of ["sejuk-master.mp4", "sejuk-delivery.mp4"]) {
  const p = probe(`out/sejuk/${name}`),
    v = p.streams.find((s) => s.codec_type === "video"),
    a = p.streams.find((s) => s.codec_type === "audio");
  assert.equal(v.width, 1080);
  assert.equal(v.height, 1920);
  assert.equal(v.avg_frame_rate, "30/1");
  assert.equal(Number(v.nb_frames), 870);
  assert.ok(Math.abs(Number(p.format.duration) - 29) < 0.05);
  assert.equal(a.sample_rate, "48000");
  assert.equal(a.channels, 2);
  if (name.includes("delivery"))
    assert.ok(
      Number(p.format.size) < 30000000,
      `Delivery exceeds30MB: ${p.format.size}`,
    );
  await fs.writeFile(`out/sejuk/${name}.ffprobe.json`, JSON.stringify(p, null, 2));
  videos.push({file:name,duration:Number(p.format.duration),size:Number(p.format.size),width:v.width,height:v.height,videoCodec:v.codec_name,audioCodec:a.codec_name,frameRate:v.avg_frame_rate,frames:Number(v.nb_frames)});
  console.log(
    name,
    JSON.stringify({
      seconds: p.format.duration,
      bytes: p.format.size,
      fps: v.avg_frame_rate,
      frames: v.nb_frames,
    }),
  );
}
const files = [
  "src/Sejuk/art.tsx",
  "src/Sejuk/Brand.tsx",
  "src/Sejuk/Problems.tsx",
  "src/Sejuk/index.tsx",
  "src/Sejuk/motion.ts",
  "scripts/sejuk/preview.tsx",
];
for (const file of files) {
  const code = await fs.readFile(file, "utf8");
  assert.ok(
    !/Math\.random|requestAnimationFrame|\btransition\s*:|\banimation\s*:/.test(
      code,
    ),
    `Non-deterministic animation in ${file}`,
  );
}
const l = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-nostats",
    "-i",
    "out/sejuk/sejuk-delivery.mp4",
    "-af",
    "loudnorm=I=-14:TP=-1:LRA=11:print_format=json",
    "-f",
    "null",
    "-",
  ],
  { encoding: "utf8", maxBuffer: 3e6 },
);
assert.equal(l.status, 0, l.stderr);
const loudness = parseLoudness(l.stderr);
console.log("DELIVERY LOUDNESS", loudness);
report.videos = videos;
report.deliveryBitrateTarget = "7800k";
await fs.writeFile("out/sejuk/render-report.json", JSON.stringify(report, null, 2));
await fs.writeFile(
  "out/sejuk/final-verification.json",
  JSON.stringify(
    { success: true, forbiddenClockScan: true, deliveryLoudness: loudness },
    null,
    2,
  ),
);
