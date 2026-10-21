export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const smooth = (t: number, a: number, b: number) => {
  const p = clamp((t - a) / (b - a));
  return p * p * p * (p * (p * 6 - 15) + 10);
};
export const wrapTime = (t: number) => ((t % 8) + 8) % 8;
export const spring = (t: number) =>
  t <= 0 ? 0 : 1 - (1 + 13 * t) * Math.exp(-13 * t);

export const stateAt = (seconds: number) => {
  const t = wrapTime(seconds);
  const typed = smooth(t, 0.15, 0.86);
  const draw = smooth(t, 1.08, 1.5);
  const expand = smooth(t, 1.5, 2.18);
  const mobile = smooth(t, 3.5, 4.48);
  const reveal = smooth(t, 5.5, 6.12);
  const close = smooth(t, 7.2, 7.92);
  const originX = 144 + typed * 226;
  const lineX = mix(originX, 650, draw);
  let x = mix(lineX, mix(650, 847 + reveal * 123, mobile), expand);
  let y = mix(220, mix(67, 50, mobile), expand);
  let width = mix(2, mix(440, 132, mobile), expand);
  let height = mix(22, mix(228, 254, mobile), expand);
  x = mix(x, 144, close);
  y = mix(y, 220, close);
  width = mix(width, 2, close);
  height = mix(height, 22, close);
  return {
    x,
    y,
    width,
    height,
    radius: mix(mix(1, mix(9, 23, mobile), expand), 1, close),
    code: typed * (1 - smooth(t, 1.32, 1.64)) * (1 - close),
    typed: typed * (1 - close),
    cursor: 1 - smooth(t, 1.15, 1.5) + close,
    shell: expand * (1 - close),
    web: smooth(t, 1.78, 2.2) * (1 - mobile) * (1 - close),
    mobile: mobile * (1 - smooth(t, 7.2, 7.5)),
    identity: reveal * (1 - smooth(t, 7.2, 7.65)),
    intro: 1 - smooth(t, 5.42, 5.8) + smooth(t, 7.43, 7.92),
    connector: draw * (1 - expand),
  };
};

// Identical SVG command topology from cursor to browser to phone and back.
export const roundedPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  const n = (v: number) => Number(v.toFixed(4));
  return `M${n(x + radius)},${n(y)}H${n(x + w - radius)}Q${n(x + w)},${n(y)} ${n(x + w)},${n(y + radius)}V${n(y + h - radius)}Q${n(x + w)},${n(y + h)} ${n(x + w - radius)},${n(y + h)}H${n(x + radius)}Q${n(x)},${n(y + h)} ${n(x)},${n(y + h - radius)}V${n(y + radius)}Q${n(x)},${n(y)} ${n(x + radius)},${n(y)}Z`;
};
