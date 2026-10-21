import {build} from 'esbuild';
import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'gajian-motion/output');
const buildDir = path.join(root, '.cache/gajian-preview');
const fps = 30;
const duration = 30;
const totalFrames = 900;
const viewport = {width: 1080, height: 1920};
const safeArea = {left: 60, top: 100, right: 1020, bottom: 1600};
const times = [.7, 1.3, 2.1, 3.3, 4.8, 6.7, 8.6, 9.6, 10.7, 11.9, 13.2, 14.15, 14.95, 15.95, 16.9, 17.85, 18.9, 19.7, 20.4, 21.8, 23.9, 25.6, 27.2, 28.8, 29.9];
const args = new Set(process.argv.slice(2));
for (const arg of args) {
  if (!['--full', '--check-browser', '--help'].includes(arg)) throw new Error(`Unknown argument: ${arg}`);
}
if (args.has('--help')) {
  console.log('Usage: node scripts/gajian/render.mjs [--full | --check-browser]\nDefault: keyframes, 5-column contact sheet, viewport/font/safe-area/seek checks.\n--full: also render 900 frames and encode master + two-pass TikTok MP4.\n--check-browser: only locate an installed browser; never downloads one.\nOptional environment: CHROME_PATH, FFMPEG_PATH.');
} else {
  await main();
}

async function exists(file) {
  try { return (await fs.stat(file)).isFile(); } catch { return false; }
}

async function installedBrowser() {
  if (process.env.CHROME_PATH) {
    const explicit = path.resolve(process.env.CHROME_PATH);
    if (!await exists(explicit)) throw new Error(`CHROME_PATH is not a file: ${explicit}`);
    return explicit;
  }
  // Discover installed revisions, not a pinned Playwright version. No install/download API is used.
  const candidates = [chromium.executablePath()];
  const caches = new Set([
    process.env.PLAYWRIGHT_BROWSERS_PATH && process.env.PLAYWRIGHT_BROWSERS_PATH !== '0'
      ? path.resolve(process.env.PLAYWRIGHT_BROWSERS_PATH) : null,
    path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData/Local'), 'ms-playwright'),
    path.join(os.homedir(), '.cache/ms-playwright'),
    path.join(os.homedir(), 'Library/Caches/ms-playwright'),
  ].filter(Boolean));
  for (const cache of caches) {
    const entries = await fs.readdir(cache).catch(() => []);
    for (const revision of entries.filter(name => /^chromium(?:_headless_shell)?-\d+$/.test(name)).sort((a, b) => b.localeCompare(a, undefined, {numeric: true}))) {
      for (const suffix of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-x64/Chromium.app/Contents/MacOS/Chromium', 'chrome-headless-shell-win64/chrome-headless-shell.exe', 'chrome-headless-shell-linux64/chrome-headless-shell', 'chrome-headless-shell-mac-arm64/chrome-headless-shell', 'chrome-headless-shell-mac-x64/chrome-headless-shell']) {
        candidates.push(path.join(cache, revision, suffix));
      }
    }
  }
  const require = createRequire(import.meta.url);
  const moduleDirectories = new Set(require.resolve.paths('playwright-core') || []);
  moduleDirectories.add(path.dirname(path.dirname(require.resolve('playwright-core/package.json'))));
  for (const modules of moduleDirectories) {
    for (const platform of ['win64', 'linux64', 'mac-arm64', 'mac-x64']) {
      candidates.push(path.join(modules, '.remotion/chrome-headless-shell', platform, `chrome-headless-shell${platform === 'win64' ? '.exe' : ''}`));
    }
  }
  candidates.push(
    path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Google/Chrome/Application/chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe'),
    path.join(process.env.LOCALAPPDATA || os.homedir(), 'Google/Chrome/Application/chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  );
  for (const candidate of candidates) if (await exists(candidate)) return candidate;
  throw new Error('No installed Chromium found. Set CHROME_PATH to an existing executable. This script never downloads browsers.');
}

function runFFmpeg(args) {
  const result = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-hide_banner', '-nostdin', '-y', ...args], {stdio: 'inherit', cwd: root});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`FFmpeg exited ${result.status} (${result.signal || 'no signal'})`);
}

function shuffledIndices(length) {
  const indices = Array.from({length}, (_, i) => i);
  let seed = 0x67616a69;
  for (let i = length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

async function fontStatus(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const familyName = name => name.replace(/["']/g, '').trim().toLowerCase();
    const faces = [...document.fonts];
    const declared = new Set(faces.map(face => familyName(face.family)));
    const checks = [];
    for (const element of document.querySelectorAll('[data-primary], h1, h2, p, span')) {
      const style = getComputedStyle(element);
      if (!element.textContent?.trim() || !element.getClientRects().length || style.display === 'none' || style.visibility === 'hidden') continue;
      const family = familyName(style.fontFamily.split(',')[0]);
      if (!declared.has(family)) continue;
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const text = element.textContent.trim().slice(0, 120);
      await document.fonts.load(font, text);
      checks.push({family, font, loaded: document.fonts.check(font, text)});
    }
    await document.fonts.ready;
    const records = [...document.fonts].map(face => ({family: face.family, weight: face.weight, style: face.style, status: face.status}));
    return {ok: document.fonts.status === 'loaded' && records.some(face => face.status === 'loaded') && !records.some(face => face.status === 'error') && checks.length > 0 && checks.every(check => check.loaded), status: document.fonts.status, faces: records, checks};
  });
}

async function primaryStatus(page) {
  return page.locator('[data-primary]').evaluateAll((elements, safe) => {
    const visible = elements.filter(element => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      }
      return true;
    });
    return {count: visible.length, warnings: visible.flatMap(element => {
      const rect = element.getBoundingClientRect();
      return rect.left < safe.left - .5 || rect.right > safe.right + .5 || rect.top < safe.top - .5 || rect.bottom > safe.bottom + .5
        ? [{text: element.textContent?.slice(0, 160), rect: {left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom}}] : [];
    })};
  }, safeArea);
}

async function main() {
  const executablePath = await installedBrowser();
  console.log(`BROWSER ${executablePath}`);
  if (args.has('--check-browser')) return;
  const entry = path.join(root, 'scripts/gajian/preview.tsx');
  if (!await exists(entry)) throw new Error(`Visual entry point is not ready: ${entry}`);
  const audio = path.join(root, 'public/gajian/audio/mix-normalized.wav');
  if (args.has('--full') && !await exists(audio)) throw new Error(`Audio input is missing: ${audio}`);
  await fs.mkdir(buildDir, {recursive: true});
  await fs.mkdir(output, {recursive: true});
  // Keep builds independent of any old preview CSS left in the cache.
  const built = await build({entryPoints: [entry], absWorkingDir: root, bundle: true, outdir: buildDir, write: false,
    loader: {'.css': 'css', '.woff2': 'file', '.woff': 'file', '.ttf': 'file', '.otf': 'file', '.png': 'file', '.jpg': 'file', '.svg': 'file'},
    assetNames: 'assets/[name]-[hash]', format: 'iife', platform: 'browser', jsx: 'automatic',
    define: {'process.env.NODE_ENV': '"production"'}, minify: true});
  for (const file of built.outputFiles) {
    await fs.mkdir(path.dirname(file.path), {recursive: true});
    await fs.writeFile(file.path, file.contents);
  }
  const css = built.outputFiles.some(file => file.path.endsWith('preview.css')) ? '<link rel="stylesheet" href="/preview.css">' : '';
  await fs.writeFile(path.join(buildDir, 'index.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gajian frame preview</title>${css}<style>html,body{margin:0;background:#141235;width:1080px;height:1920px;overflow:hidden}</style><div id="root"></div><script src="/preview.js"></script>`);
  const types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.wav': 'audio/wav'};
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname === '/favicon.ico') { res.writeHead(204).end(); return; }
      const asset = pathname.startsWith('/public/') ? pathname.slice('/public/'.length) : pathname.slice(1);
      // Remotion staticFile() assets resolve at the public root; /public/ also works.
      const bases = pathname.startsWith('/public/') ? [path.join(root, 'public')] : [buildDir, path.join(root, 'public')];
      for (const base of bases) {
        const file = path.resolve(base, asset || 'index.html');
        if (!file.startsWith(base + path.sep)) { res.writeHead(403).end(); return; }
        if (!await exists(file)) continue;
        res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-store');
        res.end(await fs.readFile(file));
        return;
      }
      res.writeHead(404).end();
    } catch { res.writeHead(400).end(); }
  });
  let browser;
  const browserErrors = [];
  const report = {fps, duration, totalFrames, viewport, safeArea, times, browser: executablePath, browserErrors,
    viewportTests: [], fontTests: [], primarySafeAreaWarnings: [], primaryElementsChecked: 0, hashes: [], seekSafe: false, passed: false};
  const reportFile = path.join(output, 'preview-check.json');
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    browser = await chromium.launch({executablePath, headless: true, args: ['--disable-gpu', '--font-render-hinting=none', '--force-color-profile=srgb']});
    const url = `http://127.0.0.1:${server.address().port}/?fps=${fps}`;
    const attachErrors = (page, label) => {
      page.on('pageerror', error => browserErrors.push(`${label}: ${error}`));
      page.on('console', message => { if (message.type() === 'error') browserErrors.push(`${label}: ${message.text()}`); });
      page.on('requestfailed', request => browserErrors.push(`${label}: ${request.url()} ${request.failure()?.errorText}`));
      page.on('response', response => { if (response.status() >= 400) browserErrors.push(`${label}: HTTP ${response.status()} ${response.url()}`); });
    };
    const ready = async page => {
      await page.goto(url, {waitUntil: 'networkidle'});
      await page.waitForFunction(() => typeof window.seek === 'function' && typeof window.ready?.then === 'function');
      await page.evaluate(() => window.ready);
      await page.evaluate(() => document.fonts.ready);
    };
    const seek = async (page, time) => {
      await page.evaluate(async time => {
        await window.seek(time);
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }, time);
    };
    const page = await browser.newPage({viewport, deviceScaleFactor: 1});
    attachErrors(page, '1080x1920');
    await ready(page);
    const keyframes = path.join(output, 'keyframes');
    await fs.mkdir(keyframes, {recursive: true});
    // Remove only this pipeline's old numbered keyframes, never unrelated assets.
    for (const name of await fs.readdir(keyframes)) if (/^\d{2}\.png$/.test(name)) await fs.unlink(path.join(keyframes, name));
    const capture = async (time, file) => {
      await seek(page, time);
      return page.screenshot({path: file, type: 'png', animations: 'disabled'});
    };
    const hash = buffer => createHash('sha256').update(buffer).digest('hex');
    for (const [index, time] of times.entries()) {
      await seek(page, time);
      report.fontTests.push({time, ...await fontStatus(page)});
      const primary = await primaryStatus(page);
      report.primaryElementsChecked += primary.count;
      report.primarySafeAreaWarnings.push(...primary.warnings.map(warning => ({time, ...warning})));
      const buffer = await capture(time, path.join(keyframes, `${String(index).padStart(2, '0')}.png`));
      report.hashes.push({time, baseline: hash(buffer)});
    }
    report.shuffledSeekOrder = shuffledIndices(times.length);
    // Compare every beat against an ascending baseline after out-of-order seeks.
    for (const index of report.shuffledSeekOrder) report.hashes[index].shuffled = hash(await capture(times[index]));
    report.seekSafe = report.hashes.every(record => record.baseline === record.shuffled);
    report.viewportTests.push({viewport, browserErrors: [...browserErrors], fonts: report.fontTests[0], passed: !browserErrors.length && report.fontTests.every(test => test.ok)});
    // The composition is a fixed 1080px canvas. Smaller viewport tests check runtime/fonts,
    // not responsive cropping; primary safe-area bounds are checked on the delivery canvas.
    for (const size of [{width: 540, height: 960}, {width: 390, height: 844}]) {
      const testPage = await browser.newPage({viewport: size, deviceScaleFactor: 1});
      const errorStart = browserErrors.length;
      attachErrors(testPage, `${size.width}x${size.height}`);
      try {
        await ready(testPage);
        for (const time of times) await seek(testPage, time);
        const fonts = await fontStatus(testPage);
        const errors = browserErrors.slice(errorStart);
        report.viewportTests.push({viewport: size, times, fonts, browserErrors: errors, passed: fonts.ok && !errors.length});
      } finally { await testPage.close(); }
    }
    runFFmpeg(['-framerate', '1', '-start_number', '0', '-i', path.join(keyframes, '%02d.png'), '-vf', 'scale=270:480,tile=5x5:nb_frames=25:padding=0:margin=0', '-frames:v', '1', path.join(output, 'contact-sheet.png')]);
    report.passed = report.seekSafe && !browserErrors.length && report.primaryElementsChecked > 0 && !report.primarySafeAreaWarnings.length && report.fontTests.every(test => test.ok) && report.viewportTests.every(test => test.passed);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    if (!report.passed) throw new Error(`Preview checks failed. Inspect ${reportFile}`);
    console.log(`PREVIEW PASSED: ${times.length} keyframes; shuffled SHA-256 equality; fonts; 3 viewports; primary safe area.`);
    console.log(`CONTACT SHEET ${path.join(output, 'contact-sheet.png')}`);
    if (!args.has('--full')) return;
    const frames = path.join(output, 'frames');
    await fs.mkdir(frames, {recursive: true});
    for (const name of await fs.readdir(frames)) if (/^\d{4}\.png$/.test(name) && Number(name.slice(0, 4)) >= totalFrames) await fs.unlink(path.join(frames, name));
    for (let frame = 0; frame < totalFrames; frame++) {
      await capture(frame / fps, path.join(frames, `${String(frame).padStart(4, '0')}.png`));
      if (frame % fps === 0) console.log(`FRAMES ${frame}/${totalFrames}`);
    }
    if (browserErrors.length) throw new Error(browserErrors.join('\n'));
    const master = path.join(output, 'gajian-master.mp4');
    runFFmpeg(['-framerate', String(fps), '-start_number', '0', '-i', path.join(frames, '%04d.png'), '-i', audio,
      '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(fps), '-fps_mode', 'cfr',
      '-af', 'apad,atrim=duration=30,asetpts=PTS-STARTPTS', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-ac', '2', '-t', String(duration), '-movflags', '+faststart', master]);
    const passDir = await fs.mkdtemp(path.join(output, '.gajian-pass-'));
    try {
      const common = ['-i', master, '-map', '0:v:0', '-c:v', 'libx264', '-preset', 'slow', '-b:v', '7500k', '-maxrate', '9000k', '-bufsize', '15000k',
        '-pix_fmt', 'yuv420p', '-r', String(fps), '-fps_mode', 'cfr', '-t', String(duration), '-passlogfile', path.join(passDir, 'tiktok')];
      runFFmpeg([...common, '-pass', '1', '-an', '-f', 'null', process.platform === 'win32' ? 'NUL' : '/dev/null']);
      runFFmpeg([...common, '-map', '0:a:0', '-pass', '2', '-c:a', 'copy', '-movflags', '+faststart', path.join(output, 'gajian-tiktok.mp4')]);
    } finally { await fs.rm(passDir, {recursive: true, force: true}); }
    console.log('RENDER COMPLETE: gajian-master.mp4 + gajian-tiktok.mp4. Run node scripts/gajian/verify.mjs next.');
  } catch (error) {
    report.passed = false;
    report.error = String(error);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    throw error;
  } finally {
    try { await browser?.close(); } finally {
      if (server.listening) await new Promise(resolve => server.close(resolve));
    }
  }
}
