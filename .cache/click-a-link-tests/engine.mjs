// src/ClickALink/lib/motion.ts
var FPS = 60;
var DURATION = 30;
var SCENES = [{ name: "THE CLICK", start: 0, end: 3 }, { name: "THE URL", start: 3, end: 6 }, { name: "DNS LOOKUP", start: 6, end: 10 }, { name: "SECURE CONNECTION", start: 10, end: 14 }, { name: "HTTP REQUEST", start: 14, end: 18 }, { name: "HTTP RESPONSE", start: 18, end: 22 }, { name: "BROWSER RENDERING", start: 22, end: 27 }, { name: "THE WHOLE JOURNEY", start: 27, end: 30 }];
var clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
var lerp = (a, b, p) => a + (b - a) * p;
var progress = (t, a, b) => clamp((t - a) / (b - a));
var ease = (x) => {
  const p = clamp(x);
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
};
var E = (t, a, b) => ease(progress(t, a, b));
function spring(t, k = 170, d = 26) {
  if (t <= 0) return 0;
  const a = d / 2, w = Math.sqrt(Math.max(1e-3, k - a * a));
  return 1 - Math.exp(-a * t) * (Math.cos(w * t) + a / w * Math.sin(w * t));
}
var S = (t, a) => clamp(spring(t - a));
var sceneAt = (t) => SCENES.find((s) => t >= s.start && t < s.end) || SCENES[7];
var ROUTE = [{ x: 380, y: 650 }, { x: 650, y: 650 }, { x: 790, y: 545 }, { x: 1110, y: 545 }, { x: 1270, y: 650 }, { x: 1540, y: 650 }];
var ROUTE_PATH = "M380 650H650L790 545H1110L1270 650H1540";
var lengths = ROUTE.slice(1).map((p, i) => Math.hypot(p.x - ROUTE[i].x, p.y - ROUTE[i].y));
var total = lengths.reduce((a, b) => a + b, 0);
function routePoint(p) {
  let distance = clamp(p) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const q = clamp(distance / lengths[i]);
      return { x: lerp(ROUTE[i].x, ROUTE[i + 1].x, q), y: lerp(ROUTE[i].y, ROUTE[i + 1].y, q) };
    }
    distance -= lengths[i];
  }
  return ROUTE[5];
}
var requestProgress = (t) => E(t, 14.8, 16.65);
var responseProgress = (t) => E(t, 18.85, 20.35);
var channelSecure = (t) => t >= 12.35;
var pageState = (t) => ({ parse: E(t, 22, 22.7), style: E(t, 22.65, 23.3), layout: E(t, 23.2, 23.8), paint: E(t, 23.65, 24.5), composite: E(t, 24.3, 25.1), image: E(t, 24.8, 26.1), ready: S(t, 25.4) });
function camera(t) {
  return { x: t < 3 ? -6 * E(t, 0.6, 2.7) : t >= 14 && t < 18 ? -18 * Math.sin(progress(t, 14, 18) * Math.PI) : t >= 18 && t < 22 ? 15 * Math.sin(progress(t, 18, 22) * Math.PI) : 0, y: 0, zoom: t < 3 ? 1 + 0.018 * E(t, 0.6, 2.6) : t >= 27 ? lerp(1.035, 1, E(t, 27, 28.2)) : 1, rotation: 0, depth: 1800, perspective: 1800, targetX: t < 3 ? 1170 : 960, targetY: 600 };
}
export {
  DURATION,
  E,
  FPS,
  ROUTE,
  ROUTE_PATH,
  S,
  SCENES,
  camera,
  channelSecure,
  clamp,
  ease,
  lerp,
  pageState,
  progress,
  requestProgress,
  responseProgress,
  routePoint,
  sceneAt,
  spring
};
