export const FPS = 60;
export const DURATION = 25;
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const progress = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const smooth = (x: number) => { const p = clamp(x); return p * p * (3 - 2 * p); };
export function bezier(x: number, x1 = .65, y1 = 0, x2 = .35, y2 = 1) {
  const p = clamp(x);
  if (p === 0 || p === 1) return p;
  const c = (u: number, a: number, b: number) => 3 * (1-u)**2*u*a + 3*(1-u)*u*u*b + u**3;
  let lo = 0, hi = 1;
  for (let i = 0; i < 26; i++) { const mid = (lo+hi)/2; if (c(mid,x1,x2)<p) lo=mid; else hi=mid; }
  return c((lo+hi)/2,y1,y2);
}
export const ease = (x: number) => bezier(x);
export function spring(t: number, stiffness = 170, damping = 26) {
  if (t <= 0) return 0;
  const alpha = damping / 2, omega2 = stiffness - alpha * alpha;
  if (omega2 > .00001) { const w = Math.sqrt(omega2); return 1-Math.exp(-alpha*t)*(Math.cos(w*t)+alpha/w*Math.sin(w*t)); }
  if (Math.abs(omega2) < .00001) return 1-(1+alpha*t)*Math.exp(-alpha*t);
  const w = Math.sqrt(-omega2), a = -alpha+w, b = -alpha-w;
  return 1-(-b*Math.exp(a*t)+a*Math.exp(b*t))/(a-b);
}
export const oscillation = (t: number, amplitude: number, decay = 5, frequency = 11) => t < 0 ? 0 : amplitude * Math.exp(-decay*t) * Math.sin(frequency*t);
export const stagger = (t: number, i: number, start: number, gap = .12) => spring(t-start-i*gap);
export const velocity = (fn: (t: number) => number, t: number) => (fn(t+.001)-fn(t-.001))/.002;
export const blurAmount = (fn: (t: number) => number, t: number) => Math.min(8, Math.abs(velocity(fn,t)) / 420);
export function arrowX(t: number) {
  if (t < .7) return 325;
  if (t < 1.35) return lerp(325,235,ease(progress(t,.7,1.35)));
  if (t < 1.85) return lerp(235,665,bezier(progress(t,1.35,1.85),.16,.8,.25,1));
  if (t < 2.8) return 665+oscillation(t-1.85,22,6,15);
  return lerp(665,1220,ease(progress(t,2.8,3.6)));
}
export function ballState(t: number) {
  let y = 650, sy = 1;
  if (t < .35) y = 650;
  else if (t < 1.15) { const p=progress(t,.35,1.15); y=lerp(650,1110,p*p); sy=1+.65*p*p; }
  else if (t < 1.32) { const p=progress(t,1.15,1.32); y=1110; sy=lerp(.54,1,ease(p)); }
  else if (t < 2.05) { const p=progress(t,1.32,2.05); y=1110-250*4*p*(1-p); sy=1+.28*Math.sin(2*Math.PI*p); }
  else if (t < 2.19) { const p=progress(t,2.05,2.19); y=1110; sy=lerp(.7,1,ease(p)); }
  else if (t < 2.72) { const p=progress(t,2.19,2.72); y=1110-115*4*p*(1-p); sy=1+.17*Math.sin(2*Math.PI*p); }
  else if (t < 2.85) { const p=progress(t,2.72,2.85); y=1110; sy=lerp(.83,1,ease(p)); }
  else { const p=progress(t,2.85,3.22); y=1110-40*4*p*(1-p); sy=1+.08*Math.sin(2*Math.PI*p); }
  return {y,sy,sx:1/sy};
}
export const followX = (t: number) => lerp(290,690,ease(progress(t,.45,1.5)));
export const ribbonLag = (t: number) => t < 1.5 ? -velocity(followX,t)*.13 : oscillation(t-1.5,-105,3.3,10);
export const timingProgress = (t: number, duration: number) => ease(clamp(t/duration));
export function camera(t: number) {
  return {x: t>=2.5&&t<6.5 ? -10*Math.sin(progress(t,2.5,6.5)*Math.PI*2) : t>=6.5&&t<10.5 ? -12*ease(progress(t,7.85,8.4)) : 0,
    y: t>=10.5&&t<14.5 ? (ballState(t-10.5).y-950)*.025 : 0,
    zoom: t<2.5 ? lerp(1.08,1,ease(progress(t,0,1.5))) : t>22.5 ? lerp(1.025,1,ease(progress(t,22.5,24.4))) : 1,
    rotation: 0, depth: 1800, target: {x:540,y:910}};
}
