import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, PixelText, Rect, ease } from "./Art";
import { Guardian, Hero } from "./Sprites";
import { snapPixel, visibleCharacters, wrapWords } from "./motion";

type DialogueProps = { text: string; start: number; end: number; speaker?: string; page?: string; revealedCharacters?: number; speaking?: boolean };
export const Dialogue = ({ text, start, end, speaker = "PENJAGA MIMPI", page = "01", revealedCharacters, speaking }: DialogueProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start * fps;
  const lines = wrapWords(text.toUpperCase(), 196, 1.6);
  const count = revealedCharacters ?? visibleCharacters(local - 0.25 * fps, fps, text.length);
  const talking = speaking ?? count < text.length;
  if (local < 0 || frame >= end * fps) return null;
  let consumed = 0;
  return <g opacity={interpolate(local, [0, 0.3 * fps], [0, 1], ease)} transform={`translate(0 ${snapPixel(interpolate(local, [0, 0.45 * fps], [7, 0], { ...ease, easing: Easing.out(Easing.cubic) }))})`}>
    <Rect x={21} y={314} w={210} h={92} fill={C.ink} opacity={0.45} />
    <Rect x={20} y={310} w={210} h={92} fill={C.lavender} />
    <Rect x={21} y={311} w={208} h={90} fill="#252139" />
    <Rect x={23} y={313} w={204} h={1} fill="#7d659e" />
    <Rect x={26} y={318} w={22} h={20} fill="#423756" />
    <svg x={27} y={319} width={20} height={18} viewBox="-15 -52 32 32" shapeRendering="crispEdges">
      {speaker === "PETUALANG" ? <Hero x={0} y={0} scale={1} portrait state={talking ? "talk" : "idle"} /> : speaker === "NARATOR" ? <><rect x={-13} y={-48} width={28} height={26} fill={C.deep} /><path d="M0 -46v20m-10 -10h20m-16 -6l12 12m0 -12l-12 12" stroke={C.gold} strokeWidth={2} /></> : <Guardian x={0} y={0} scale={1} portrait speaking={talking} />}
    </svg>
    <PixelText text={speaker} x={54} y={320} size={1.1} color={C.mint} align="left" />
    <PixelText text={page} x={218} y={320} size={0.8} color={C.lavender} />
    {lines.map((line, i) => {
      const shown = line.slice(0, Math.max(0, count - consumed));
      consumed += line.length + 1;
      return <PixelText key={i} text={shown} x={27} y={342 + i * 16} size={1.6} align="left" />;
    })}
    {count >= text.length ? <g opacity={0.55 + Math.sin(frame / fps * 3) * 0.25}><path d="M215 389h7l-3.5 4z" fill={C.gold} /></g> : null}
  </g>;
};
