export type Point = [number, number];
export const TAU = Math.PI * 2;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (v: number) => { const t = clamp(v); return t * t * t * (t * (t * 6 - 15) + 10); };
export const progress = (t: number, a: number, b: number) => smooth((t - a) / (b - a));
export const loopTime = (t: number) => ((t % 20) + 20) % 20;
export const spring = (t: number, frequency = 13, damping = 7) => t <= 0 ? 0 : 1 - Math.exp(-damping * t) * (Math.cos(frequency * t) + damping / frequency * Math.sin(frequency * t));
export const colorMix = (a: string, b: string, t: number) => {
  const aa = a.replace('#', ''), bb = b.replace('#', '');
  return '#' + [0, 2, 4].map(i => Math.round(mix(parseInt(aa.slice(i, i + 2), 16), parseInt(bb.slice(i, i + 2), 16), t)).toString(16).padStart(2, '0')).join('');
};
export const mixPoints = (a: Point[], b: Point[], t: number): Point[] => a.map((p, i) => [mix(p[0], b[i][0], t), mix(p[1], b[i][1], t)]);
