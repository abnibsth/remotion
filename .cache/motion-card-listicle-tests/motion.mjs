// src/MotionCardListicle/lib/motion.ts
var FPS = 60;
var DURATION = 25;
var clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
var lerp = (a, b, p) => a + (b - a) * p;
var progress = (t, a, b) => clamp((t - a) / (b - a));
var smooth = (x) => {
  const p = clamp(x);
  return p * p * (3 - 2 * p);
};
function bezier(x, x1 = 0.65, y1 = 0, x2 = 0.35, y2 = 1) {
  const p = clamp(x);
  if (p === 0 || p === 1) return p;
  const c = (u, a, b) => 3 * (1 - u) ** 2 * u * a + 3 * (1 - u) * u * u * b + u ** 3;
  let lo = 0, hi = 1;
  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2;
    if (c(mid, x1, x2) < p) lo = mid;
    else hi = mid;
  }
  return c((lo + hi) / 2, y1, y2);
}
var ease = (x) => bezier(x);
function spring(t, stiffness = 170, damping = 26) {
  if (t <= 0) return 0;
  const alpha = damping / 2, omega2 = stiffness - alpha * alpha;
  if (omega2 > 1e-5) {
    const w2 = Math.sqrt(omega2);
    return 1 - Math.exp(-alpha * t) * (Math.cos(w2 * t) + alpha / w2 * Math.sin(w2 * t));
  }
  if (Math.abs(omega2) < 1e-5) return 1 - (1 + alpha * t) * Math.exp(-alpha * t);
  const w = Math.sqrt(-omega2), a = -alpha + w, b = -alpha - w;
  return 1 - (-b * Math.exp(a * t) + a * Math.exp(b * t)) / (a - b);
}
var oscillation = (t, amplitude, decay = 5, frequency = 11) => t < 0 ? 0 : amplitude * Math.exp(-decay * t) * Math.sin(frequency * t);
var stagger = (t, i, start, gap = 0.12) => spring(t - start - i * gap);
var velocity = (fn, t) => (fn(t + 1e-3) - fn(t - 1e-3)) / 2e-3;
var blurAmount = (fn, t) => Math.min(8, Math.abs(velocity(fn, t)) / 420);
function arrowX(t) {
  if (t < 0.7) return 325;
  if (t < 1.35) return lerp(325, 235, ease(progress(t, 0.7, 1.35)));
  if (t < 1.85) return lerp(235, 665, bezier(progress(t, 1.35, 1.85), 0.16, 0.8, 0.25, 1));
  if (t < 2.8) return 665 + oscillation(t - 1.85, 22, 6, 15);
  return lerp(665, 1220, ease(progress(t, 2.8, 3.6)));
}
function ballState(t) {
  let y = 650, sy = 1;
  if (t < 0.35) y = 650;
  else if (t < 1.15) {
    const p = progress(t, 0.35, 1.15);
    y = lerp(650, 1110, p * p);
    sy = 1 + 0.65 * p * p;
  } else if (t < 1.32) {
    const p = progress(t, 1.15, 1.32);
    y = 1110;
    sy = lerp(0.54, 1, ease(p));
  } else if (t < 2.05) {
    const p = progress(t, 1.32, 2.05);
    y = 1110 - 250 * 4 * p * (1 - p);
    sy = 1 + 0.28 * Math.sin(2 * Math.PI * p);
  } else if (t < 2.19) {
    const p = progress(t, 2.05, 2.19);
    y = 1110;
    sy = lerp(0.7, 1, ease(p));
  } else if (t < 2.72) {
    const p = progress(t, 2.19, 2.72);
    y = 1110 - 115 * 4 * p * (1 - p);
    sy = 1 + 0.17 * Math.sin(2 * Math.PI * p);
  } else if (t < 2.85) {
    const p = progress(t, 2.72, 2.85);
    y = 1110;
    sy = lerp(0.83, 1, ease(p));
  } else {
    const p = progress(t, 2.85, 3.22);
    y = 1110 - 40 * 4 * p * (1 - p);
    sy = 1 + 0.08 * Math.sin(2 * Math.PI * p);
  }
  return { y, sy, sx: 1 / sy };
}
var followX = (t) => lerp(290, 690, ease(progress(t, 0.45, 1.5)));
var ribbonLag = (t) => t < 1.5 ? -velocity(followX, t) * 0.13 : oscillation(t - 1.5, -105, 3.3, 10);
var timingProgress = (t, duration) => ease(clamp(t / duration));
function camera(t) {
  return {
    x: t >= 2.5 && t < 6.5 ? -10 * Math.sin(progress(t, 2.5, 6.5) * Math.PI * 2) : t >= 6.5 && t < 10.5 ? -12 * ease(progress(t, 7.85, 8.4)) : 0,
    y: t >= 10.5 && t < 14.5 ? (ballState(t - 10.5).y - 950) * 0.025 : 0,
    zoom: t < 2.5 ? lerp(1.08, 1, ease(progress(t, 0, 1.5))) : t > 22.5 ? lerp(1.025, 1, ease(progress(t, 22.5, 24.4))) : 1,
    rotation: 0,
    depth: 1800,
    target: { x: 540, y: 910 }
  };
}
export {
  DURATION,
  FPS,
  arrowX,
  ballState,
  bezier,
  blurAmount,
  camera,
  clamp,
  ease,
  followX,
  lerp,
  oscillation,
  progress,
  ribbonLag,
  smooth,
  spring,
  stagger,
  timingProgress,
  velocity
};
