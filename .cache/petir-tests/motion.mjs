// src/Petir/lib/motion.ts
var FPS = 60;
var DURATION = 30;
var clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
var lerp = (a, b, p) => a + (b - a) * p;
var progress = (t, a, b) => clamp((t - a) / (b - a));
var ease = (q) => {
  const p = clamp(q);
  return p * p * (3 - 2 * p);
};
var E = (t, a, b) => ease(progress(t, a, b));
var hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
var spring = (t) => t <= 0 ? 0 : 1 - Math.exp(-13 * t) * (Math.cos(t) + 13 * Math.sin(t));
var S = (t, a) => clamp(spring(t - a));
function channel() {
  return Array.from({ length: 31 }, (_, i) => ({ x: i >= 28 ? 525 : 540 + (hash(i + 17) - 0.5) * 115 + Math.sin(i * 0.55) * 42, y: 650 + i * 25 }));
}
var leaderY = (t) => lerp(650, 1350, Math.floor(progress(t, 20.35, 23.25) * 24) / 24);
var streamerY = (t) => lerp(1400, 1350, E(t, 23.05, 23.45));
var strokeProgress = (t) => E(t, 23.45, 23.85);
var returnY = (t) => lerp(1400, 650, strokeProgress(t));
var flash = (t) => t < 3 ? 0.3 * Math.exp(-Math.max(0, t - 0.35) * 3.1) * E(t, 0.32, 0.36) : 0.34 * E(t, 23.45, 23.55) * (1 - E(t, 23.7, 24.35));
function particle(i, t, kind) {
  const dt = t - 3;
  const speed = kind === "ice" ? 38 : 12;
  return { x: 140 + hash(i * 7 + 2) * 760 + Math.sin(dt * 1.1 + i) * 30, y: 430 + hash(i * 5 + 3) * 650 - dt * speed, z: 0.55 + hash(i + 9) * 0.8, rotation: t * 10 + i * 29 };
}
function camera(t) {
  const enter = E(t, 2.2, 4.1), exit = E(t, 7, 9), strike = E(t, 19.4, 20.5);
  return { x: Math.sin(t * 0.22) * 8, y: t < 8 ? -35 * enter : 0, zoom: t < 8 ? 1 + 0.045 * enter - 0.045 * exit : 1 + 0.025 * Math.sin(progress(t, 8, 20) * Math.PI) * (1 - strike), depth: 1800 };
}
var CAPTIONS = [
  { text: "Pernah kepikiran,\nkenapa petir bisa muncul?", startMs: 350, endMs: 2850, timestampMs: null, confidence: null },
  { text: "Di dalam awan badai,\npartikel es saling bertabrakan.", startMs: 3250, endMs: 7650, timestampMs: null, confidence: null },
  { text: "Tumbukan ini membantu\nmemisahkan muatan listrik.", startMs: 8250, endMs: 13600, timestampMs: null, confidence: null },
  { text: "Saat medan listrik cukup kuat,\nudara mulai terionisasi.", startMs: 14300, endMs: 19600, timestampMs: null, confidence: null },
  { text: "Terbentuklah jalur listrik,\nlalu muncul kilatan petir!", startMs: 20200, endMs: 25600, timestampMs: null, confidence: null },
  { text: "Udara memanas sangat cepat.\nItulah yang menghasilkan guntur.", startMs: 26e3, endMs: 29900, timestampMs: null, confidence: null }
];
export {
  CAPTIONS,
  DURATION,
  E,
  FPS,
  S,
  camera,
  channel,
  clamp,
  ease,
  flash,
  hash,
  leaderY,
  lerp,
  particle,
  progress,
  returnY,
  spring,
  streamerY,
  strokeProgress
};
