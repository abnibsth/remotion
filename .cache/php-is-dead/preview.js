"use strict";
(() => {
  // src/PhpIsDead/motion.mjs
  var stampTimes = [3.1, 4.4, 5.48, 6.36, 7.05];
  var clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  var hash = (n) => {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  var spring = (t, frequency = 18, damping = 11) => t <= 0 ? 0 : 1 - Math.exp(-damping * t) * (Math.cos(frequency * t) + damping / frequency * Math.sin(frequency * t));
  var smooth = (t) => {
    const v = clamp(t);
    return v * v * (3 - 2 * v);
  };
  var sceneAt = (t) => t < 3 ? 0 : t < 8 ? 1 : t < 10 ? 2 : t < 14 ? 3 : t < 18 ? 4 : 5;
  var motion = (t) => ({ time: t, scene: sceneAt(t), push: 1 + 0.014 * t, shakeX: shake(t, 0.12) + shake(t, 1, 4) + shake(t, 1.58, 6), shakeY: shake(t, 0.12, 4, 38) + shake(t, 1.58, 5, 32) });
  var shake = (t, at, amp = 7, freq = 43) => t < at ? 0 : amp * Math.exp(-14 * (t - at)) * Math.sin(freq * (t - at));

  // src/PhpIsDead/design.ts
  var C = { black: "#08090D", charcoal: "#171922", purple: "#777BB4", lavender: "#A99BFF", white: "#F4F3F8", red: "#FF5263", green: "#8EE3A1", muted: "#777986" };
  var text = (value, x, y, size, color = C.white, extra = "") => `<text x="${x}" y="${y}" font-family="Archivo Black" font-size="${size}" fill="${color}" letter-spacing="${-size * 0.045}" ${extra}>${value}</text>`;
  var mono = (value, x, y, size = 22, color = C.muted, extra = "") => `<text x="${x}" y="${y}" font-family="IBM Plex Mono" font-weight="500" font-size="${size}" letter-spacing="1" fill="${color}" ${extra}>${value}</text>`;
  var rule = (y, color = C.charcoal) => `<path d="M80 ${y}H940" stroke="${color}" stroke-width="2"/>`;
  var group = (content, x = 0, y = 0, scale = 1, rotate = 0, opacity = 1) => `<g opacity="${clamp(opacity)}" transform="translate(${x} ${y}) scale(${Math.max(1e-4, scale)}) rotate(${rotate})">${content}</g>`;
  var hit = (content, t, at, cx, cy, heavy = 1) => {
    if (t < at) return "";
    const d = t - at, s = spring(d, heavy === 1 ? 18 : 15, heavy === 1 ? 11 : 10), scale = 1 + (1 - s) * 1.65;
    const squash = 1 - 0.075 * Math.exp(-14 * d) * Math.sin(32 * d);
    return `<g transform="translate(${cx} ${cy}) scale(${scale} ${scale * squash}) translate(${-cx} ${-cy})" style="filter:blur(${Math.max(0, 0.07 - d) * 36}px)">${content}</g>`;
  };
  var php = (x, y, size, color = C.lavender) => text("PHP", x, y, size, color, 'font-style="italic"');
  var frameLabel = (left, right) => `${mono(left, 80, 225, 20)}${mono(right, 940, 225, 20, C.muted, 'text-anchor="end"')}${rule(254)}`;

  // src/PhpIsDead/scenes/Announcement.ts
  var announcement = (t) => {
    if (t < 0.1) return "";
    const m = motion(t), exit = smooth((t - 2.72) / 0.28);
    return `<g transform="translate(${m.shakeX} ${m.shakeY})">${frameLabel("A DEVELOPER TRAGEDY", "VOL. \u221E")}
  <g transform="translate(0 ${-exit * 260}) scale(${1 - exit * 0.16})" opacity="${1 - exit}">
  ${mono("THE INTERNET HAS SPOKEN.", 84, 435, 25, C.white)}
  ${hit(text("PHP", 67, 795, 378), t, 0.12, 500, 650)}
  ${hit(text("IS", 80, 1006, 196), t, 1, 220, 915)}
  ${hit(text("DEAD.", 72, 1272, 250, C.red), t, 1.58, 500, 1150, 2)}
  ${t > 1.58 ? `<path d="M88 1312H922" stroke="${C.red}" stroke-width="${3 + 12 * Math.exp(-10 * (t - 1.58))}"/>` : ""}
  ${mono("(AGAIN)", 86, 1413, 34, C.white)}
  ${mono("AN EXTREMELY SERIOUS MOTION PICTURE", 86, 1470, 18)}
  </g>${rule(1540)}${mono("NO LANGUAGE DIES THIS DRAMATICALLY.", 80, 1585, 16)}
  </g>`;
  };

  // src/PhpIsDead/scenes/Predictions.ts
  var predictions = (t) => {
    const years = ["2005", "2010", "2015", "2020", "2026"];
    let active = 0;
    stampTimes.forEach((v, i) => {
      if (t >= v) active = i;
    });
    const at = stampTimes[active], d = Math.max(0, t - at), settle = spring(d, 20, 12), fly = 1 + (1 - settle) * 1.25;
    let s = frameLabel("THE SAME PREDICTION.", "ON REPEAT.");
    s += mono("A VERY UNOFFICIAL TIMELINE", 80, 335, 21, C.white);
    s += `<path d="M82 435H940" stroke="${C.purple}" stroke-width="3"/>`;
    for (let i = 0; i < 5; i++) {
      const x = 100 + i * 204, seen = t >= stampTimes[i];
      s += `<circle cx="${x}" cy="435" r="${i === active ? 10 : 5}" fill="${seen ? C.red : C.charcoal}"/>`;
      s += mono(years[i], x, 491, 22, seen ? C.white : C.muted, 'text-anchor="middle"');
    }
    const year = text(years[active], 0, 0, 245, C.white, 'text-anchor="middle"');
    s += group(year, 558, 695, fly, -2 * Math.exp(-8 * d));
    s += mono("PHP IS", 266, 852, 52, C.white);
    s += hit(`<rect x="262" y="902" width="666" height="211" fill="${C.red}"/>${text("DEAD.", 284, 1066, 163, C.black)}`, t, at, 600, 1e3);
    for (let i = 0; i < active; i++) {
      s += group(`<rect x="-120" y="-45" width="240" height="92" fill="${C.black}" stroke="${C.red}" stroke-width="3"/>${text("DEAD", -100, 24, 61, C.red)}`, 418 + i * 143, 1255 + i % 2 * 90, 0.85, (i % 2 ? 1 : -1) * (6 + i * 2), 0.65);
    }
    const chaos = clamp((t - 7.15) / 0.63);
    for (let i = 0; i < 38; i++) {
      const at2 = 7.18 + i * 0.014;
      if (t < at2) continue;
      const x = 65 + hash(i + 31) * 970, y = 365 + hash(i + 231) * 1090, sc = 0.55 + hash(i + 99) * 1.3;
      const shape = `<rect x="-145" y="-61" width="290" height="122" fill="${i % 3 === 0 ? C.red : C.black}" stroke="${C.red}" stroke-width="4"/>${text("DEAD", -125, 39, 82, i % 3 === 0 ? C.black : C.red)}`;
      s += group(shape, x, y, sc * (1 + (1 - spring(t - at2, 23, 15)) * 0.8), (hash(i + 16) - 0.5) * 45, chaos);
    }
    s += `<rect x="70" y="1512" width="880" height="92" fill="${C.black}"/>${rule(1515)}${mono("STYLIZED MEME HISTORY. NOT EXACT QUOTES.", 80, 1562, 19)}`;
    const collapse = smooth((t - 7.8) / 0.2);
    return `<g transform="translate(510 925) scale(${1 - collapse * 0.988} ${1 - collapse * 0.997}) translate(-510 -925)" opacity="${1 - collapse * 0.45}">${s}</g>`;
  };

  // src/PhpIsDead/scenes/Silence.ts
  var silence = (t) => {
    const on = Math.floor((t - 8) * 2.2) % 2 === 0;
    return `${t >= 8.82 ? mono("meanwhile...", 510, 899, 34, C.white, 'text-anchor="middle"') : ""}<rect x="497" y="935" width="26" height="8" fill="${C.lavender}" opacity="${on ? 1 : 0.12}"/>`;
  };

  // src/PhpIsDead/scenes/Comeback.ts
  var comeback = (t) => {
    const d = t - 10, reveal = smooth(d / 0.8), pull = 1.65 - 0.65 * smooth(d / 2.5);
    let racks = "";
    const labels = ["REQUEST ROUTING", "DATABASE QUERIES", "API RESPONSES", "QUEUE WORKERS", "BACKGROUND JOBS"];
    for (let col = 0; col < 7; col++) for (let row = 0; row < 9; row++) {
      const id = col * 9 + row, x = col * 144 - 490, y = row * 106 - 390, lit = clamp((d - 0.28 - col * 0.09 - row * 0.07) * 3), progress = (d * 0.38 + id * 0.137) % 1;
      racks += `<g opacity="${lit}"><rect x="${x}" y="${y}" width="130" height="88" fill="${C.black}" stroke="${C.purple}" stroke-opacity=".45" stroke-width="2"/><path d="M${x + 14} ${y + 26}h75M${x + 14} ${y + 37}h48" stroke="${C.purple}" stroke-width="3" stroke-opacity=".6"/><rect x="${x + 14}" y="${y + 60}" width="${90 * progress}" height="3" fill="${C.lavender}"/><circle cx="${x + 111}" cy="${y + 24}" r="4" fill="${C.lavender}"/></g>`;
    }
    let s = frameLabel("MEANWHILE, IN PRODUCTION.", "NO DRAMA.");
    s += `<g transform="translate(510 880) scale(${pull})" opacity="${reveal * 0.62}">${racks}</g>`;
    s += `<rect x="165" y="665" width="720" height="338" fill="${C.black}" opacity=".93"/>`;
    s += `<path d="M175 1002H845" stroke="${C.purple}" stroke-width="2" opacity="${reveal}"/>`;
    const emergence = Math.max(5e-3, spring(d, 11, 9));
    s += group(php(-328, 95, 320), 510, 866, emergence, 0, reveal);
    if (d > 1.25) {
      const a = spring(d - 1.25, 18, 12);
      s += group(text("STILL HERE.", 0, 0, 116, C.white, 'text-anchor="middle"'), 510, 1280, a, 0, clamp((d - 1.25) * 6));
    }
    for (let i = 0; i < 5; i++) {
      const a = clamp((d - 1.65 - i * 0.13) * 4);
      s += mono(labels[i], 80, 1385 + i * 39, 19, C.purple, `opacity="${a}"`);
      s += mono("RUNNING", 940, 1385 + i * 39, 19, C.lavender, `text-anchor="end" opacity="${a}"`);
    }
    if (t > 13.65) {
      const q = smooth((t - 13.65) / 0.35);
      s = `<g transform="translate(510 865) scale(${1 + q * 0.4}) translate(-510 -865)">${s}</g>`;
    }
    return s;
  };

  // src/PhpIsDead/scenes/Punchline.ts
  var punchline = (t) => {
    if (t < 14.65) {
      const d = t - 14, q = smooth(d / 0.5), scale = 1.4 + q * 4;
      return group(php(-328, 95, 320), 510, 866, scale, 0, Math.max(0.035, 1 - smooth((d - 0.38) / 0.22)));
    }
    let s = mono("PHP WOULD LIKE A WORD.", 80, 280, 22, C.purple);
    s += hit(text("BRO,", 75, 645, 227), t, 14.65, 510, 540);
    if (t >= 15.2) {
      const a = spring(t - 15.2, 21, 14);
      s += group(text("I'M STILL", 0, 0, 106), 83, 845 + (1 - a) * 80, 1, 0, clamp((t - 15.2) * 12));
    }
    s += hit(text("RUNNING", 78, 1015, 135), t, 15.65, 510, 945);
    if (t >= 16.25) {
      s += hit(text("YOUR", 82, 1170, 95, C.green), t, 16.25, 250, 1125);
      s += hit(text("BACKEND.", 72, 1365, 154, C.green, 'transform="translate(0 -850) scale(1 1.65)"'), t, 16.25, 510, 1300, 2);
      s += `<path d="M84 1450H930" stroke="${C.green}" stroke-width="3"/>`;
    }
    s += rule(1530);
    const collapse = smooth((t - 17.78) / 0.22);
    return `<g transform="translate(${510 * collapse} ${900 * collapse}) scale(${1 - collapse * 0.995} ${1 - collapse * 0.997})" opacity="${1 - collapse * 0.7}">${s}</g>`;
  };

  // src/PhpIsDead/scenes/Terminal.ts
  var terminal = (t) => {
    const d = t - 18, cmd = "$ php -v".slice(0, Math.floor(clamp((d - 0.1) / 0.5) * 8));
    let s = mono("BACKEND / STILL ON DUTY", 80, 350, 22, C.purple) + rule(390);
    s += mono(cmd, 90, 670, 57, C.white);
    if (d < 0.85) s += `<rect x="${90 + cmd.length * 35}" y="625" width="27" height="50" fill="${C.lavender}" opacity="${Math.floor(d * 4) % 2 === 0 ? 1 : 0.1}"/>`;
    if (d >= 0.85) {
      s += hit(`${text("STILL", 79, 945, 212, C.green)}${text("ALIVE.", 76, 1175, 208, C.green)}`, t, 18.85, 510, 1010);
      s += mono("DEAD SINCE FOREVER.", 86, 1390, 28, C.white);
      s += mono("FICTIONAL MEME RESPONSE.", 86, 1480, 20);
      s += mono("NOT ACTUAL php -v OUTPUT.", 86, 1514, 20);
    }
    const reset = smooth((d - 1.78) / 0.2);
    return `${s}<rect width="1080" height="1920" fill="${C.purple}" opacity="${Math.sin(reset * Math.PI) * 0.8}"/><rect width="1080" height="1920" fill="${C.black}" opacity="${reset}"/>`;
  };

  // src/PhpIsDead/film.ts
  var scenes = [announcement, predictions, silence, comeback, punchline, terminal];
  var svgAt = (t, scene = sceneAt(t)) => `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="${C.black}"/><defs><pattern id="grain" width="7" height="11" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="${C.white}" opacity=".02"/></pattern></defs>${scenes[scene](t)}<rect width="1080" height="1920" fill="url(#grain)" pointer-events="none"/></svg>`;

  // scripts/php-is-dead/preview.ts
  window.seek = async (t) => {
    if (!Number.isFinite(t) || t < 0 || t > 20) throw Error("Seek must be between 0 and 20 seconds");
    document.getElementById("root").innerHTML = svgAt(t);
  };
  window.ready = Promise.all([document.fonts.load('400 200px "Archivo Black"'), document.fonts.load('700 30px "Space Grotesk"'), document.fonts.load('500 30px "IBM Plex Mono"')]).then(() => document.fonts.ready).then(() => window.seek(0));
})();
