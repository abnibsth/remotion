export const DURATION = 29;
export const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return v - Math.floor(v);
};
export const clamp = (v: number, lo = 0, hi = 1) =>
  Math.min(hi, Math.max(lo, v));
export const spring = (t: number, k = 170, d = 27) => {
  if (t <= 0) return 0;
  const w = Math.sqrt(k),
    z = d / (2 * w);
  if (Math.abs(z - 1) < 1e-5) return 1 - (1 + w * t) * Math.exp(-w * t);
  if (z < 1) {
    const q = w * Math.sqrt(1 - z * z);
    return (
      1 -
      Math.exp(-z * w * t) * (Math.cos(q * t) + ((z * w) / q) * Math.sin(q * t))
    );
  }
  const q = Math.sqrt(d * d - 4 * k),
    a = (-d + q) / 2,
    b = (-d - q) / 2;
  return 1 - (b * Math.exp(a * t) - a * Math.exp(b * t)) / (b - a);
};
export const sceneAt = (t: number) =>
  t < 3
    ? "hook"
    : t < 7.5
      ? "wait"
      : t < 11.5
        ? "price"
        : t < 15
          ? "ghost"
          : t < 16.5
            ? "calm"
            : t < 19.5
              ? "reveal"
              : t < 23.5
                ? "ui"
                : t < 26.5
                  ? "gag"
                  : "end";
export const posterized = (t: number) =>
  (t >= 0 && t < 15) || (t >= 23.5 && t < 26.5);
export const visualTime = (t: number) =>
  posterized(t) ? Math.floor(t * 8 + 1e-6) / 8 : t;
export const shake = (t: number, start: number, amount = 12) => {
  const u = t - start;
  return u < 0 ? 0 : Math.sin(u * 77) * Math.exp(-u * 9) * amount;
};
