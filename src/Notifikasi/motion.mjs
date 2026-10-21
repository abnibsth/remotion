export const SCENES = [
  {start: 0, end: 2.5}, {start: 2.5, end: 5.5},
  {start: 5.5, end: 9.5}, {start: 9.5, end: 12.5},
  {start: 12.5, end: 15.5}, {start: 15.5, end: 18},
  {start: 18, end: 20},
];
// Normalize floating-point subtraction so both rendering adapters hit the same cues.
export const normalizeTime = t => Math.round(t * 1e9) / 1e9;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const hash = n => {const v = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return v - Math.floor(v);};
export function springValue(t, stiffness = 170, damping = 27) {
  if (t <= 0) return 0;
  const w = Math.sqrt(stiffness), z = damping / (2 * w);
  if (Math.abs(z - 1) < 0.000001) return 1 - Math.exp(-w * t) * (1 + w * t);
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + z * w / wd * Math.sin(wd * t));
  }
  const r1 = -w * (z - Math.sqrt(z * z - 1)), r2 = -w * (z + Math.sqrt(z * z - 1));
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}
export function sceneAt(t) {
  const index = SCENES.findIndex(s => t >= s.start && t < s.end);
  const i = index < 0 ? (t < 0 ? 0 : 6) : index;
  return {...SCENES[i], index: i, local: normalizeTime(t - SCENES[i].start)};
}
export function shake(t, start, strength = 15, decay = 6) {
  const d = t - start;
  return d < 0 ? 0 : Math.sin(d * 79) * Math.exp(-d * decay) * strength;
}
export function motionState(t) {
  const s = sceneAt(t), intense = s.index === 2 || s.index === 3;
  const events = [0.3, 1.3, 1.55, 1.8, 3.1, 3.7, 4.4, 5.5, 6.5, 7.5, 8.2, 9.5, 10.15, 11.6];
  const amp = intense ? 25 : 9;
  return {...s, characterTime: intense ? Math.floor(t * 8 + 1e-6) / 8 : t,
    cameraScale: 1 + s.local * (intense ? 0.012 : 0.008),
    shakeX: t >= 12.5 ? 0 : events.reduce((v, e) => v + shake(t, e, amp), 0),
    shakeY: t >= 12.5 ? 0 : events.reduce((v, e) => v + shake(t, e, amp * .42, 8), 0),
  };
}
