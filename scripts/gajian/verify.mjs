import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'gajian-motion/output');
const args = new Set(process.argv.slice(2));
for (const arg of args) {
  if (!['--blackdetect', '--help'].includes(arg)) throw new Error(`Unknown argument: ${arg}`);
}
if (args.has('--help')) {
  console.log('Usage: node scripts/gajian/verify.mjs [--blackdetect]\nVerify both MP4s, 900 source frames, preview checks, full decode, faststart and EBU R128 true peak.\n--blackdetect: additionally fail on near-black intervals >= 0.10 seconds.\nJSON report: stdout and gajian-motion/output/verification.json.\nOptional environment: FFMPEG_PATH, FFPROBE_PATH.');
} else {
  await main();
}

function execute(binary, args) {
  const result = spawnSync(binary, args, {encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, cwd: root});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${binary} exited ${result.status}:\n${result.stderr}`);
  return result;
}

function rational(value) {
  const [numerator, denominator = '1'] = String(value).split('/');
  return Number(numerator) / Number(denominator);
}

function assertDuration(stream, label) {
  assert.equal(Number(stream.duration), 30, `${label}: exact 30-second stream duration`);
  const [numerator, denominator] = stream.time_base.split('/').map(BigInt);
  assert.equal(BigInt(stream.duration_ts) * numerator, 30n * denominator, `${label}: exact duration in time-base ticks`);
}

async function fastStart(file) {
  // Parse top-level MP4 atoms rather than looking for byte strings inside encoded media.
  const handle = await fs.open(file, 'r');
  try {
    const {size} = await handle.stat();
    const atoms = [];
    let offset = 0;
    while (offset + 8 <= size) {
      const header = Buffer.alloc(16);
      const {bytesRead} = await handle.read(header, 0, Math.min(16, size - offset), offset);
      assert.ok(bytesRead >= 8, 'Truncated MP4 atom header');
      const type = header.toString('ascii', 4, 8);
      let length = header.readUInt32BE(0);
      if (length === 1) {
        assert.ok(bytesRead >= 16, 'Truncated extended MP4 atom header');
        const extended = header.readBigUInt64BE(8);
        assert.ok(extended <= BigInt(Number.MAX_SAFE_INTEGER), 'MP4 atom exceeds safe integer size');
        length = Number(extended);
        assert.ok(length >= 16, 'Invalid extended MP4 atom length');
      } else if (length === 0) length = size - offset;
      assert.ok(length >= 8 && offset + length <= size, `Invalid ${type} MP4 atom length`);
      atoms.push({type, offset, bytes: length});
      offset += length;
    }
    assert.equal(offset, size, 'MP4 has trailing or truncated atom bytes');
    const moov = atoms.find(atom => atom.type === 'moov');
    const mdat = atoms.find(atom => atom.type === 'mdat');
    assert.ok(moov && mdat && moov.offset < mdat.offset, 'Faststart requires moov before mdat');
    return {passed: true, atoms};
  } finally { await handle.close(); }
}

function ebur128(stderr) {
  const summary = stderr.slice(stderr.lastIndexOf('Summary:'));
  const value = (pattern, label) => {
    const match = summary.match(pattern);
    assert.ok(match, `EBU R128 ${label} summary missing`);
    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? parsed : match[1];
  };
  return {
    integratedLUFS: value(/\bI:\s+(-?(?:\d+(?:\.\d+)?|inf))\s+LUFS/i, 'integrated loudness'),
    loudnessRangeLU: value(/\bLRA:\s+(-?(?:\d+(?:\.\d+)?|inf))\s+LU/i, 'loudness range'),
    truePeakDbTP: value(/True peak:\s+Peak:\s+(-?(?:\d+(?:\.\d+)?|inf))\s+dBFS/i, 'true peak'),
    summary: summary.trim(),
  };
}

async function verifyFile(name, record) {
  const file = path.join(output, name);
  const stat = await fs.stat(file);
  record.bytes = stat.size;
  record.mebibytes = Number((stat.size / 1024 / 1024).toFixed(3));
  assert.ok(stat.size > 0, `${name}: empty file`);
  const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';
  const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
  const metadata = JSON.parse(execute(ffprobe, ['-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', file]).stdout);
  await fs.writeFile(path.join(output, name.replace('.mp4', '-ffprobe.json')), JSON.stringify(metadata, null, 2));
  const videos = metadata.streams.filter(stream => stream.codec_type === 'video');
  const audios = metadata.streams.filter(stream => stream.codec_type === 'audio');
  assert.equal(videos.length, 1, `${name}: one video stream`);
  assert.equal(audios.length, 1, `${name}: one audio stream`);
  const [video] = videos;
  const [audio] = audios;
  assert.equal(video.width, 1080, `${name}: width`);
  assert.equal(video.height, 1920, `${name}: height`);
  assert.equal(rational(video.r_frame_rate), 30, `${name}: nominal rate`);
  assert.equal(rational(video.avg_frame_rate), 30, `${name}: average rate`);
  assert.equal(video.nb_frames, '900', `${name}: declared frames`);
  assert.equal(video.nb_read_frames, '900', `${name}: decoded frames`);
  assert.equal(video.codec_name, 'h264', `${name}: H.264`);
  assert.equal(video.pix_fmt, 'yuv420p', `${name}: 4:2:0 pixel format`);
  assert.equal(audio.codec_name, 'aac', `${name}: AAC`);
  assert.equal(audio.sample_rate, '48000', `${name}: 48 kHz audio`);
  assert.equal(audio.channels, 2, `${name}: stereo audio`);
  assert.equal(Number(metadata.format.duration), 30, `${name}: exact 30-second container`);
  assertDuration(video, `${name} video`);
  assertDuration(audio, `${name} audio`);
  record.media = {duration: 30, frames: 900, width: 1080, height: 1920, fps: 30, videoCodec: video.codec_name,
    pixelFormat: video.pix_fmt, audioCodec: audio.codec_name, sampleRate: Number(audio.sample_rate), channels: audio.channels,
    videoBitrate: Number(video.bit_rate), containerBitrate: Number(metadata.format.bit_rate)};
  record.fastStart = await fastStart(file);
  // Decode every video/audio packet; -xerror promotes decoder warnings/errors to failures.
  execute(ffmpeg, ['-hide_banner', '-nostdin', '-v', 'error', '-xerror', '-err_detect', 'explode', '-i', file,
    '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', '-']);
  record.decodePassed = true;
  const loudness = execute(ffmpeg, ['-hide_banner', '-nostdin', '-nostats', '-i', file, '-map', '0:a:0', '-vn',
    '-af', 'ebur128=peak=true:framelog=verbose', '-f', 'null', '-']);
  record.loudness = ebur128(loudness.stderr);
  assert.ok(Math.abs(record.loudness.integratedLUFS + 14) <= 1, `${name}: integrated loudness must remain around -14 LUFS`);
  assert.ok(record.loudness.truePeakDbTP <= -1, `${name}: encoded true peak exceeds -1 dBTP`);
  if (args.has('--blackdetect')) {
    const scan = execute(ffmpeg, ['-hide_banner', '-nostdin', '-nostats', '-i', file, '-map', '0:v:0', '-an',
      '-vf', 'blackdetect=d=0.10:pix_th=0.06:pic_th=0.98', '-f', 'null', '-']);
    const intervals = [...scan.stderr.matchAll(/black_start:([\d.]+)\s+black_end:([\d.]+)\s+black_duration:([\d.]+)/g)]
      .map(match => ({start: Number(match[1]), end: Number(match[2]), duration: Number(match[3])}));
    record.blackdetect = {enabled: true, minimumDuration: .1, intervals};
    assert.equal(intervals.length, 0, `${name}: near-black intervals detected (omit --blackdetect for intentional black scenes)`);
  } else record.blackdetect = {enabled: false};
  record.passed = true;
}

async function main() {
  const report = {passed: false, expected: {duration: 30, frames: 900, width: 1080, height: 1920, fps: 30, audioCodec: 'aac', sampleRate: 48000},
    files: [], checks: [], errors: []};
  try {
    for (const name of ['gajian-master.mp4', 'gajian-tiktok.mp4']) {
      const record = {name, passed: false};
      report.files.push(record);
      try { await verifyFile(name, record); }
      catch (error) { record.error = String(error); report.errors.push(`${name}: ${error}`); }
    }
    try {
      const frameNames = (await fs.readdir(path.join(output, 'frames'))).filter(name => /^\d{4}\.png$/.test(name)).sort();
      const expected = Array.from({length: 900}, (_, frame) => `${String(frame).padStart(4, '0')}.png`);
      assert.deepEqual(frameNames, expected, 'Exactly frames 0000–0899 must exist');
      report.checks.push('900 consecutive source PNG frames');
      const preview = JSON.parse(await fs.readFile(path.join(output, 'preview-check.json'), 'utf8'));
      assert.equal(preview.passed, true, 'Preview must pass');
      assert.equal(preview.fps, 30);
      assert.equal(preview.duration, 30);
      assert.equal(preview.totalFrames, 900);
      assert.equal(preview.seekSafe, true, 'Arbitrary seek pixel equality');
      assert.ok(preview.times.length >= 24, 'At least 24 beat keyframes');
      assert.ok(preview.times.filter(time => time < 3).length >= 3, 'Several opening keyframes');
      assert.equal(preview.hashes.length, preview.times.length);
      assert.ok(preview.hashes.every(hash => hash.baseline && hash.baseline === hash.shuffled), 'Every shuffled hash must match');
      assert.deepEqual(preview.browserErrors, [], 'No browser/runtime/asset errors');
      assert.ok(preview.primaryElementsChecked > 0, '[data-primary] elements must be checked');
      assert.deepEqual(preview.primarySafeAreaWarnings, [], 'Primary elements must stay in safe area');
      assert.ok(preview.fontTests.length >= preview.times.length && preview.fontTests.every(test => test.ok), 'Fonts loaded on all beats');
      assert.ok(preview.viewportTests.length >= 3 && preview.viewportTests.every(test => test.passed && test.fonts.ok && !test.browserErrors.length), 'All viewport runtime/font tests pass');
      assert.ok((await fs.stat(path.join(output, 'contact-sheet.png'))).size > 0, 'Contact sheet exists');
      report.checks.push('shuffled seeking SHA-256 equality on every beat', 'loaded custom fonts', 'three viewport runtime/font tests',
        'primary typography inside safe area', 'no browser errors', '5-column contact sheet');
    } catch (error) { report.errors.push(`Source/preview checks: ${error}`); }
    report.passed = report.files.every(file => file.passed) && !report.errors.length;
    if (report.passed) report.checks.push('exact 30s / 900-frame / 1080x1920 / 30fps video', 'AAC 48kHz stereo audio', 'full video/audio decode',
      'faststart MP4 atoms', 'EBU R128 integrated loudness and true peak measured', 'file sizes recorded');
  } catch (error) { report.errors.push(String(error)); }
  try {
    await fs.mkdir(output, {recursive: true});
    await fs.writeFile(path.join(output, 'verification.json'), JSON.stringify(report, null, 2));
  } catch (error) { report.passed = false; report.errors.push(`Could not save verification.json: ${error}`); }
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}
