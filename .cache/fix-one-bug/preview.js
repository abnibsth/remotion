"use strict";
(() => {
  // src/FixOneBug/design.ts
  var C = { black: "#090B10", charcoal: "#1B202A", white: "#F2F2EF", red: "#FF4D5E", amber: "#FFB454", green: "#7EE0A0", violet: "#8675FF", muted: "#83909D" };
  var text = (s, x, y, size, color = C.white, extra = "") => `<text data-key="true" x="${x}" y="${y}" font-family="Archivo Black" font-size="${size}" letter-spacing="${-size * 0.04}" fill="${color}" ${extra}>${s}</text>`;
  var mono = (s, x, y, size = 23, color = C.muted, extra = "") => `<text x="${x}" y="${y}" font-family="IBM Plex Mono" font-weight="500" font-size="${size}" fill="${color}" ${extra}>${s}</text>`;
  var group = (s, x = 0, y = 0, scale = 1, rot = 0, opacity = 1) => `<g transform="translate(${x} ${y}) scale(${Math.max(1e-5, scale)}) rotate(${rot})" opacity="${Math.max(0, Math.min(1, opacity))}">${s}</g>`;
  var card = (label, index, w = 310, h = 142, color = C.red) => `<rect x="0" y="8" width="${w}" height="${h}" rx="5" fill="#030407"/><rect width="${w}" height="${h}" rx="5" fill="${C.charcoal}" stroke="${color}" stroke-width="2"/><path d="M0 37H${w}" stroke="${color}" stroke-opacity=".65"/><circle cx="19" cy="19" r="4" fill="${color}"/>${mono(`ERR / ${String(index + 1).padStart(2, "0")}`, 34, 25, 14, color)}${mono(label, 18, 80, label.length > 14 ? 19 : 23, C.white)}<path d="M18 104h${w * 0.51}m-${w * 0.51} 12h${w * 0.3}" stroke="${C.muted}" stroke-width="3" opacity=".35"/>`;

  // src/FixOneBug/motion.mjs
  var clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  var smooth = (v) => {
    const x = clamp(v);
    return x * x * (3 - 2 * x);
  };
  var mix = (a, b, q) => a + (b - a) * q;
  var hash = (n) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  var spring = (t) => t <= 0 ? 0 : 1 - Math.exp(-12 * t) * (Math.cos(18 * t) + 12 / 18 * Math.sin(18 * t));
  var labels = ["TYPE ERROR", "NULL VALUE", "TIMEOUT", "404", "500", "BUILD FAILED", "DEPENDENCY ERROR", "UNDEFINED", "CONNECTION LOST", "TEST FAILED"];
  var glyphs = { I: ["111", "010", "010", "010", "010", "010", "111"], T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"], W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"], O: ["01110", "11011", "10001", "10001", "10001", "11011", "01110"], R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"], K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"], S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"], N: ["10001", "11001", "11001", "10101", "10011", "10011", "10001"], M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"], Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"], A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"], C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"], H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"], E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"], ".": ["0", "0", "0", "0", "0", "1", "1"], " ": ["000", "000", "000", "000", "000", "000", "000"] };
  var footprints = [];
  for (const [lineIndex, line] of ["IT WORKS", "ON MY", "MACHINE."].entries()) {
    const width = [...line].reduce((n, ch) => n + glyphs[ch][0].length + 1, 0) - 1;
    let col = 0;
    for (const ch of line) {
      const g = glyphs[ch];
      g.forEach((row, z) => [...row].forEach((v, x) => {
        if (v === "1") footprints.push({ x: (col + x - width / 2) * 22 + 11, z: (lineIndex * 10 + z - 13) * 24 });
      }));
      col += g[0].length + 1;
    }
  }
  var objects = footprints.map((p, id) => {
    const h = 35 + hash(id + 17) * 150;
    return { id: `error-${String(id).padStart(4, "0")}`, index: id, label: labels[id % 10], initial: { x: 510, z: 900 }, spawn: id < 10 ? 6.3 + id * 0.13 : 10 + (Math.abs(p.x) / 420 + hash(id) * 0.5) * 1.2, target: { x: 190 + id % 2 * 360, z: 455 + Math.floor(id % 10 / 2) * 195 }, scale: 1, rotation: (hash(id + 3) - 0.5) * 12, velocity: "cubic-bezier / damped-spring", city: { x: p.x, z: p.z, h }, reveal: { x: p.x, z: p.z } };
  });
  var cameraAt = (t) => {
    const q = smooth((t - 14.4) / 1.5), pull = smooth((t - 10) / 3.7);
    return { yaw: mix(-0.42, 0, q), tilt: mix(0.78, 0, q), scale: mix(mix(1.15, 0.98, pull) + 0.07, 1, q), centerY: mix(1060, 990, q), reveal: q };
  };
  var project = (x, z, h, c) => {
    const a = x * Math.cos(c.yaw) - z * Math.sin(c.yaw), b = x * Math.sin(c.yaw) + z * Math.cos(c.yaw);
    return { x: 510 + a * c.scale, y: c.centerY + (b * Math.cos(c.tilt) - h * Math.sin(c.tilt)) * c.scale };
  };

  // src/FixOneBug/Editor.ts
  var editor = (t) => {
    const fixed = t >= 3.65, exit = smooth((t - 5.9) / 0.55), zoom = 1 + 0.05 * smooth(t / 3);
    let s = mono("PATCH / 001", 85, 244, 23) + mono("A SMALL CHANGE.", 85, 311, 23, C.violet);
    s += text("JUST ONE", 78, 485, 115) + (fixed ? "" : text("SMALL FIX...", 78, 610, 111));
    let panel = `<rect width="880" height="620" rx="15" fill="${C.charcoal}" stroke="#343C48" stroke-width="2"/><path d="M0 76H880" stroke="#343C48" stroke-width="2"/>${mono("checkout.js", 35, 48, 24, C.white)}${mono("LOCAL", 745, 48, 19)}
 ${mono("01", 30, 150, 24)}${mono("const total =", 100, 150, 31, C.violet)}
 ${mono(t >= 3.3 ? "calculateTotal(items ?? []);" : "calculateTotal(items);", 100, 209, 30, C.white)}
 ${mono("02", 30, 302, 24)}${mono("render(total);", 100, 302, 31, C.white)}
 <rect x="89" y="172" width="738" height="60" rx="4" fill="${fixed ? C.green : C.red}" opacity="${fixed ? 0.06 : 0.09}"/>
 <circle cx="52" cy="198" r="11" fill="${fixed ? C.green : C.red}"/>
 ${mono(fixed ? "0 issues" : "1 issue", 34, 578, 23, fixed ? C.green : C.red)}${mono("fictional context", 588, 578, 19)}
 ${group(card(fixed ? "RESOLVED" : "TOTAL MISMATCH", 0, 560, 140, fixed ? C.green : C.red), 102, 365)}`;
    const cursor = smooth((t - 2.9) / 0.4);
    panel += `<path d="M${mix(794, 615, cursor)} ${mix(483, 215, cursor)}l0 38 11-11 10 18 9-5-10-18 15-2Z" fill="${C.white}" stroke="${C.black}" stroke-width="3"/>`;
    s += group(panel, 67, 770, zoom);
    if (fixed) {
      const q = spring(t - 3.65);
      s += group(text("FIXED.", 0, 0, 128, C.green), 82, 671, Math.max(0.01, q));
    }
    const compress = t > 5.8 ? 1 - smooth((t - 5.8) / 0.45) * 0.98 : 1;
    return `<g opacity="${1 - exit}" transform="translate(510 980) scale(${compress}) translate(-510 -980)">${s}</g>`;
  };

  // src/FixOneBug/City.ts
  var points = (p) => p.map((v) => `${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(" ");
  var roof = (x, z, h, c) => [project(x - 10, z - 11, h, c), project(x + 10, z - 11, h, c), project(x + 10, z + 11, h, c), project(x - 10, z + 11, h, c)];
  var city = (t) => {
    const c = cameraAt(t), develop = smooth((t - 9.65) / 2.6);
    let s = "";
    const active = objects.filter((o) => t >= o.spawn).sort((a, b) => a.city.z - b.city.z);
    for (const o of active) {
      const rise = clamp(spring(t - o.spawn)), h = o.city.h * rise, p = roof(o.city.x, o.city.z, h, c), base = roof(o.city.x, o.city.z, 0, c);
      const isAccent = o.index % 9 === 0, top = c.reveal > 0.01 ? `rgb(${Math.round(mix(isAccent ? 255 : 65, 242, c.reveal))},${Math.round(mix(isAccent ? 77 : 73, 242, c.reveal))},${Math.round(mix(isAccent ? 94 : 92, 239, c.reveal))})` : isAccent ? C.red : "#41495C";
      s += `<g data-object="${o.id}"><polygon points="${points([p[1], p[2], base[2], base[1]])}" fill="#181E2B" stroke="#333B4E" stroke-width=".7"/><polygon points="${points([p[2], p[3], base[3], base[2]])}" fill="${isAccent ? "#6B2636" : "#283044"}" stroke="#40465B" stroke-width=".7"/>`;
      for (let level = 25; level < h - 7; level += 27) {
        const q = roof(o.city.x, o.city.z, level, c);
        s += `<path d="M${q[2].x} ${q[2].y}L${q[3].x} ${q[3].y}" stroke="${isAccent ? C.red : C.violet}" stroke-opacity=".55" stroke-width="2"/>`;
      }
      s += `<polygon points="${points(p)}" fill="${top}" stroke="${c.reveal > 0.7 ? C.white : "#7A8295"}" stroke-width=".55"/>`;
      if (c.reveal < 0.8) {
        const center = project(o.city.x, o.city.z, h, c);
        s += `<circle cx="${center.x}" cy="${center.y}" r="${o.index % 11 === 0 ? 2.6 : 1}" fill="${C.red}"/>`;
      }
      s += "</g>";
    }
    if (c.reveal < 1) {
      for (let i = 14; i < active.length; i += 47) {
        const a = active[i], b = active[Math.min(i + 3, active.length - 1)], p = project(a.city.x, a.city.z, a.city.h * 0.65, c), q = project(b.city.x, b.city.z, b.city.h * 0.65, c);
        s += `<path d="M${p.x} ${p.y}L${q.x} ${q.y}" stroke="${C.violet}" stroke-width="4" opacity="${0.5 * (1 - c.reveal)}"/>`;
      }
    }
    const collapse = smooth((t - 17.85) / 0.55);
    const scale = (1 - collapse) * develop;
    return group(s, 510 * collapse, 990 * collapse, Math.max(1e-4, scale), 0, clamp((t - 9.8) * 3));
  };
  var fracture = (t) => {
    let s = "";
    const handoff = smooth((t - 9.65) / 0.9);
    if (t < 6.3) {
      const q = smooth((t - 6) / 0.3);
      return `<path d="M${510 - q * 90} 880l45 45-32 22 58 56" fill="none" stroke="${C.red}" stroke-width="${2 + q * 3}"/>`;
    }
    for (const o of objects.slice(0, 10)) {
      if (t < o.spawn) continue;
      const d = t - o.spawn, p = spring(d), cityP = project(o.city.x, o.city.z, o.city.h, cameraAt(t));
      const x = mix(510 - 155, o.target.x, p), y = mix(895, o.target.z, p), curve = Math.sin(clamp(d / 0.65) * Math.PI) * 70 * (o.index % 2 ? 1 : -1);
      s += group(card(o.label, o.index), mix(x + curve, cityP.x - 10, handoff), mix(y, cityP.y - 11, handoff), mix(0.2 + 0.8 * p, 22 / 310, handoff), o.rotation * (1 - handoff), 1 - handoff);
    }
    return s;
  };

  // src/FixOneBug/film.ts
  var svgAt = (t) => {
    let s = "";
    if (t < 6.45) s += editor(t);
    if (t >= 6 && t < 10.6) s += fracture(t);
    if (t >= 6.3 && t < 10) {
      s += group(text("WAIT. WHAT?", 0, 0, 95), 80, 340, Math.max(1e-3, spring(t - 6.3)));
      s += mono("ILLUSTRATIVE ERRORS. NOT A REAL DIAGNOSIS.", 80, 1580, 17);
    }
    if (t >= 9.8 && t < 18.4) {
      s += city(t);
      if (t < 15) {
        const a = clamp((t - 10) * 3) * (1 - smooth((t - 14.2) / 0.6));
        s += group(text("ONE FIX.", 0, 0, 112), 80, 380, 1, 0, a);
        if (t > 11.2) s += group(text("TEN NEW", 0, 0, 102) + text("PROBLEMS.", 0, 115, 110, C.red), 80, 520, 1, 0, clamp((t - 11.2) * 3) * (1 - smooth((t - 14.2) / 0.6)));
      }
      s += mono(t < 15 ? "BUILD / ERROR DISTRICT" : "A PERFECTLY REASONABLE EXPLANATION.", 80, 258, 20, C.muted, `opacity="${1 - smooth((t - 17.7) / 0.5)}"`);
      if (t >= 15.9 && t < 17.8) s += mono("SAME CITY. DIFFERENT PERSPECTIVE.", 510, 1470, 20, C.violet, 'text-anchor="middle"');
    }
    if (t >= 18) {
      const q = smooth((t - 18) / 0.35), end = smooth((t - 19.65) / 0.35);
      const terminal = `<rect width="850" height="460" rx="12" fill="${C.charcoal}" stroke="#3B4354" stroke-width="2"/><path d="M0 70H850" stroke="#3B4354"/>${mono("LOCAL TERMINAL", 30, 44, 21)}${t >= 18.35 ? mono("&gt; fix completed", 45, 191, 41, C.white) : ""}${t >= 18.85 ? mono("&gt; new errors: 10", 45, 284, 41, C.red) : ""}<rect x="45" y="337" width="24" height="7" fill="${C.white}" opacity="${Math.floor(t * 3) % 2 ? 1 : 0.1}"/>`;
      s += group(terminal, mix(85, 510, end), mix(690, 968, end), q * (1 - end), 0, 1);
      s += `<circle cx="510" cy="968" r="${mix(0, 11, end)}" fill="${C.red}"/>`;
    }
    const margin = `<path d="M80 175H940M80 1640H940" stroke="${C.charcoal}" stroke-width="2"/>${mono("FIX ONE BUG / CREATE TEN MORE", 80, 1684, 16, C.muted)}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="${C.black}"/>${margin}${s}</svg>`;
  };

  // scripts/fix-one-bug/preview.ts
  window.seek = (t) => {
    document.getElementById("root").innerHTML = svgAt(t);
  };
  window.ready = Promise.all([document.fonts.load('400 120px "Archivo Black"'), document.fonts.load('500 30px "IBM Plex Mono"')]).then(() => document.fonts.ready).then(() => {
    document.getElementById("root").innerHTML = svgAt(0);
  });
})();
