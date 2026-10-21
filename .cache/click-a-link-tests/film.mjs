// src/ClickALink/lib/motion.ts
var SCENES = [{ name: "THE CLICK", start: 0, end: 3 }, { name: "THE URL", start: 3, end: 6 }, { name: "DNS LOOKUP", start: 6, end: 10 }, { name: "SECURE CONNECTION", start: 10, end: 14 }, { name: "HTTP REQUEST", start: 14, end: 18 }, { name: "HTTP RESPONSE", start: 18, end: 22 }, { name: "BROWSER RENDERING", start: 22, end: 27 }, { name: "THE WHOLE JOURNEY", start: 27, end: 30 }];
var clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
var lerp = (a, b, p) => a + (b - a) * p;
var progress = (t, a, b) => clamp((t - a) / (b - a));
var ease = (x) => {
  const p = clamp(x);
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
};
var E = (t, a, b) => ease(progress(t, a, b));
function spring(t, k = 170, d = 26) {
  if (t <= 0) return 0;
  const a = d / 2, w = Math.sqrt(Math.max(1e-3, k - a * a));
  return 1 - Math.exp(-a * t) * (Math.cos(w * t) + a / w * Math.sin(w * t));
}
var S = (t, a) => clamp(spring(t - a));
var sceneAt = (t) => SCENES.find((s) => t >= s.start && t < s.end) || SCENES[7];
var ROUTE = [{ x: 380, y: 650 }, { x: 650, y: 650 }, { x: 790, y: 545 }, { x: 1110, y: 545 }, { x: 1270, y: 650 }, { x: 1540, y: 650 }];
var ROUTE_PATH = "M380 650H650L790 545H1110L1270 650H1540";
var lengths = ROUTE.slice(1).map((p, i) => Math.hypot(p.x - ROUTE[i].x, p.y - ROUTE[i].y));
var total = lengths.reduce((a, b) => a + b, 0);
function routePoint(p) {
  let distance = clamp(p) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const q = clamp(distance / lengths[i]);
      return { x: lerp(ROUTE[i].x, ROUTE[i + 1].x, q), y: lerp(ROUTE[i].y, ROUTE[i + 1].y, q) };
    }
    distance -= lengths[i];
  }
  return ROUTE[5];
}
var requestProgress = (t) => E(t, 14.8, 16.65);
var responseProgress = (t) => E(t, 18.85, 20.35);
var pageState = (t) => ({ parse: E(t, 22, 22.7), style: E(t, 22.65, 23.3), layout: E(t, 23.2, 23.8), paint: E(t, 23.65, 24.5), composite: E(t, 24.3, 25.1), image: E(t, 24.8, 26.1), ready: S(t, 25.4) });
function camera(t) {
  return { x: t < 3 ? -6 * E(t, 0.6, 2.7) : t >= 14 && t < 18 ? -18 * Math.sin(progress(t, 14, 18) * Math.PI) : t >= 18 && t < 22 ? 15 * Math.sin(progress(t, 18, 22) * Math.PI) : 0, y: 0, zoom: t < 3 ? 1 + 0.018 * E(t, 0.6, 2.6) : t >= 27 ? lerp(1.035, 1, E(t, 27, 28.2)) : 1, rotation: 0, depth: 1800, perspective: 1800, targetX: t < 3 ? 1170 : 960, targetY: 600 };
}

// src/ClickALink/lib/design.ts
var C = { navy: "#0B1220", mid: "#14243A", blue: "#4D8CFF", cyan: "#5DE1E6", amber: "#FFB45C", white: "#F3F7FB", slate: "#8FA3B8" };
var mono = "'IBM Plex Mono',monospace";
var esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var tx = (x, y, s, size = 32, fill = C.white, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
var mt = (x, y, s, size = 22, fill = C.slate, extra = "") => tx(x, y, s, size, fill, `font-family="${mono}" font-weight="500" letter-spacing="1" ${extra}`);
var rect = (x, y, w, h, fill = C.mid, r = 16, extra = "") => `<rect x="${x}" y="${y}" width="${Math.max(0, w)}" height="${Math.max(0, h)}" rx="${r}" fill="${fill}" ${extra}/>`;
var dot = (x, y, r, fill = C.cyan, extra = "") => `<circle cx="${x}" cy="${y}" r="${Math.max(0, r)}" fill="${fill}" ${extra}/>`;
var line = (x1, y1, x2, y2, fill = C.slate, width = 2, extra = "") => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${fill}" stroke-width="${width}" ${extra}/>`;
function panel(x, y, w, h, content, accent = C.slate) {
  return rect(x + 8, y + 14, w, h, "#060B13", 18, 'opacity=".65"') + rect(x, y, w, h, C.mid, 16, `stroke="${accent}" stroke-opacity=".55" stroke-width="1.5"`) + content;
}
var appear = (content, t, a, dy = 30) => `<g opacity="${S(t, a)}" transform="translate(0 ${(1 - S(t, a)) * dy})">${content}</g>`;
var badge = (x, y, label, fill = C.cyan) => `${rect(x, y - 30, label.length * 14 + 32, 44, fill, 5)}${mt(x + 16, y, label, 20, C.navy)}`;
function heading(t, n, title, sub) {
  return `${appear(mt(104, 192, "0" + n + " / THE INVISIBLE JOURNEY", 21, C.cyan) + tx(100, 288, title, 76, C.white, 'letter-spacing="-3"'), t, 0, 22)}${appear(tx(104, 342, sub, 27, C.slate, 'font-weight="500"'), t, 0.12, 18)}`;
}
function browser(x, y, w, h, inside, url = "example.com/page") {
  return `<g>${panel(x, y, w, h, "", C.blue)}${rect(x, y, w, 57, "#1B2D45", 16)}${rect(x, y + 28, w, 29, "#1B2D45", 0)}${[C.slate, C.slate, C.slate].map((c, i) => dot(x + 26 + i * 22, y + 28, 5, c, 'opacity=".55"')).join("")}${rect(x + 115, y + 13, w - 145, 32, C.navy, 7)}${mt(x + 134, y + 36, url, 17, C.slate)}${inside}</g>`;
}
function endpoint(x, y, type, label) {
  const icon = type === "browser" ? `${rect(x - 65, y - 50, 130, 90, C.mid, 8, `stroke="${C.blue}" stroke-width="2"`)}${line(x - 65, y - 25, x + 65, y - 25, C.blue, 2)}${dot(x - 51, y - 37, 3, C.blue)}${line(x - 28, y + 52, x + 28, y + 52, C.slate, 3)}${line(x, y + 41, x, y + 51, C.slate, 3)}` : `${rect(x - 58, y - 69, 116, 138, C.mid, 9, `stroke="${C.slate}" stroke-width="2"`)}${[-39, 0, 39].map((z) => `${rect(x - 42, y + z - 13, 84, 26, C.navy, 4)}${dot(x + 27, y + z, 4, C.cyan)}${line(x - 28, y + z, x + 3, y + z, C.slate, 2)}`).join("")}`;
  return icon + mt(x, y + 98, label, 21, C.white, 'text-anchor="middle"');
}
function route(t, secure = true) {
  return `<path d="${ROUTE_PATH}" fill="none" stroke="${C.mid}" stroke-width="18" stroke-linejoin="round"/><path d="${ROUTE_PATH}" fill="none" stroke="${secure ? C.cyan : C.blue}" stroke-width="3" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - E(t, 0, 0.8)}"/>${[650, 790, 1110, 1270].map((x, i) => dot(x, i === 0 || i === 3 ? 650 : 545, 5, C.slate)).join("")}`;
}
function message(x, y, label, color = C.blue, scale = 1) {
  const w = Math.max(164, label.length * 23 + 48);
  return `<g transform="translate(${x} ${y}) scale(${scale})">${rect(-w / 2, -35, w, 70, C.navy, 10, `stroke="${color}" stroke-width="2.5"`)}${mt(0, 9, label, 28, color, 'text-anchor="middle"')}</g>`;
}
function lock(x, y, p) {
  return `<g transform="translate(${x} ${y}) scale(${Math.max(1e-3, p)})">${rect(-22, -4, 44, 36, C.cyan, 7)}<path d="M-13-4V-17a13 13 0 0126 0V-4" fill="none" stroke="${C.cyan}" stroke-width="5"/>${dot(0, 10, 3, C.navy)}</g>`;
}
function chrome(t, content) {
  const labels = ["CLICK", "URL", "DNS", "CONNECT", "REQUEST", "RESPONSE", "RENDER"];
  const p = progress(t, 0, 27);
  return `${mt(104, 78, "WHAT HAPPENS WHEN YOU CLICK A LINK?", 22, C.white)}${mt(1816, 78, "A WEB FIELD GUIDE / 001", 20, C.slate, 'text-anchor="end"')}${line(104, 107, 1816, 107, C.slate, 1, 'opacity=".25"')}${content}${line(104, 956, 1816, 956, C.slate, 1, 'opacity=".25"')}${mt(104, 1010, "SIMPLIFIED HTTPS NAVIGATION", 20, C.slate)}${labels.map((s, i) => mt(850 + i * 143, 1010, s, 17, p * 7 > i ? C.cyan : C.slate, 'text-anchor="middle"')).join("")}`;
}
function networkTexture() {
  return `<g opacity=".28">${Array.from({ length: 14 }, (_, i) => line(100 + i * 132, 135, 100 + i * 132, 930, C.mid, 1)).join("")}${Array.from({ length: 7 }, (_, i) => line(85, 150 + i * 128, 1835, 150 + i * 128, C.mid, 1)).join("")}</g>`;
}

// src/ClickALink/scenes/Click.ts
function clickScene(t) {
  const click = E(t, 0.7, 0.79), ripple = E(t, 0.72, 1.25), out = E(t, 2.45, 3);
  const px = lerp(1310, 1120, E(t, 0.08, 0.65)), py = lerp(790, 615, E(t, 0.08, 0.65));
  const ui = browser(745, 260, 990, 570, `${mt(807, 402, "THE OPEN WEB", 20, C.cyan)}${tx(801, 483, "A new perspective.", 51)}${tx(805, 536, "One link is all it takes.", 25, C.slate, 'font-weight="500"')}${line(805, 640, 1429, 640, C.cyan, 2)}${tx(805, 614, "EXPLORE THE WEB \u2192", 38, C.cyan)}${line(806, 735, 1170, 735, C.slate, 10, 'opacity=".2"')}${line(806, 766, 1365, 766, C.slate, 10, 'opacity=".12"')}`, "https://example.com");
  const title = appear(tx(103, 361, "ONE", 112, C.white, 'letter-spacing="-5"') + tx(103, 472, "CLICK.", 112, C.white, 'letter-spacing="-5"'), t, 0.8) + appear(tx(109, 578, "A WHOLE", 48, C.cyan, 'letter-spacing="-2"') + tx(109, 634, "JOURNEY.", 48, C.cyan, 'letter-spacing="-2"'), t, 1.23);
  return `<g opacity="${1 - out}">${mt(105, 192, "01 / FOLLOW THE REQUEST", 21, C.cyan)}${ui}${title}<g transform="translate(${px} ${py}) scale(${1 - click * 0.13})"><path d="M0 0L0 54 14 40 26 64 38 58 25 35 46 33Z" fill="${C.white}" stroke="${C.navy}" stroke-width="3"/></g>${dot(1120, 615, lerp(8, 105, ripple), "none", `stroke="${C.cyan}" stroke-width="${3 * (1 - ripple)}" opacity="${click * (1 - ripple)}"`)}</g>${line(lerp(805, 350, out), lerp(640, 600, out), lerp(1429, 1570, out), lerp(640, 600, out), C.cyan, 3, `opacity="${S(t, 2.35)}"`)}`;
}

// src/ClickALink/scenes/Url.ts
function urlScene(t) {
  const split = E(t, 0.2, 1), focus = E(t, 2.1, 3);
  const a = lerp(365, 270, split), b = lerp(667, 710, split), c = lerp(1140, 1320, split);
  return `${heading(t, 2, "THE URL", "An address with distinct parts.")}${line(350, 600, 1570, 600, C.cyan, 3, `opacity="${1 - E(t, 0, 0.45)}"`)}<g opacity="${1 - focus}">${rect(a - 25, 489, 330, 120, C.mid, 12)}${rect(c - 25, 489, 280, 120, C.mid, 12)}${tx(a, 567, "https://", 61, C.blue, `font-family="'IBM Plex Mono'"`)}${tx(c, 567, "/page", 61, C.white, `font-family="'IBM Plex Mono'"`)}</g><g transform="translate(${lerp(0, 960 - (b + 180), focus)} ${lerp(0, 60, focus)})">${rect(b - 30, 489, 480, 120, C.mid, 12, `stroke="${C.cyan}" stroke-width="2"`)}${tx(b, 567, "example.com", 61, C.cyan, `font-family="'IBM Plex Mono'"`)}</g><g opacity="${split * (1 - focus)}">${mt(a, 671, "PROTOCOL", 23, C.blue)}${mt(b, 671, "HOSTNAME", 23, C.cyan)}${mt(c, 671, "PATH", 23, C.white)}${mt(a, 718, "Secure HTTPS scheme", 19, C.slate)}${mt(b, 718, "Used for address lookup", 19, C.slate)}${mt(c, 718, "Resource on the service", 19, C.slate)}</g>${appear(badge(105, 858, "NEXT: RESOLVE THE HOSTNAME"), t, 1.6)}`;
}

// src/ClickALink/scenes/Dns.ts
function dnsScene(t) {
  const query = E(t, 0.55, 1.2), answer = E(t, 2.1, 2.75), exit = E(t, 3.4, 4), intro = E(t, 0, 0.5);
  const directory = panel(1130, 415, 500, 340, `${mt(1166, 466, "DNS RESOLVER", 24, C.white)}${line(1165, 494, 1594, 494, C.slate, 1, 'opacity=".3"')}${[0, 1, 2].map((i) => `${rect(1165, 522 + i * 64, 430, 48, i === 1 ? C.navy : C.mid, 6, i === 1 ? `stroke="${C.cyan}" stroke-width="1"` : "")}${line(1183, 546 + i * 64, 1200, 546 + i * 64, i === 1 ? C.cyan : C.slate, 3)}${mt(1220, 553 + i * 64, ["cached entries", "example.com", "upstream lookup"][i], 21, i === 1 ? C.cyan : C.slate)}`).join("")}`, C.cyan);
  return `${heading(t, 3, "DNS LOOKUP", "Finding an address. Not fetching a webpage.")}<g opacity="${1 - exit}">${appear(directory, t, 0.2)}${line(430, 570, 1129, 570, C.slate, 2, 'opacity=".4"')}${line(1129, 695, 430, 695, C.cyan, 2, `opacity="${S(t, 2.05)}" marker-end="url(#arrowCyan)"`)}<g opacity="${1 - E(t, 1.15, 1.4)}">${message(lerp(960, lerp(555, 1040, query), intro), lerp(609, 570, intro), "example.com", C.cyan, lerp(1, 0.75, query))}</g>${appear(message(lerp(1230, 630, answer), 695, "203.0.113.10", C.amber, 0.88), t, 2.05)}${mt(1135, 809, "CACHES / UPSTREAM RESOLVERS", 19, C.slate)}${mt(105, 881, "CACHE MAY SKIP THIS STEP", 22, C.slate)}</g><g opacity="${exit}">${dot(1540, 650, 20, C.amber)}${tx(1540, 787, "203.0.113.10", 26, C.amber, `text-anchor="middle" font-family="'IBM Plex Mono'"`)}</g>${appear(mt(105, 820, "example.com \u2192 203.0.113.10", 31, C.white), t, 2.55)}`;
}

// src/ClickALink/scenes/Connection.ts
function connectionScene(t) {
  const secure = S(t, 2.35);
  const pulses = [{ a: 0.45, b: 0.85, reverse: false, label: "SYN" }, { a: 0.85, b: 1.2, reverse: true, label: "SYN\xB7ACK" }, { a: 1.2, b: 1.5, reverse: false, label: "ACK" }, { a: 1.55, b: 1.95, reverse: false, label: "TLS" }, { a: 1.95, b: 2.3, reverse: true, label: "TLS" }];
  return `${heading(t, 4, "SECURE CONNECTION", "Establishing a protected channel.")}${route(t, t >= 2.35)}${endpoint(380, 650, "browser", "BROWSER")}${endpoint(1540, 650, "server", "DESTINATION")}${mt(1540, 800, "203.0.113.10", 22, C.amber, 'text-anchor="middle"')}${pulses.map((p) => {
    if (t < p.a || t > p.b + 0.08) return "";
    const q = routePoint(p.reverse ? 1 - E(t, p.a, p.b) : E(t, p.a, p.b));
    return message(q.x, q.y, p.label, p.label === "TLS" ? C.cyan : C.blue, 0.65);
  }).join("")}${appear(mt(770, 421, "HTTP/2 \xB7 TCP + TLS", 26, C.white), t, 0.22)}${lock(960, 495, secure)}${appear(badge(105, 865, "ENCRYPTED"), t, 2.35)}${mt(1816, 891, "CONNECTIONS MAY BE REUSED", 20, C.slate, 'text-anchor="end"')}${dot(1540, 650, 7, C.amber)}`;
}

// src/ClickALink/scenes/Request.ts
function requestScene(t) {
  const p = requestProgress(t + 14), q = routePoint(p), arrival = S(t, 2.65);
  return `${heading(t, 5, "THE HTTP REQUEST", "Ask the destination for a resource.")}${route(1, true)}${endpoint(380, 650, "browser", "BROWSER")}${endpoint(1540, 650, "server", "WEB SERVICE")}${lock(960, 495, 1)}<g opacity="${1 - E(t, 2.68, 2.95)}">${message(q.x, q.y, "GET /page", C.blue)}</g>${appear(badge(105, 865, "HTTP REQUEST"), t, 0.1)}${mt(1816, 890, "SIMPLIFIED HTTP/2 REQUEST", 20, C.slate, 'text-anchor="end"')}${appear(mt(1540, 830, "REQUEST RECEIVED", 22, C.cyan, 'text-anchor="middle"'), t, 2.65)}${rect(1484, 582, 112 * arrival, 4, C.amber, 2)}${appear(mt(105, 410, "Browser \u2192 destination service", 25, C.slate), t, 0.35)}${appear(mt(105, 455, "A CDN or proxy may be the endpoint.", 21, C.slate), t, 0.6)}`;
}

// src/ClickALink/scenes/Response.ts
function responseScene(t) {
  const p = responseProgress(t + 18), q = routePoint(1 - p), branch = E(t, 2.3, 3.6);
  return `${heading(t, 6, "THE HTTP RESPONSE", "The service returns HTML for this page.")}${route(1, true)}${endpoint(380, 650, "browser", "BROWSER")}${endpoint(1540, 650, "server", "WEB SERVICE")}${lock(960, 495, 1)}${appear(mt(1540, 432, "200 OK", 35, C.amber, 'text-anchor="middle"'), t, 0.35)}<g opacity="${1 - E(t, 3.5, 4)}">${message(q.x, q.y, "HTML", C.amber)}</g>${appear(badge(105, 865, "RESPONSE: 200 OK"), t, 0.25)}${mt(1816, 891, "EXAMPLE SUCCESS RESPONSE", 20, C.slate, 'text-anchor="end"')}<g>${["CSS", "JS", "IMAGES"].map((s, i) => {
    const y = 405 + i * 100;
    const a = S(t, 2.5 + i * 0.35);
    return `<g opacity="${a}">${line(445, 600, 640, y, C.blue, 2, 'stroke-dasharray="7 9"')}${rect(650, y - 34, 170, 64, C.mid, 8, `stroke="${C.blue}" stroke-width="1"`)}${mt(735, y + 7, s, 24, C.white, 'text-anchor="middle"')}${line(835, y, 1200, y, C.slate, 1, 'opacity=".4"')}${rect(lerp(835, 1170, E(t, 2.5 + i * 0.25, 3.5 + i * 0.1)), y - 4, 30, 8, C.blue, 3, `opacity="${a}"`)}</g>`;
  }).join("")}${mt(960, 790, "HTML REFERENCES RESOURCES \u2192 SEPARATE REQUESTS", 23, C.slate, `text-anchor="middle" opacity="${branch}"`)}</g>`;
}

// src/ClickALink/scenes/Render.ts
function renderScene(t) {
  const p = pageState(t + 22), pull = E(t, 0.1, 1.7);
  const bx = lerp(1020, 860, pull), by = 400, bw = 845, bh = 445;
  const page = browser(bx, by, bw, bh, `${rect(bx + 32, by + 84, 780, 323, C.navy, 8)}<g opacity="${p.paint}">${mt(bx + 64, by + 137, "EXAMPLE / FIELD NOTES", 17, C.cyan)}${tx(bx + 61, by + 206, "A world connected.", 43)}${line(bx + 65, by + 247, bx + 401, by + 247, C.slate, 8, 'opacity=".45"')}${line(bx + 65, by + 272, bx + 363, by + 272, C.slate, 8, 'opacity=".25"')}${rect(bx + 65, by + 315, 205, 51, C.blue, 7)}${mt(bx + 86, by + 349, "EXPLORE \u2192", 20, C.white)}</g><g opacity="${p.image}">${rect(bx + 470, by + 120, 275, 245, C.mid, 10)}${dot(bx + 613, by + 221, 65, C.cyan)}${line(bx + 518, by + 308, bx + 699, by + 173, C.blue, 22)}${dot(bx + 555, by + 191, 24, C.amber)}</g><g opacity="${p.layout * (1 - p.paint)}" fill="none" stroke="${C.blue}" stroke-width="2">${rect(bx + 65, by + 160, 370, 60, "none", 3)}${rect(bx + 65, by + 238, 340, 58, "none", 3)}${rect(bx + 470, by + 120, 275, 245, "none", 3)}</g>`);
  const nodes = [{ x: 290, y: 475, s: "HTML" }, { x: 220, y: 600, s: "HEAD" }, { x: 480, y: 600, s: "BODY" }, { x: 390, y: 745, s: "H1" }, { x: 610, y: 745, s: "IMG" }];
  const dom = `<g opacity="${1 - E(t, 0, 0.35)}">${message(lerp(380, 290, E(t, 0, 0.4)), lerp(650, 475, E(t, 0, 0.4)), "HTML", C.amber, lerp(1, 0.72, E(t, 0, 0.4)))}</g>${line(290, 495, 220, 575, C.slate, 2)}${line(290, 495, 480, 575, C.slate, 2)}${line(480, 622, 390, 720, C.slate, 2)}${line(480, 622, 610, 720, C.slate, 2)}${nodes.map((n, i) => `<g opacity="${S(t, i * 0.1)}">${rect(n.x - 60, n.y - 25, 120, 50, p.style > 0.5 ? C.mid : C.navy, 6, `stroke="${p.style > 0.5 ? C.cyan : C.slate}" stroke-width="2"`)}${mt(n.x, n.y + 7, n.s, 22, C.white, 'text-anchor="middle"')}</g>`).join("")}`;
  return `${heading(t, 7, "BROWSER RENDERING", t < 3.5 ? "Build structure. Calculate appearance. Draw the page." : "YOUR PAGE IS READY.")}<g opacity="${1 - E(t, 3.5, 4.3)}">${dom}${line(680, 600, 810, 600, C.cyan, 2, 'marker-end="url(#arrowCyan)"')}</g>${page}${["PARSE", "STYLE", "LAYOUT", "PAINT", "COMPOSITE"].map((s, i) => {
    const a = [0, 0.65, 1.2, 1.8, 2.45][i];
    return `${dot(175 + i * 335, 892, 5, t >= a ? C.amber : C.slate)}${mt(198 + i * 335, 900, s, 23, t >= a ? C.white : C.slate)}`;
  }).join("")}${appear(mt(bx, 372, "CONTENT CAN APPEAR WHILE RESOURCES LOAD", 20, C.cyan), t, 1.9)}`;
}

// src/ClickALink/scenes/Finale.ts
function finaleScene(t) {
  const flatten = E(t, 0.05, 0.75), title = E(t, 0.4, 1);
  const labels = ["CLICK", "URL", "DNS", "TLS", "HTTP", "HTML", "PAGE"];
  const net = labels.map((s, i) => {
    const x = 220 + i * 245, y = lerp(560 + (i % 2 ? 90 : -40), 580, flatten);
    return `${i < 6 ? line(x, y, x + 245, lerp(560 + ((i + 1) % 2 ? 90 : -40), 580, flatten), C.cyan, 2) : ""}${rect(x - 59, y - 26, 118, 52, C.mid, 7, `opacity="${1 - flatten}"`)}${mt(x, y + 7, s, 22, C.white, `text-anchor="middle" opacity="${1 - flatten}"`)}${dot(x, y, 4, C.cyan)}`;
  }).join("");
  const shrink = E(t, 0, 0.5);
  const page = browser(860, 400, 845, 445, `${rect(892, 484, 780, 323, C.navy, 8)}${mt(924, 537, "EXAMPLE / FIELD NOTES", 17, C.cyan)}${tx(921, 606, "A world connected.", 43)}${line(925, 647, 1261, 647, C.slate, 8, 'opacity=".45"')}${line(925, 672, 1223, 672, C.slate, 8, 'opacity=".25"')}${rect(925, 715, 205, 51, C.blue, 7)}${mt(946, 749, "EXPLORE \u2192", 20, C.white)}${rect(1330, 520, 275, 245, C.mid, 10)}${dot(1473, 621, 65, C.cyan)}${line(1378, 708, 1559, 573, C.blue, 22)}${dot(1415, 591, 24, C.amber)}`);
  return `<g opacity="${1 - shrink}" transform="translate(${960 * (1 - lerp(1, 0.1, shrink))} ${580 * (1 - lerp(1, 0.1, shrink))}) scale(${lerp(1, 0.1, shrink)})">${page}</g><g opacity="${(1 - title) * shrink}">${net}</g>${line(lerp(220, 104, title), 580, lerp(1690, 1816, title), 580, C.cyan, 2, `opacity="${1 - E(t, 0.6, 1.1)}"`)}${appear(mt(108, 297, "ONE CLICK. A WHOLE JOURNEY.", 24, C.cyan), t, 0.25)}${appear(tx(98, 459, "ALL THAT.", 124, C.white, 'letter-spacing="-6"'), t, 0.55, 55)}${appear(tx(98, 594, "FROM ONE CLICK.", 124, C.white, 'letter-spacing="-6"'), t, 0.68, 55)}${appear(line(108, 670, 1812, 670, C.slate, 1, 'opacity=".35"') + mt(108, 739, "THE WEB, EXPLAINED THROUGH MOTION.", 29, C.cyan), t, 0.95)}${appear(mt(108, 866, "DNS \u2192 CONNECTION \u2192 REQUEST \u2192 RESPONSE \u2192 RENDER", 23, C.slate), t, 1.05)}`;
}

// src/ClickALink/lib/film.ts
var scenes = [clickScene, urlScene, dnsScene, connectionScene, requestScene, responseScene, renderScene, finaleScene];
function svgAt(time) {
  const t = clamp(time, 0, 29.999999), scene = sceneAt(t), index = [0, 3, 6, 10, 14, 18, 22, 27].indexOf(scene.start);
  const local = t - scene.start, cam = camera(t);
  let body = scenes[index](local);
  const boundaries = [3, 6, 10, 14, 18, 22, 27];
  let transition = "";
  for (const at of boundaries) {
    if (t >= at - 0.18 && t < at + 0.18) {
      const q = E(t, at - 0.18, at + 0.18);
      const width = 1920 * Math.sin(q * Math.PI);
      transition = `<rect x="${960 - width / 2}" y="${lerp(590, 510, q)}" width="${width}" height="${4 + 46 * Math.sin(q * Math.PI)}" rx="2" fill="${C.cyan}" opacity="${0.9 * Math.sin(q * Math.PI)}"/>`;
    }
  }
  body = `<g transform="translate(${cam.x} ${cam.y}) translate(960 540) scale(${cam.zoom}) rotate(${cam.rotation}) translate(-960 -540)">${body}</g>`;
  body = chrome(t, body);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" font-family="'Space Grotesk',sans-serif" font-weight="700" style="display:block;background:${C.navy}"><defs><marker id="arrowCyan" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10Z" fill="${C.cyan}"/></marker></defs><rect width="1920" height="1080" fill="${C.navy}"/>${networkTexture()}${line(104, 934, 1816, 934, C.blue, 1, 'opacity=".07"')}${body}${transition}</svg>`;
}
export {
  svgAt
};
