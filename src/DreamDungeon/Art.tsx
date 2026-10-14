import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { measureText, snapPixel } from "./motion";

export const C = {
  ink: "#111326", night: "#19182e", deep: "#252345", violet: "#8061b7",
  lavender: "#c3a2ef", pink: "#f3b2d0", cream: "#fff1cf", mint: "#9fe1c5",
  blue: "#64b7e7", gold: "#f4cf83", wood: "#75515c", darkWood: "#453443",
};

export const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const progress = (frame: number, fps: number, start: number, end: number) =>
  interpolate(frame, [start * fps, end * fps], [0, 1], ease);

export const Rect = ({ x, y, w, h, fill, opacity = 1 }: { x: number; y: number; w: number; h: number; fill: string; opacity?: number }) =>
  <rect x={Math.round(x)} y={Math.round(y)} width={w} height={h} fill={fill} opacity={opacity} />;

const glyphs: Record<string, string> = {
  A: "01110/10001/10001/11111/10001/10001/10001", B: "11110/10001/10001/11110/10001/10001/11110",
  C: "01111/10000/10000/10000/10000/10000/01111", D: "11110/10001/10001/10001/10001/10001/11110",
  E: "11111/10000/10000/11110/10000/10000/11111", F: "11111/10000/10000/11110/10000/10000/10000",
  G: "01111/10000/10000/10111/10001/10001/01111", H: "10001/10001/10001/11111/10001/10001/10001",
  I: "111/010/010/010/010/010/111", J: "00111/00010/00010/00010/10010/10010/01100",
  K: "10001/10010/10100/11000/10100/10010/10001", L: "10000/10000/10000/10000/10000/10000/11111",
  M: "10001/11011/10101/10101/10001/10001/10001", N: "10001/11001/10101/10011/10001/10001/10001",
  O: "01110/10001/10001/10001/10001/10001/01110", P: "11110/10001/10001/11110/10000/10000/10000",
  Q: "01110/10001/10001/10001/10101/10010/01101", R: "11110/10001/10001/11110/10100/10010/10001",
  S: "01111/10000/10000/01110/00001/00001/11110", T: "11111/00100/00100/00100/00100/00100/00100",
  U: "10001/10001/10001/10001/10001/10001/01110", V: "10001/10001/10001/10001/10001/01010/00100",
  W: "10001/10001/10001/10101/10101/10101/01010", X: "10001/10001/01010/00100/01010/10001/10001",
  Y: "10001/10001/01010/00100/00100/00100/00100", Z: "11111/00001/00010/00100/01000/10000/11111",
  "0": "01110/10001/10011/10101/11001/10001/01110", "1": "010/110/010/010/010/010/111",
  "2": "01110/10001/00001/00010/00100/01000/11111", "3": "11110/00001/00001/01110/00001/00001/11110",
  "4": "10010/10010/10010/11111/00010/00010/00010", "5": "11111/10000/10000/11110/00001/00001/11110",
  "6": "01110/10000/10000/11110/10001/10001/01110", "7": "11111/00001/00010/00100/01000/01000/01000",
  "8": "01110/10001/10001/01110/10001/10001/01110", "9": "01110/10001/10001/01111/00001/00001/01110",
  "+": "000/010/010/111/010/010/000", "!": "1/1/1/1/1/0/1", "?": "11110/00001/00001/00110/00100/00000/00100",
  ":": "0/1/1/0/1/1/0", "-": "000/000/000/111/000/000/000", ".": "0/0/0/0/0/0/1", ",": "0/0/0/0/0/1/1", " ": "000/000/000/000/000/000/000",
};

export const PixelText = ({ text, x = 135, y, size = 1, color = C.cream, align = "center" }: {
  text: string; x?: number; y: number; size?: number; color?: string; align?: "center" | "left";
}) => {
  const chars = text.toUpperCase().split("");
  const width = measureText(text, size);
  let offset = align === "center" ? x - width / 2 : x;
  return <g aria-label={text}>{chars.map((char, i) => {
    const rows = (glyphs[char] ?? glyphs[" "]).split("/");
    const left = offset;
    offset += (rows[0].length + 1) * size;
    return <g key={i}>{rows.map((row, r) => row.split("").map((bit, col) => bit === "1" ?
      <rect key={`${r}-${col}`} x={left + col * size} y={y + r * size} width={size} height={size} fill={color} /> : null))}</g>;
  })}</g>;
};

export const Star = ({ x, y, color = C.gold, size = 1 }: { x: number; y: number; color?: string; size?: number }) =>
  <g transform={`translate(${Math.round(x)} ${Math.round(y)}) scale(${size})`}>
    <Rect x={-1} y={-4} w={2} h={8} fill={color} /><Rect x={-4} y={-1} w={8} h={2} fill={color} />
    <Rect x={-1} y={-1} w={2} h={2} fill={C.cream} />
  </g>;



export const Portal = ({ x, y, amount = 1 }: { x: number; y: number; amount?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pixels: React.ReactNode[] = [];
  for (let a = -17; a <= 17; a++) for (let b = -12; b <= 12; b++) {
    const d = a * a / 289 + b * b / 144;
    if (d < 1.05) pixels.push(<rect key={`${a}-${b}`} x={a * 2} y={b * 2} width={2} height={2}
      fill={d > 0.83 ? C.lavender : d > 0.62 ? "#7554af" : ((Math.floor(Math.atan2(b, a) * 6 + t * 8 + d * 14)) % 7 === 0 ? "#9477cb" : "#382a68")} />);
  }
  return <g opacity={amount} transform={`translate(${x} ${y}) scale(${Math.max(0.01, amount)})`}>
    <Rect x={-38} y={-28} w={76} h={56} fill={C.violet} opacity={0.09} />
    <g opacity={0.88 + Math.sin(t * 3) * 0.12}>{pixels}</g>
    {[0, 1, 2, 3, 4].map((i) => <Star key={i} x={Math.cos(t * 0.8 + i * 1.26) * 39} y={Math.sin(t * 0.8 + i * 1.26) * 28} size={0.5} color={i % 2 ? C.lavender : C.gold} />)}
  </g>;
};

export const Cloud = ({ x, y, scale = 1, color = "#50436c" }: { x: number; y: number; scale?: number; color?: string }) =>
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={0.6}>
    <path d="M0 10h8V5h8V0h13v5h7v-2h11v5h10v7h-4v5H6v-4H0z" fill={color} />
    <path d="M7 15h46v5H7z" fill="#342e55" />
    <Rect x={17} y={3} w={10} h={2} fill="#a390bb" opacity={0.3} />
  </g>;

export const Tree = ({ x, y, scale = 1, pink = false }: { x: number; y: number; scale?: number; pink?: boolean }) =>
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <Rect x={-3} y={10} w={7} h={21} fill="#54425b" /><Rect x={-1} y={12} w={2} h={18} fill="#886477" />
    <path d="M-8 -14H6v3h8v6h5v12h-4v6h-8v4H-8v-4h-8V7h-4V-5h5v-6h7z" fill={pink ? "#624a84" : "#354969"} />
    <path d="M-7 -12H5v3h7v5h4v9h-4v5H5v4H-6v-4h-7V4h-3v-7h4v-5h5z" fill={pink ? "#a17fb6" : "#577c89"} />
    <Rect x={-5} y={-9} w={9} h={3} fill={pink ? "#cfaccf" : "#88b5b0"} />
    <Rect x={5} y={-2} w={7} h={3} fill={pink ? "#bd9ac9" : "#739c9f"} />
    <Rect x={-10} y={4} w={4} h={3} fill={pink ? "#cfaccf" : "#88b5b0"} />
  </g>;

export const Island = ({ x, y, scale = 1, ruins = false }: { x: number; y: number; scale?: number; ruins?: boolean }) =>
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-69 0h138v13H59v13H44v17H28v14H12v13H-9V55h-17V43h-17V29h-16V16h-10z" fill="#302e4f" />
    <path d="M-57 8H58v10H45v13H25v16H8v10H-6V43h-16V29h-20V18h-15z" fill="#4c4569" />
    <Rect x={-27} y={15} w={7} h={16} fill="#79708e" /><Rect x={12} y={21} w={5} h={18} fill="#656080" />
    <Rect x={36} y={9} w={5} h={15} fill="#79708e" />
    <path d="M-58 -31H49v6h16v8h10V2H66v9H50v6H-49v-6H-65V3h-9v-20h9v-8h7z" fill="#476e74" />
    <path d="M-55 -28H46v6h16v8h9v12H60v9H45v6H-46V7h-15V-2h-9v-12h9v-8h6z" fill="#7baa9b" />
    <path d="M-30 -17h56v5h16V5H24v8h-50V5h-17v-17h13z" fill="#b0baa2" />
    <Rect x={-18} y={-10} w={14} h={4} fill="#d0c9a9" /><Rect x={11} y={3} w={9} h={3} fill="#d0c9a9" />
    {Array.from({ length: 16 }, (_, i) => <g key={i}><Rect x={-58 + (i * 19 % 116)} y={-18 + (i * 7 % 27)} w={2} h={4} fill="#487e75" /><Rect x={-57 + (i * 19 % 116)} y={-19 + (i * 7 % 27)} w={2} h={2} fill={i % 3 ? C.mint : C.pink} /></g>)}
    {[-48, -24, 30, 51].map((stone, i) => <g key={stone}>
      <Rect x={stone} y={-5 + i % 2 * 10} w={7} h={4} fill="#607e83" />
      <Rect x={stone + 1} y={-6 + i % 2 * 10} w={5} h={2} fill="#a5c4b2" />
    </g>)}
    {[-30, 0, 26].map((crack, i) => <path key={crack} d={`M${crack} ${24 + i * 6}v8h-3v6`} fill="none" stroke="#302e4f" strokeWidth={1} />)}
    {ruins ? <>
      <Rect x={-40} y={-79} w={13} h={49} fill="#74768a" /><Rect x={-37} y={-79} w={4} h={45} fill="#c0bbbe" />
      <Rect x={24} y={-79} w={13} h={49} fill="#74768a" /><Rect x={27} y={-79} w={4} h={45} fill="#c0bbbe" />
      <Rect x={-43} y={-83} w={83} h={11} fill="#a2a0ad" /><Rect x={-40} y={-83} w={77} h={3} fill="#d5c6ca" />
      <Rect x={-44} y={-33} w={20} h={6} fill="#c0bbbe" /><Rect x={21} y={-33} w={20} h={6} fill="#c0bbbe" />
      <Rect x={-27} y={-75} w={51} h={3} fill="#554865" />
      <Star x={-2} y={-60} color={C.lavender} />
    </> : null}
  </g>;

export const DreamWorld = ({ cameraX = 0, cameraY = 0 }: { cameraX?: number; cameraY?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return <>
    <Rect x={0} y={0} w={270} h={480} fill={C.night} />
    <Rect x={0} y={96} w={270} h={384} fill="#25213c" />
    <g transform={`translate(${snapPixel(-cameraX * 0.15)} ${snapPixel(-cameraY * 0.15)})`}>
    {Array.from({ length: 70 }, (_, i) => <rect key={i} x={(i * 73 + 19) % 264} y={94 + (i * 47 % 274)} width={i % 7 === 0 ? 2 : 1} height={i % 7 === 0 ? 2 : 1} fill={i % 3 ? C.lavender : C.gold} opacity={0.3 + (Math.sin(t * 2 + i) + 1) * 0.25} />)}
    </g>
    <g transform={`translate(${snapPixel(-cameraX * 0.3)} ${snapPixel(-cameraY * 0.3)})`}>
    <Cloud x={-34 + Math.round(Math.sin(t * 0.3) * 7)} y={147} scale={1.8} />
    <Cloud x={173 - Math.round(Math.sin(t * 0.3) * 7)} y={245} scale={1.7} />
    <Cloud x={-22} y={332} scale={2.3} color="#7d618e" />
    <Cloud x={196} y={347} scale={2} color="#7d618e" />
    <Island x={36} y={181 + Math.round(Math.sin(t) * 2)} scale={0.42} ruins />
    <Island x={237} y={136 - Math.round(Math.sin(t) * 2)} scale={0.37} />
    <Tree x={240} y={124} scale={0.48} pink />
    </g>
    <g transform={`translate(${snapPixel(-cameraX * 0.45)} ${snapPixel(-cameraY * 0.45)})`}>
      <Cloud x={-37 + Math.sin(t * 0.22) * 10} y={409} scale={3} color="#67577d" />
      <Cloud x={167 - Math.sin(t * 0.2) * 12} y={436} scale={2.7} color="#67577d" />
      <Island x={21} y={449 + Math.sin(t * 0.7) * 3} scale={0.65} />
      <Island x={253} y={414 + Math.sin(t * 0.7 + 1) * 3} scale={0.45} ruins />
    </g>
  </>;
};

export const Brain = ({ x = 135, y = 197, scale = 1, active = false }: { x?: number; y?: number; scale?: number; active?: boolean }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <g transform={`translate(${x} ${Math.round(y + Math.sin(f / fps * 1.5) * 2)}) scale(${scale})`}>
    <Rect x={-43} y={-32} w={86} h={63} fill={C.violet} opacity={0.08} />
    <path d="M-31 -22h9v-7h16v-4H9v4h15v6h9v8h6V5h-5v10h-9v7H9v9H0V19h-16v-4h-12V8h-9V-9h6z" fill="#614e7e" />
    <path d="M-28 -19h9v-7h14v-4H8v4h14v6h8v8h6V3h-5v10h-9v5H7v10H2V16h-18v-5h-10V5h-8V-7h6z" fill="#e7a9c8" />
    <path d="M-22 -17h7v-6h10v-4H7v3h13v6h8v6h5v5H-29v-5h7z" fill="#f7c9dd" />
    <path d="M-18 -23v9h-7v10h9v11m7-32v11h8v12h-8v11m15-38v12h7v10h-7v11m17-29v8h-5v9h9v8" fill="none" stroke="#9b6a9e" strokeWidth={2} />
    <Rect x={-13} y={-7} w={6} h={2} fill="#f7dcea" /><Rect x={13} y={-16} w={6} h={2} fill="#f7dcea" />
    {active ? Array.from({ length: 7 }, (_, i) => <g key={i} opacity={0.35 + (Math.sin(f / fps * 5 - i) + 1) * 0.3}>
      <Star x={-25 + i * 8} y={-12 + (i * 11 % 22)} color={i % 2 ? C.mint : C.gold} size={0.65} />
    </g>) : null}
  </g>;
};

export const Memory = ({ x, y, type = "heart", scale = 1 }: { x: number; y: number; type?: "heart" | "home" | "book" | "moon"; scale?: number }) =>
  <g transform={`translate(${Math.round(x)} ${Math.round(y)}) scale(${scale})`}>
    <Rect x={-13} y={-13} w={26} h={26} fill="#352c50" /><Rect x={-12} y={-12} w={24} h={24} fill="#796391" />
    <Rect x={-10} y={-10} w={20} h={20} fill="#3f3858" />
    {type === "heart" ? <path d="M-7 -5h5v2h4v-2h5v3h2v6H6v3H3v3h-6V7h-3V4h-3v-6h2z" fill={C.pink} /> : null}
    {type === "home" ? <><path d="M-9 -1v-3h3v-3h3v-3h6v3h3v3h3v3z" fill={C.gold} /><Rect x={-7} y={-1} w={14} h={10} fill="#a78381" /><Rect x={-1} y={3} w={4} h={6} fill={C.ink} /><Rect x={-5} y={2} w={3} h={3} fill={C.mint} /></> : null}
    {type === "book" ? <><Rect x={-8} y={-6} w={16} h={13} fill={C.blue} /><Rect x={-7} y={-5} w={6} h={10} fill={C.cream} /><Rect x={1} y={-5} w={6} h={10} fill="#dfc6b6" /><Rect x={-5} y={-2} w={3} h={1} fill={C.violet} /><Rect x={2} y={1} w={3} h={1} fill={C.violet} /></> : null}
    {type === "moon" ? <><path d="M-3 -9h6v3H0v4h-3v5h3v3h5v3h-8V6h-4V2h-2v-6h3v-3h3z" fill={C.gold} /><Star x={6} y={-5} size={0.5} /></> : null}
  </g>;

export const Crystal = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) =>
  <g transform={`translate(${Math.round(x)} ${Math.round(y)}) scale(${scale})`}>
    <Rect x={-14} y={-17} w={28} h={34} fill={C.mint} opacity={0.06} />
    <Rect x={-10} y={-13} w={20} h={26} fill={C.mint} opacity={0.12} />
    <path d="M-2 -12h4v3h4v4h3v10H5v5H2v4h-4v-4h-3V5h-4V-5h3v-4h4z" fill="#579da5" />
    <path d="M-2 -10h4v4h3v10H2v7h-4V4h-4V-5h4z" fill={C.mint} />
    <Rect x={-2} y={-7} w={2} h={10} fill="#e4fff0" /><Rect x={2} y={2} w={2} h={5} fill="#70c6bb" />
  </g>;

export const Panel = ({ y, title, subtitle, color = C.lavender }: { y: number; title: string; subtitle?: string; color?: string }) =>
  <g><Rect x={22} y={y + 3} w={208} h={subtitle ? 40 : 26} fill={C.ink} opacity={0.5} />
    <Rect x={20} y={y} w={210} h={subtitle ? 40 : 26} fill={color} />
    <Rect x={21} y={y + 1} w={208} h={subtitle ? 38 : 24} fill="#252139" />
    <Rect x={23} y={y + 3} w={204} h={1} fill={color} opacity={0.35} />
    <PixelText text={title} x={125} y={y + 8} size={Math.min(1.6, 192 / measureText(title, 1))} color={color} />
    {subtitle ? <PixelText text={subtitle} x={125} y={y + 25} size={Math.min(1.6, 192 / measureText(subtitle, 1))} color={C.cream} /> : null}
  </g>;

export const SceneCanvas = ({ children }: { children: React.ReactNode }) =>
  <AbsoluteFill style={{ background: C.ink }}>
    <svg width="100%" height="100%" viewBox="0 0 270 480" shapeRendering="crispEdges" style={{ position: "absolute", imageRendering: "pixelated" }}>
      {children}
    </svg>
  </AbsoluteFill>;
