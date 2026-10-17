export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const progress = (time: number, start: number, end: number) => {
  const x = clamp((time - start) / (end - start));
  return x * x * (3 - 2 * x);
};
export const noise = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Patch = { d: string; depth: number; fill: string };

// Project a twisted torus, then painter-sort its reflective surface patches.
export const torusMesh = (time: number): Patch[] => {
  const ax = 0.62 + Math.sin(time * 0.65) * 0.28;
  const ay = time * 0.42 + 0.45;
  const az = -0.32 + time * 0.12;
  const point = (u: number, v: number) => {
    const tube = 0.32 + 0.045 * Math.sin(u * 3 + time);
    const ring = 0.86 + tube * Math.cos(v);
    let x = ring * Math.cos(u);
    let y = ring * Math.sin(u);
    let z = tube * Math.sin(v) + 0.13 * Math.sin(u * 2 + time);
    [y, z] = [
      y * Math.cos(ax) - z * Math.sin(ax),
      y * Math.sin(ax) + z * Math.cos(ax),
    ];
    [x, z] = [
      x * Math.cos(ay) + z * Math.sin(ay),
      -x * Math.sin(ay) + z * Math.cos(ay),
    ];
    [x, y] = [
      x * Math.cos(az) - y * Math.sin(az),
      x * Math.sin(az) + y * Math.cos(az),
    ];
    const perspective = 3.8 / (3.8 - z);
    return { x: x * 300 * perspective, y: y * 300 * perspective, z };
  };
  const patches: Patch[] = [];
  for (let i = 0; i < 64; i++) {
    for (let j = 0; j < 12; j++) {
      const u = (i / 64) * Math.PI * 2;
      const v = (j / 12) * Math.PI * 2;
      const p = [
        point(u, v),
        point(u + Math.PI / 32, v),
        point(u + Math.PI / 32, v + Math.PI / 6),
        point(u, v + Math.PI / 6),
      ];
      const reflect = Math.sin(v + u * 0.6 + time * 0.45);
      const highlight = Math.pow(
        Math.max(0, Math.cos(v * 1.7 - u * 0.8 + time * 0.3)),
        18,
      );
      const shade = Math.round(
        48 + 155 * Math.pow(Math.abs(reflect), 3) + 50 * highlight,
      );
      const blue = Math.min(255, shade + 14);
      patches.push({
        d:
          p
            .map(
              (q, k) => `${k ? "L" : "M"}${q.x.toFixed(2)},${q.y.toFixed(2)}`,
            )
            .join(" ") + "Z",
        depth: p.reduce((sum, q) => sum + q.z, 0) / 4,
        fill: `rgb(${Math.max(0, shade - 10)},${shade},${blue})`,
      });
    }
  }
  return patches.sort((a, b) => a.depth - b.depth);
};
