// src/Downforce/motion.ts
var FPS = 60;
var DURATION = 30;
var clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
var lerp = (a, b, p) => a + (b - a) * p;
var E = (t, a, b) => {
  const p = clamp((t - a) / (b - a));
  return p * p * (3 - 2 * p);
};
var shots = [
  { t: 0, pos: [-6.5, 1.8, 5.8], target: [-0.3, 0.7, 0], fov: 38 },
  { t: 2.7, pos: [-5.2, 1.1, 4.5], target: [-0.5, 0.65, 0], fov: 36 },
  { t: 5, pos: [-5.9, 2.8, 6], target: [0, 0.7, 0], fov: 39 },
  { t: 7, pos: [2.5, 2.7, 5], target: [1.5, 1.05, 0], fov: 36 },
  { t: 9.3, pos: [3.8, 2.1, 3.2], target: [2.05, 1.35, 0], fov: 34 },
  { t: 12, pos: [4.2, 1.8, 2.9], target: [2, 1.35, 0], fov: 35 },
  { t: 14, pos: [-1.8, 1.7, 4.2], target: [0, 0.15, 0], fov: 38 },
  { t: 17, pos: [1.8, 1.9, 4.2], target: [0.7, 0.2, 0], fov: 38 },
  { t: 19, pos: [3, 1.3, 3.5], target: [1.6, 0.45, 0.65], fov: 36 },
  { t: 22, pos: [2.9, 0.95, 3], target: [1.65, 0.5, 0.8], fov: 36 },
  { t: 25, pos: [-5, 2.1, 5.8], target: [0, 0.6, 0], fov: 38 },
  { t: 27, pos: [-6.4, 2.4, 6.4], target: [0, 0.65, 0], fov: 38 },
  { t: 30, pos: [-6.6, 2.5, 6.6], target: [0, 0.65, 0], fov: 38 }
];
function camera(t) {
  let i = shots.findIndex((s, j) => j < shots.length - 1 && t >= s.t && t < shots[j + 1].t);
  if (i < 0) i = t <= 0 ? 0 : shots.length - 2;
  const a = shots[i], b = shots[i + 1], p = E(t, a.t, b.t);
  const target = a.target.map((v, j) => lerp(v, b.target[j], p));
  const raw = a.pos.map((v, j) => lerp(v, b.pos[j], p));
  const wide = 1.9 - 0.4 * E(t, 6.7, 8) + 0.3 * E(t, 12, 14) - 0.15 * E(t, 18, 20) + 0.25 * E(t, 24, 26);
  return { pos: raw.map((v, j) => target[j] + (v - target[j]) * wide), target, fov: lerp(a.fov, b.fov, p) };
}
var stage = (t) => t < 3 ? "hook" : t < 7 ? "airflow" : t < 13 ? "wing" : t < 19 ? "floor" : t < 25 ? "grip" : "track";
function flowPoint(p, i, type) {
  const x = lerp(-4, 4, p);
  if (type === "under") return { x, y: 0.095 + 0.07 * Math.sin(p * Math.PI) + 0.18 * E(p, 0.63, 0.95), z: -0.65 + i % 5 * 0.3 };
  if (type === "wing") {
    return { x: lerp(0.9, 3.5, p), y: i % 2 ? 1.43 - 0.19 * Math.sin(p * Math.PI) : 1.69 + 0.14 * Math.sin(p * Math.PI), z: -0.95 + Math.floor(i / 2) * 0.36 };
  }
  return { x, y: i < 5 ? 1.85 + Math.sin(p * Math.PI) * 0.42 + i % 3 * 0.18 : 0.78 + i % 2 * 0.15, z: i < 5 ? -0.8 + i * 0.4 : (i % 2 ? 1 : -1) * (1.35 + 0.14 * Math.sin(p * Math.PI)) };
}
var flowOpacity = (t) => E(t, 3, 4) * (1 - E(t, 24.4, 25.4));
var bodyOpacity = (t) => 1 - 0.88 * E(t, 12.3, 13.8) + 0.88 * E(t, 18.3, 19.5) - 0.6 * E(t, 19.6, 20.7) + 0.6 * E(t, 24.1, 25.1);
export {
  DURATION,
  E,
  FPS,
  bodyOpacity,
  camera,
  clamp,
  flowOpacity,
  flowPoint,
  lerp,
  stage
};
