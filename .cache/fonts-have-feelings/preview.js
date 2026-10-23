"use strict";
(() => {
  // src/FontsHaveFeelings/motion.mjs
  var clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  var smooth = (v) => {
    const x = clamp(v);
    return x * x * (3 - 2 * x);
  };
  var mix = (a, b, q) => a + (b - a) * q;
  var spring = (t, w = 19, d = 12) => t <= 0 ? 0 : 1 - Math.exp(-d * t) * (Math.cos(w * t) + d / w * Math.sin(w * t));
  var profiles = {
    bold: { typeface: "Archivo Black", mass: "heavy", motion: "impact", anticipation: 0.35, overshoot: 0.06, settle: 0.55, followThrough: 0.12, trajectory: "gravity", color: "#181818", accent: "#F16A50" },
    italic: { typeface: "Inter Tight", mass: "light", motion: "accelerating", anticipation: 0.12, overshoot: 0.23, settle: 0.18, followThrough: 0.24, trajectory: "cubic arc", color: "#365CFF", accent: "#365CFF" },
    serif: { typeface: "Cormorant Garamond", mass: "medium", motion: "graceful", anticipation: 0.4, overshoot: 0.04, settle: 0.65, followThrough: 0.35, trajectory: "ballet arc", color: "#181818", accent: "#A995E8" },
    monospace: { typeface: "IBM Plex Mono", mass: "precise", motion: "stepped", anticipation: 0.1, overshoot: 0, settle: 0.1, followThrough: 0, trajectory: "orthogonal grid", color: "#181818", accent: "#D8E99A" }
  };
  var starts = { bold: 3, italic: 6, serif: 9, monospace: 12 };
  var openingPose = (key, t) => {
    const local = t >= 18 ? 20 - t : t, life = smooth(local / 0.6) * (1 - smooth((local - 2.5) / 0.5));
    const map = { bold: { x: 82, y: 875, size: 190 }, italic: { x: 300, y: 1085, size: 183 }, serif: { x: 82, y: 1315, size: 213 }, monospace: { x: 220, y: 1495, size: 76 } };
    const a = map[key];
    return { ...a, rotation: key === "italic" ? -7 * life : key === "serif" ? 2.3 * Math.sin(local * 2) * life : 0, dx: key === "monospace" ? Math.floor(local * 3) % 2 * 5 * life : key === "italic" ? Math.sin(local * 3) * 10 * life : 0 };
  };
  var poseAt = (key, t) => {
    const u = t - starts[key];
    let x = 510, y = 1030, sx = 1, sy = 1, rotation = 0;
    if (key === "bold") {
      if (u < 0.5) y = 620 - 24 * smooth(u / 0.5);
      else if (u < 1.03) y = mix(596, 1100, clamp((u - 0.5) / 0.53) ** 2);
      else {
        const d = u - 1.03;
        const squash = 0.14 * Math.exp(-11 * d) * Math.cos(23 * d);
        sx = 1 + squash;
        sy = 1 - squash;
        y = 1100 - 20 * Math.exp(-9 * d) * Math.sin(21 * d);
      }
    } else if (key === "italic") {
      const q = spring(Math.max(0, u - 0.28), 18, 13);
      x = mix(-700, 510, q);
      y = 980 - 95 * Math.sin(clamp(u / 1.15) * Math.PI);
      rotation = -9 + 9 * smooth((u - 0.55) / 0.7);
      if (u > 2.3) {
        const z = clamp((u - 2.3) / 0.52);
        x += 1600 * z * z;
        y -= 260 * z * z;
        rotation = -4 * z;
      }
    } else if (key === "serif") {
      const q = smooth(u / 1.05);
      x = mix(670, 510, q);
      y = mix(1160, 1030, q) - 60 * Math.sin(q * Math.PI);
      rotation = mix(-12, 0, q) + 1.1 * Math.sin(Math.max(0, u - 1) * 2) * smooth((u - 1) / 0.4) * (1 - smooth((u - 2.3) / 0.5));
    } else {
      const step = Math.floor(clamp((u - 0.18) / 1.1) * 6) / 6;
      x = mix(330, 510, step);
      y = mix(1195, 1045, step);
    }
    return { x, y, sx, sy, rotation };
  };
  var assemblyAt = (t) => {
    const target = "PERSONALITY";
    return [...target].map((glyph, i) => {
      const k = i < 3 ? "bold" : i < 6 ? "italic" : i < 9 ? "serif" : "monospace", row = ["bold", "italic", "serif", "monospace"].indexOf(k), n = i - (row === 0 ? 0 : row === 1 ? 3 : row === 2 ? 6 : 9), startX = [200, 180, 260, 125][row] + n * [170, 125, 120, 86][row], startY = 620 + row * 240, at = 15.32 + row * 0.12, q = clamp(k === "monospace" ? Math.floor(smooth((t - at) / 0.65) * 8) / 8 : k === "italic" ? spring(t - at, 21, 15) : k === "bold" ? clamp((t - at) / 0.85) ** 2 : smooth((t - at) / 0.8));
      return { glyph, key: k, x: mix(startX, [94, 178.64, 263.28, 354.64, 428.52, 517.75, 599.89, 682.61, 745.05, 783.25, 853.25][i], q), y: mix(startY, 1035, q), progress: q, row, n };
    });
  };

  // src/FontsHaveFeelings/design.ts
  var C = { ivory: "#F5F1E8", ink: "#181818", vermilion: "#F16A50", cobalt: "#365CFF", lavender: "#A995E8", lime: "#D8E99A", muted: "#858278", line: "#D9D4C9" };
  var group = (s, x = 0, y = 0, sx = 1, sy = sx, r = 0, a = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${Math.max(1e-4, sx)} ${Math.max(1e-4, sy)})" opacity="${Math.max(0, Math.min(1, a))}">${s}</g>`;
  var type = (s, x, y, size, key = "bold", extra = "") => {
    const p = profiles[key];
    return `<text data-key="true" x="${x}" y="${y}" font-family="${p.typeface}" font-size="${size}" font-weight="${key === "bold" ? 400 : key === "italic" ? 800 : key === "serif" ? 500 : 500}" font-style="${key === "italic" ? "italic" : "normal"}" fill="${p.color}" letter-spacing="${key === "monospace" ? 0 : -size * 0.04}" ${extra}>${s}</text>`;
  };
  var mono = (s, x, y, size = 21, color = C.muted, extra = "") => `<text x="${x}" y="${y}" font-family="IBM Plex Mono" font-weight="500" font-size="${size}" fill="${color}" ${extra}>${s}</text>`;
  var rule = (y, color = C.line) => `<path d="M80 ${y}H940" stroke="${color}" stroke-width="2"/>`;
  var caption = (num, word, color) => `${mono(num, 80, 270, 22, color)}${mono("A STUDY IN PERSONALITY", 940, 270, 18, C.muted, 'text-anchor="end"')}${rule(305)}${mono(word, 80, 1480, 29, C.ink)}`;

  // src/FontsHaveFeelings/Opening.ts
  var specimens = (t) => {
    let s = "";
    for (const key of ["bold", "italic", "serif", "monospace"]) {
      const p = openingPose(key, t);
      s += group(type(key.toUpperCase(), 0, 0, p.size, key), p.x + p.dx, p.y, 1, 1, p.rotation);
    }
    return s;
  };
  var opening = (t) => {
    const q = t >= 18 ? 20 - t : t, zoom = 1 + 0.012 * Math.sin(Math.PI * Math.min(3, q) / 3);
    const title = type("WHAT IF FONTS", 80, 490, 88) + type("HAD FEELINGS?", 80, 590, 86);
    const s = `${mono("TYPE / IN MOTION", 80, 248, 21)}${mono("FOUR VOICES. NO WORDS SPOKEN.", 80, 330, 18)}${rule(370)}${title}${specimens(t)}${rule(1575)}${mono("AN EXERCISE IN EXPRESSION.", 80, 1620, 18)}`;
    const exit = t < 3 ? 1 - smooth((t - 2.65) / 0.35) : 1;
    return group(s, 510 * (1 - zoom), 960 * (1 - zoom), zoom, zoom, 0, exit);
  };

  // src/FontsHaveFeelings/Performances.ts
  var bold = (t) => {
    const u = t - 3, p = poseAt("bold", t), d = Math.max(0, u - 1.03), shake = u >= 1.03 ? 3 * Math.exp(-15 * d) * Math.sin(50 * d) : 0;
    let s = caption("01 / BOLD", "CONFIDENT.", C.vermilion);
    const floorY = 1120 + 8 * Math.exp(-10 * d) * Math.sin(25 * d) * (u >= 1.03 ? 1 : 0);
    s += `<path d="M80 ${floorY}Q510 ${floorY + 12 * Math.exp(-8 * d)} 940 ${floorY}" fill="none" stroke="${C.vermilion}" stroke-width="3"/>`;
    s += group(type("BOLD", 0, 0, 264, "bold", 'text-anchor="middle"'), p.x + shake, p.y, p.sx, p.sy);
    if (u >= 1.03) for (let i = 0; i < 3; i++) {
      const x = 130 + i * 310, y = 1120 - 22 * Math.exp(-4 * d) * Math.sin(13 * d + i);
      s += `<rect x="${x}" y="${y}" width="14" height="7" fill="${C.vermilion}" transform="rotate(${8 * Math.exp(-6 * d)} ${x} ${y})"/>`;
    }
    const hand = smooth((u - 2.55) / 0.45);
    s += `<path d="M${80} 1120H${mix(80, 1200, hand)}" stroke="${C.cobalt}" stroke-width="${3 + hand * 3}"/>`;
    return group(s, 0, 0, 1, 1, 0, 1 - smooth((u - 2.8) / 0.2));
  };
  var italic = (t) => {
    const u = t - 6, p = poseAt("italic", t), a = smooth(u / 0.16);
    let s = caption("02 / ITALIC", "UNSTOPPABLE.", C.cobalt);
    s += `<path d="M-180 1120C210 1130 720 1110 1200 680" fill="none" stroke="${C.cobalt}" stroke-width="3" opacity=".5" stroke-dasharray="${Math.max(1, 1500 * smooth(u / 1.1))} 1900"/>`;
    const speed = u < 1 ? clamp((1 - u) * 0.7) : clamp((u - 2.25) * 3);
    for (let i = 3; i > 0; i--) s += group(type("ITALIC", 0, 0, 238, "italic", 'text-anchor="middle"'), p.x - i * 18 * speed, p.y + i * 4, p.sx * (1 + speed * 0.04), 1, p.rotation, 0.07 * speed);
    s += group(type("ITALIC", 0, 0, 238, "italic", 'text-anchor="middle"'), p.x, p.y, p.sx, p.sy, p.rotation, a);
    const tail = smooth((u - 2.6) / 0.4);
    s += `<path d="M1000 800C${mix(1400, 200, tail)} ${mix(400, 800, tail)} 850 1200 220 1170" fill="none" stroke="${C.lavender}" stroke-width="${tail * 8}" opacity="${tail}"/>`;
    return s;
  };
  var serif = (t) => {
    const u = t - 9, p = poseAt("serif", t);
    let s = caption("03 / SERIF", "ELEGANT.", C.lavender);
    const bow = 1 - smooth((u - 2.5) / 0.5);
    s += `<path d="M80 1115C130 1280 790 1340 925 850C955 740 780 635 680 690" fill="none" stroke="${C.lavender}" stroke-width="4" opacity="${0.65 * bow}"/>`;
    const gap = 12 * Math.sin(Math.PI * clamp(u / 2.4));
    for (const [i, ch] of [..."SERIF"].entries()) {
      const x = (i - 2) * (130 + gap);
      s += group(type(ch, 0, 0, 270, "serif", 'text-anchor="middle"'), p.x + x, p.y + Math.sin((i - 2) * 0.5) * 24 * Math.sin(Math.PI * clamp(u / 2.5)), 1, 1, p.rotation + (i - 2) * 1.5 * Math.sin(Math.PI * clamp(u / 2.4)));
    }
    const grid = smooth((u - 2.5) / 0.5);
    s += `<path d="M80 ${mix(1115, 1200, grid)}H940" stroke="${C.lavender}" stroke-width="2" opacity="${grid}"/>`;
    return s;
  };
  var monospace = (t) => {
    const u = t - 12;
    let s = caption("04 / MONOSPACE", "PRECISE.", C.ink), grid = "";
    const expand = smooth(u / 0.7);
    for (let i = 0; i < 11; i++) {
      const x = 80 + i * 86;
      grid += `<path d="M${x} 685V1240" stroke="${C.line}" stroke-width="1.5"/>`;
    }
    for (let i = 0; i < 7; i++) grid += `<path d="M80 ${685 + i * 86}H940" stroke="${C.line}" stroke-width="1.5"/>`;
    s += group(grid, 0, 0, 1, 1, 0, expand);
    for (const [i, ch] of [..."MONOSPACE"].entries()) {
      const at = 0.15 + i * 0.105, q = Math.floor(clamp((u - at) / 0.45) * 4) / 4, x = 125 + i * 86, y = mix(1200 + i % 2 * 86, 1035, q);
      s += `<rect x="${x - 40}" y="978" width="80" height="80" fill="${C.lime}" opacity="${q * 0.8}"/>`;
      s += type(ch, x, y, 88, "monospace", 'text-anchor="middle"');
    }
    if (u > 1.5) s += mono("09 GLYPHS / 09 CELLS / ZERO GUESSWORK", 80, 1360, 20, C.muted);
    return s;
  };

  // src/FontsHaveFeelings/Assembly.ts
  var sources = ["BOL", "ITA", "SER", "MO"];
  var specimens2 = ["BOLD", "ITALIC", "SERIF", "MONOSPACE"];
  var assembly = (t) => {
    let s = mono("FOUR TEMPERAMENTS. ONE VOICE.", 80, 270, 21) + rule(305);
    const letters = assemblyAt(t), unbuild = smooth((t - 18) / 1.35);
    for (const [i, l] of letters.entries()) {
      const p = l.progress, source = sources[l.row][l.n], key = l.key, home = openingPose(key, 20), homeIndex = l.n;
      const homeX = home.x + homeIndex * (home.size * (key === "monospace" ? 0.6 : 0.67)), homeY = home.y;
      const x = mix(l.x, homeX, unbuild), y = mix(l.y, homeY, unbuild);
      const glyphBlend = smooth((p - 0.52) / 0.28) * (1 - unbuild), fontSize = mix(mix(key === "monospace" ? 88 : 147, 126, p), home.size, unbuild);
      const lineX = [94, 178.64, 263.28, 354.64, 428.52, 517.75, 599.89, 682.61, 745.05, 783.25, 853.25][i];
      const trailAlpha = (1 - p) * 0.35;
      s += `<path d="M${300 + l.n * 130} ${620 + l.row * 240}Q510 ${730 + l.row * 75} ${lineX} 985" fill="none" stroke="${profiles[key].accent}" stroke-width="2" opacity="${trailAlpha * (1 - unbuild)}"/>`;
      const id = `letter-${i}`, split = 225 * (1 - glyphBlend);
      s += `<defs><clipPath id="${id}-source"><rect x="-28" y="-225" width="180" height="${Math.max(0, split)}"/></clipPath><clipPath id="${id}-target"><rect x="-28" y="${-225 + split}" width="180" height="${225 - split}"/></clipPath></defs>`;
      let glyph = `<g clip-path="url(#${id}-source)">${type(source, 0, 0, fontSize, key)}</g><g clip-path="url(#${id}-target)">${type(l.glyph, 0, 0, fontSize, key)}</g>`;
      if (p > 0.99 && t < 18) glyph = type(l.glyph, 0, 0, 126, key);
      const rotate = key === "italic" ? mix(-9, 0, p) * (1 - unbuild) : key === "serif" ? mix(7, 0, p) * (1 - unbuild) : 0;
      s += group(glyph, x, y, 1, 1, rotate, 1);
    }
    s += mono("MOTION GIVES TYPE A VOICE.", 510, 1390, 27, C.ink, `text-anchor="middle" opacity="${smooth((t - 16.35) / 0.3) * (1 - unbuild)}"`);
    if (t < 16.7) {
      for (const [row, word] of specimens2.entries()) {
        const key = ["bold", "italic", "serif", "monospace"][row], start = row === 3 ? 2 : 3, q = letters.find((l) => l.row === row).progress;
        for (let i = start; i < word.length; i++) s += group(type(word[i], 0, 0, row === 3 ? 88 : 147, key), [200, 180, 260, 125][row] + i * [170, 125, 120, 86][row], 620 + row * 240, 1 - q * 0.85, 1 - q * 0.85, 0, 1 - q);
      }
    }
    if (t > 18) {
      for (const key of ["bold", "italic", "serif", "monospace"]) {
        const word = key.toUpperCase(), start = key === "bold" ? 3 : key === "italic" ? 3 : key === "serif" ? 3 : 2, p = openingPose(key, 20);
        for (let i = start; i < word.length; i++) s += group(type(word[i], 0, 0, p.size, key), p.x + i * p.size * (key === "monospace" ? 0.6 : 0.67), p.y, unbuild, unbuild, 0, unbuild);
      }
    }
    return s;
  };

  // src/FontsHaveFeelings/film.ts
  var svgAt = (time) => {
    const t = Math.max(0, Math.min(20, time));
    let s = "";
    if (t < 3) s += opening(t);
    if (t >= 2.8 && t < 6.15) s += group(bold(t), 0, 0, 1, 1, 0, smooth((t - 2.8) / 0.2) * (1 - smooth((t - 5.95) / 0.2)));
    if (t >= 5.95 && t < 9.2) s += group(italic(t), 0, 0, 1, 1, 0, smooth((t - 5.95) / 0.2) * (1 - smooth((t - 9) / 0.2)));
    if (t >= 9 && t < 12.2) s += group(serif(t), 0, 0, 1, 1, 0, smooth((t - 9) / 0.2) * (1 - smooth((t - 12) / 0.2)));
    if (t >= 12 && t < 15.3) s += group(monospace(t), 0, 0, 1, 1, 0, smooth((t - 12) / 0.2) * (1 - smooth((t - 15) / 0.3)));
    if (t >= 15 && t < 19.65) s += group(assembly(t), 0, 0, 1, 1, 0, smooth((t - 15) / 0.25) * (1 - smooth((t - 19.2) / 0.45)));
    if (t >= 19.2) s += group(opening(20), 0, 0, 1, 1, 0, smooth((t - 19.2) / 0.45));
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="${C.ivory}"/>${s}</svg>`;
  };

  // scripts/fonts-have-feelings/preview.ts
  var win = window;
  win.seek = (t) => {
    if (!Number.isFinite(t) || t < 0 || t > 20) throw Error("seek expects 0\u201320 seconds");
    document.getElementById("root").innerHTML = svgAt(t);
  };
  win.ready = Promise.all([document.fonts.load('400 200px "Archivo Black"'), document.fonts.load('italic 800 200px "Inter Tight"'), document.fonts.load('500 200px "Cormorant Garamond"'), document.fonts.load('500 30px "IBM Plex Mono"')]).then(() => document.fonts.ready).then(() => win.seek(0));
})();
