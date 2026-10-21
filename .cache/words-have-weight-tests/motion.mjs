// src/WordsHaveWeight/lib/motion.ts
var FPS = 60;
var DURATION = 20;
var BEATS = [{ name: "HOOK", start: 0, end: 2 }, { name: "HEAVY", start: 2, end: 5 }, { name: "LIGHT", start: 5, end: 8 }, { name: "FAST", start: 8, end: 11 }, { name: "SLOW", start: 11, end: 14 }, { name: "ELASTIC", start: 14, end: 17 }, { name: "FINAL", start: 17, end: 20 }];
var clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
var lerp = (a, b, p2) => a + (b - a) * p2;
var p = (t, a, b) => clamp((t - a) / (b - a));
var ease = (x) => {
  const q = clamp(x);
  return q < 0.5 ? 4 * q * q * q : 1 - (-2 * q + 2) ** 3 / 2;
};
var E = (t, a, b) => ease(p(t, a, b));
var out = (x) => 1 - (1 - clamp(x)) ** 4;
function spring(t, k = 170, d = 26) {
  if (t <= 0) return 0;
  const a = d / 2, w = Math.sqrt(Math.max(1e-3, k - a * a));
  return 1 - Math.exp(-a * t) * (Math.cos(w * t) + a / w * Math.sin(w * t));
}
var S = (t, a) => clamp(spring(t - a));
var osc = (t, a, d = 5, w = 14) => t < 0 ? 0 : a * Math.exp(-d * t) * Math.sin(w * t);
function heavyState(t) {
  const fall = p(t, 0.12, 0.72);
  const hit = Math.max(0, t - 0.72);
  const compress = t >= 0.72 ? -0.2 * Math.exp(-8 * hit) * Math.cos(19 * hit) : 0;
  return { y: t < 0.72 ? lerp(-330, 1130, fall * fall) : 1130 + osc(hit, 24, 7, 17), sy: 1 + compress, sx: 1 / (1 + compress), floor: t < 0.72 ? 0 : 70 * Math.exp(-0.65 * hit) + osc(hit, 35, 5, 15), impact: t >= 0.72 ? Math.exp(-7 * hit) : 0 };
}
function lightState(t, i = 0) {
  const local = Math.max(0, t - 5);
  return { y: lerp(1080, 730, out(p(t, 4.7, 7.8))) + Math.sin(local * 1.65 + i * 0.45) * 11, x: Math.sin(local * 1.2 + i * 0.55) * 5, rotation: Math.sin(local * 1.5 + i * 0.6) * 1.3 };
}
function fastX(t) {
  if (t < 8.85) {
    const q = p(t, 8, 8.85);
    return lerp(-590, 1450, q * q * q);
  }
  if (t < 9.5) return lerp(1450, 550, out(p(t, 8.85, 9.5)));
  if (t < 10.25) return 550 + osc(t - 9.5, 35, 5, 14);
  return lerp(550, 650, out(p(t, 10.25, 11)));
}
var fastVelocity = (t) => (fastX(t + 1e-3) - fastX(t - 1e-3)) / 2e-3;
var slowX = (t) => lerp(610, 510, out(p(t, 11, 14)));
function elasticState(t) {
  let stretch = 1;
  if (t >= 14 && t < 15.15) stretch = 1 + 0.65 * E(t, 14.2, 15.15);
  else if (t >= 15.15) stretch = 1 + 0.65 * Math.exp(-5 * (t - 15.15)) * Math.cos(15 * (t - 15.15));
  return { stretch, sy: 1 / stretch, collapse: E(t, 16.5, 17) };
}
function camera(t) {
  if (t < 5) return { x: 0, y: t < 0.72 ? -18 * p(t, 0.12, 0.72) ** 2 : osc(t - 0.72, 12, 9, 25), zoom: 1 };
  if (t < 8) return { x: 0, y: -10 * Math.sin(p(t, 5, 8) * Math.PI), zoom: 1 };
  if (t < 11) return { x: clamp((550 - fastX(t)) * 0.08, -35, 35), y: 0, zoom: 1 };
  if (t < 14) return { x: 4 * Math.sin((t - 11) * 0.5), y: 0, zoom: 1 };
  return { x: t < 17 ? -10 * (elasticState(t).stretch - 1) : 0, y: 0, zoom: t >= 17 ? lerp(1.018, 1, E(t, 17, 18.3)) : 1 };
}
var mix = (a, b, q) => {
  const n = (s, i) => parseInt(s.slice(i, i + 2), 16);
  return "#" + [1, 3, 5].map((i) => Math.round(lerp(n(a, i), n(b, i), clamp(q))).toString(16).padStart(2, "0")).join("");
};
export {
  BEATS,
  DURATION,
  E,
  FPS,
  S,
  camera,
  clamp,
  ease,
  elasticState,
  fastVelocity,
  fastX,
  heavyState,
  lerp,
  lightState,
  mix,
  osc,
  out,
  p,
  slowX,
  spring
};
