// src/MotionCardListicle/lib/motion.ts
var clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
var lerp = (a, b, p) => a + (b - a) * p;
var progress = (t, a, b) => clamp((t - a) / (b - a));
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

// src/MotionCardListicle/lib/design.ts
var C = { ivory: "#F4F0E7", ink: "#202020", red: "#F36B4D", blue: "#3158E7", lime: "#D8EE86", pale: "#C7DAF6" };
var MONO = "'IBM Plex Mono',monospace";
var escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
var text = (x, y, s, size = 32, fill = C.ink, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${escape(s)}</text>`;
var mono = (x, y, s, size = 22, fill = C.ink, extra = "") => text(x, y, s, size, fill, `font-family="${MONO}" font-weight="500" letter-spacing="1.2" ${extra}`);
var rule = (x1, y1, x2, y2, color = C.ink, opacity = 0.25) => `<path d="M${x1} ${y1}H${x2}" transform="${y1 === y2 ? "" : `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI} ${x1} ${y1})`}" stroke="${color}" stroke-width="2" opacity="${opacity}"/>`;
var dot = (x, y, r, fill = C.ink, extra = "") => `<circle cx="${x}" cy="${y}" r="${Math.max(0, r)}" fill="${fill}" ${extra}/>`;
var card = (fill, content, extra = "") => `<g ${extra}><rect x="120" y="350" width="840" height="1130" rx="18" fill="${fill}" stroke="${C.ink}" stroke-width="2" filter="url(#paperShadow)"/>${content}</g>`;
function header(n, name, desc, fill, ink = C.ink) {
  return `${mono(176, 409, "PRINCIPLE / 0" + n, 21, ink)}${text(171, 595, "0" + n, 184, ink, 'letter-spacing="-14"')}<path d="M430 445V590" stroke="${ink}" stroke-width="2" opacity=".3"/>${mono(475, 479, "DESIGN", 19, ink)}${mono(475, 509, "IN MOTION", 19, ink)}${dot(870, 475, 19, ink)}${name.map((s, i) => text(174, 680 + i * 76, s, name.length > 1 ? 64 : 76, ink, 'letter-spacing="-3"')).join("")}${text(177, name.length > 1 ? 815 : 741, desc, 29, ink, 'font-family="Inter,sans-serif" font-weight="500"')}${rule(176, name.length > 1 ? 852 : 785, 904, name.length > 1 ? 852 : 785, ink)}${mono(176, 1425, "THE CARDS TEACH THROUGH MOVEMENT", 17, ink)}${mono(904, 1425, "0" + n, 20, ink, 'text-anchor="end"')}`;
}
var rail = (y, label, ink = C.ink) => `${mono(177, y - 48, label, 22, ink)}<path d="M226 ${y}H854" fill="none" stroke="${ink}" stroke-width="2" opacity=".23"/>${dot(226, y, 7, ink)}${dot(854, y, 7, ink)}`;
function shell(t, content) {
  const step = t < 2.5 ? 0 : Math.min(5, 1 + Math.floor((t - 2.5) / 4));
  return `${mono(96, 161, "DESIGN IN MOTION / VOL. 01", 23)}${mono(984, 161, "60 FPS", 21, C.ink, 'text-anchor="end"')}${rule(96, 193, 984, 193)}${content}${mono(96, 1627, "A STUDY IN INTENTION", 21)}${mono(984, 1627, t < 22.5 ? "0" + step + " / 05" : "05 / 05", 21, C.ink, 'text-anchor="end"')}<g>${[0, 1, 2, 3, 4].map((i) => `<rect x="${96 + i * 180}" y="1662" width="166" height="4" rx="2" fill="${C.ink}" opacity="${step > i ? 1 : 0.14}"/>`).join("")}</g>`;
}
var footer = (left, right, ink = C.ink) => `${mono(176, 1345, left, 21, ink)}${mono(904, 1345, right, 21, ink, 'text-anchor="end"')}`;

// src/MotionCardListicle/scenes/Deck.ts
function deck(t) {
  const build = ease(progress(t, 0.16, 0.72));
  const width = lerp(20, 840, ease(progress(t, 0.08, 0.4)));
  const height = lerp(20, 1130, build);
  const pull = 1 - 0.045 * ease(progress(t, 0.4, 1.4));
  const exit = ease(progress(t, 2.14, 2.5));
  const backs = [C.ink, C.pale, C.lime, C.red].map((c, i) => {
    const p = clamp(stagger(t, 3 - i, 0.46, 0.13));
    const y = (3 - i) * -30 * (1 - exit);
    const angle = (i - 1.5) * 3 * (1 - exit);
    return `<g transform="translate(${(i - 1.5) * 18 * (1 - exit)} ${y}) rotate(${angle} 540 910)" opacity="${p}">${card(c, "", `transform="translate(0 ${(1 - p) * 140})"`)}</g>`;
  }).join("");
  const titleP = clamp(spring(t - 0.7));
  const title = `<g opacity="${titleP}" transform="translate(0 ${(1 - titleP) * 90})">${mono(176, 424, "FIVE NOTES ON BETTER MOVEMENT", 18, C.ivory)}${text(166, 693, "5", 300, C.ivory, 'letter-spacing="-18"')}${text(178, 811, "MOTION", 104, C.ivory, 'letter-spacing="-5"')}${text(178, 916, "PRINCIPLES", 94, C.ivory, 'letter-spacing="-5"')}<path d="M180 980H900" stroke="${C.ivory}" stroke-width="2" opacity=".45"/>${text(178, 1065, "THAT CHANGE", 52, C.ivory, 'letter-spacing="-2"')}${text(178, 1124, "EVERYTHING", 64, C.ivory, 'letter-spacing="-2"')}${mono(180, 1397, "01 \u2014 05 / AN ANIMATED FIELD GUIDE", 19, C.ivory)}${dot(871, 568, 27, C.lime)}<path d="M856 568h30m-13-13 13 13-13 13" fill="none" stroke="${C.ink}" stroke-width="3"/></g>`;
  const opening = `<g transform="translate(540 910) scale(${pull}) translate(-540 -910)">${t > 0.45 ? backs : ""}<g transform="translate(${exit * -40} ${exit * -80}) rotate(${-exit * 5} 540 910) scale(${1 - exit * 0.03})" opacity="${1 - exit}"><rect x="${540 - width / 2}" y="${910 - height / 2}" width="${width}" height="${height}" rx="${lerp(10, 18, build)}" fill="${C.ink}" stroke="${C.ink}" stroke-width="2" filter="url(#paperShadow)"/>${title}</g></g>`;
  return opening;
}

// src/MotionCardListicle/scenes/Easing.ts
function easingCard(t) {
  const enter = clamp(spring(t + 0.32));
  const cycle = clamp((t - 0.65) / 1.15);
  const back = progress(t, 2.05, 3.1);
  const linear = back > 0 ? 1 - back : cycle, eased = ease(linear);
  const x1 = lerp(226, 854, linear), x2 = lerp(226, 854, eased);
  const content = `${header(1, ["EASING"], "Movement needs rhythm.", C.ivory)}${rail(970, "LINEAR")}${rail(1190, "EASED", C.blue)}${dot(x1, 970, 38, C.ink)}${dot(x2, 1190, 38, C.blue)}${mono(904, 920, "CONSTANT SPEED", 17, C.ink, 'text-anchor="end"')}${mono(904, 1140, "SLOW \u2192 FAST \u2192 SLOW", 17, C.blue, 'text-anchor="end"')}${footer("SAME DISTANCE.", "DIFFERENT FEEL.")}`;
  return card(C.ivory, content, `transform="translate(${(1 - enter) * 150} ${(1 - enter) * 170}) rotate(${(1 - enter) * 6} 540 910)"`);
}
var easingIris = (t) => {
  const p = ease(progress(t, 3.5, 4));
  return p > 0 ? dot(226, 1190, lerp(38, 1750, p), C.red) : "";
};

// src/MotionCardListicle/scenes/Anticipation.ts
function anticipationCard(t) {
  const x = arrowX(t), compression = 1 - 0.17 * ease(progress(t, 0.7, 1.35)) + 0.17 * ease(progress(t, 1.35, 1.6));
  const pull = progress(t, 0.7, 1.35), launch = progress(t, 1.35, 1.85), out = ease(progress(t, 3.35, 4));
  const moving = blurAmount(arrowX, t);
  const body = `${header(2, ["ANTICIPATION"], "Prepare before the action.", C.red)}<path d="M225 1110H860" stroke="${C.ink}" stroke-width="2" opacity=".25"/>${dot(325, 1110, 8, C.ink)}<path d="M325 950v-30m0 0H${x}" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".35"/><g opacity="${0.15 * clamp(launch) * clamp(1 - launch) * 4}" transform="translate(${x - moving * 8} 1110) scale(${compression} ${1 / compression})"><path d="M-100-45H0V-92L110 0 0 92V45H-100Z" fill="${C.ink}"/></g><g transform="translate(${x} 1110) scale(${compression} ${1 / compression})"><path d="M-100-45H0V-92L110 0 0 92V45H-100Z" fill="${C.ink}"/></g>${mono(176, 880, "\u2190 LOAD", 22, C.ink, `opacity="${pull}"`)}${mono(904, 880, "RELEASE \u2192", 22, C.ink, `text-anchor="end" opacity="${launch}"`)}${footer("A LITTLE BACK.", "A LOT FORWARD.")}`;
  return card(C.red, body, `transform="translate(${out * 1190} ${-out * 90}) rotate(${out * 12} 540 910)"`);
}

// src/MotionCardListicle/scenes/Squash.ts
function squashCard(t) {
  const b = ballState(t), morph = ease(progress(t, 3.4, 4));
  const height = lerp(102 * b.sy, 1e3, morph), width = lerp(102 * b.sx, 6, morph), y = lerp(1e3 + 263 * progress(b.y, 650, 1110), 1435, morph);
  const content = `${header(3, ["SQUASH &", "STRETCH"], "Give shapes weight.", C.lime)}${mono(904, 916, "VOLUME \u2248 CONSTANT", 17, C.ink, 'text-anchor="end"')}<path d="M208 1263H872" stroke="${C.ink}" stroke-width="3"/><ellipse cx="540" cy="1279" rx="${lerp(26, 84, progress(b.y, 650, 1110))}" ry="9" fill="${C.ink}" opacity="${0.07 + 0.08 * progress(b.y, 650, 1110)}"/><ellipse cx="540" cy="${y - height / 2}" rx="${width / 2}" ry="${height / 2}" fill="${C.ink}"/>${footer("WEIGHT IN THE FALL.", "LIFE IN THE BOUNCE.")}`;
  return card(C.lime, content);
}
function spine(t) {
  const p = ease(progress(t, 3.55, 4));
  return p > 0 ? `<rect x="537" y="${lerp(1100, 370, p)}" width="6" height="${lerp(100, 1090, p)}" rx="3" fill="${C.ink}"/>` : "";
}

// src/MotionCardListicle/scenes/FollowThrough.ts
function followCard(t) {
  const unfold = ease(progress(t, 0, 0.38)), x = followX(t), lag = ribbonLag(t);
  const points = Array.from({ length: 32 }, (_, i) => {
    const q = i / 31;
    const delay = 0.35 * q;
    const px = followX(Math.max(0, t - delay)) - q * 210 - 65;
    const wave = Math.sin(q * Math.PI * 1.5) * ribbonLag(Math.max(0, t - delay)) * 0.7;
    return `${i ? "L" : "M"}${px.toFixed(2)} ${(1090 + wave + q * lag * 0.42).toFixed(2)}`;
  }).join(" ");
  const content = `${header(4, ["FOLLOW-", "THROUGH"], "Let motion continue.", C.pale)}<path d="M210 1187H870" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".2"/><path d="${points}" fill="none" stroke="${C.blue}" stroke-width="30" stroke-linecap="butt"/><rect x="${x - 65}" y="1030" width="130" height="120" rx="8" fill="${C.ink}"/>${dot(x + 27, 1056, 6, C.pale)}${mono(904, 947, t < 1.5 ? "PARENT / MOVING" : "PARENT / STOPPED", 18, C.ink, 'text-anchor="end"')}${mono(176, 1273, t < 1.5 ? "RIBBON / FOLLOWING" : "RIBBON / STILL SETTLING", 18, C.blue)}${footer("THE OBJECT STOPS.", "THE MOTION DOESN\u2019T.")}`;
  return `<g transform="translate(540 0) scale(${Math.max(6e-3, unfold)} 1) translate(-540 0)">${card(C.pale, content)}</g>`;
}
function ribbonWipe(t) {
  const p = ease(progress(t, 3.5, 4));
  return p > 0 ? `<path d="M-140 1830Q${lerp(-500, 750, p)} ${lerp(1560, 0, p)} 1220 ${lerp(1540, 0, p)}" fill="none" stroke="${C.ink}" stroke-width="${lerp(30, 2600, p)}"/>` : "";
}

// src/MotionCardListicle/scenes/Timing.ts
function timingCard(t) {
  const converge = ease(progress(t, 3.2, 3.85));
  const rows = [{ label: "FAST", d: 0.45, y: 940, c: C.red }, { label: "BALANCED", d: 1.1, y: 1100, c: C.lime }, { label: "SLOW", d: 2, y: 1260, c: C.pale }];
  const content = `${header(5, ["TIMING"], "Every frame matters.", C.ink, C.ivory)}${rows.map((r) => {
    const p = timingProgress(t - 0.65, r.d);
    return `<g opacity="${1 - converge}">${rail(r.y, r.label, C.ivory)}${mono(904, r.y - 48, Math.round(r.d * 60) + " FR", 19, C.ivory, 'text-anchor="end"')}</g>${dot(lerp(lerp(226, 854, p), 540, converge), lerp(r.y, 1020, converge), lerp(32, 20, converge), converge > 0.9 ? C.ivory : r.c)}`;
  }).join("")}<g opacity="${1 - converge}">${footer("SAME ACTION.", "THREE EMOTIONS.", C.ivory)}${mono(904, 815, "FRAME " + String(Math.min(120, Math.max(0, Math.floor((t - 0.65) * 60)))).padStart(3, "0"), 17, C.ivory, 'text-anchor="end"')}</g>`;
  return card(C.ink, content);
}

// src/MotionCardListicle/scenes/Finale.ts
function finale(t) {
  const p = ease(progress(t, 0, 0.55));
  const cards = [{ n: "01", name: "EASING", c: C.ivory }, { n: "02", name: "ANTICIPATION", c: C.red }, { n: "03", name: "SQUASH & STRETCH", c: C.lime }, { n: "04", name: "FOLLOW-THROUGH", c: C.pale }, { n: "05", name: "TIMING", c: C.ink }];
  const deck2 = cards.map((c, i) => {
    const s = clamp(stagger(t, i, 0.08, 0.14));
    const x = lerp(540, 194 + i * 42, s), y = lerp(1020, 925 + i * 69, s);
    const w = lerp(40, 690, s), h = lerp(40, 400, s);
    const ink = i === 4 ? C.ivory : C.ink;
    return `<g transform="rotate(${lerp(0, (i - 2) * -3, s)} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${lerp(20, 13, s)}" fill="${c.c}" stroke="${C.ink}" stroke-width="2" filter="url(#paperShadow)"/><g opacity="${s}">${text(x + 31, y + 67, c.n, 48, ink, 'letter-spacing="-3"')}${mono(x + w - 30, y + 56, c.name, 16, ink, 'text-anchor="end"')}${dot(x + w - 53, y + h - 52, 18, ink)}</g></g>`;
  }).join("");
  const titleP = clamp(spring(t - 0.52));
  return `<rect x="${lerp(120, 540, p)}" y="350" width="${840 * (1 - p)}" height="1130" rx="18" fill="${C.ink}" opacity="${1 - p}"/><g transform="translate(0 ${(1 - titleP) * 70})" opacity="${titleP}">${mono(110, 351, "THE TAKEAWAY", 21)}${text(104, 468, "GOOD MOTION", 94, C.ink, 'letter-spacing="-5"')}${text(104, 569, "IS", 94, C.ink, 'letter-spacing="-5"')}${text(104, 670, "INTENTIONAL.", 94, C.blue, 'letter-spacing="-5"')}${mono(110, 755, "5 PRINCIPLES. ENDLESS POSSIBILITIES.", 20)}</g>${deck2}`;
}

// src/MotionCardListicle/lib/film.ts
function svgAt(time) {
  const t = clamp(time, 0, 25), cam = camera(t);
  let body = "";
  if (t < 2.5) {
    const p = ease(progress(t, 2.14, 2.5));
    body = `<g opacity="${p}">${easingCard(t - 2.5)}</g>${deck(t)}`;
  } else if (t < 6.5) {
    body = easingCard(t - 2.5);
  } else if (t < 10.5) {
    const u = t - 6.5;
    const p = ease(progress(u, 0, 0.32));
    const q = ease(progress(u, 3.35, 4));
    body = `${q > 0 ? `<g transform="rotate(${(1 - q) * -12} 540 910) translate(${(1 - q) * -1e3} 0)">${squashCard(-0.1)}</g>` : ""}${u < 0.32 ? `<rect x="${lerp(0, 120, p)}" y="${lerp(0, 350, p)}" width="${lerp(1080, 840, p)}" height="${lerp(1920, 1130, p)}" rx="${18 * p}" fill="${C.red}"/>` : ""}${anticipationCard(u)}`;
  } else if (t < 14.5) {
    const u = t - 10.5, q = ease(progress(u, 3.65, 4));
    body = `<g transform="translate(540 0) scale(${Math.max(6e-3, 1 - q)} 1) translate(-540 0)">${squashCard(u)}</g>${spine(u)}`;
  } else if (t < 18.5) {
    body = followCard(t - 14.5);
  } else if (t < 22.5) {
    const u = t - 18.5, p = ease(progress(u, 0, 0.3));
    body = `<rect x="${lerp(0, 120, p)}" y="${lerp(0, 350, p)}" width="${lerp(1080, 840, p)}" height="${lerp(1920, 1130, p)}" rx="${18 * p}" fill="${C.ink}"/>${timingCard(u)}`;
  } else body = finale(t - 22.5);
  const trans = t >= 6 && t < 6.5 ? easingIris(t - 2.5) : t >= 18 && t < 18.5 ? ribbonWipe(t - 14.5) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" font-family="'Space Grotesk',sans-serif" font-weight="700" style="display:block;background:${C.ivory}"><defs><filter id="paperShadow" x="-25%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="19" flood-color="${C.ink}" flood-opacity=".12"/></filter></defs><rect width="1080" height="1920" fill="${C.ivory}"/><g transform="translate(${cam.x} ${cam.y}) translate(540 910) scale(${cam.zoom}) rotate(${cam.rotation}) translate(-540 -910)">${shell(t, body)}</g>${trans}</svg>`;
}
export {
  svgAt
};
