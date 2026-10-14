import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Rect, Star } from "./Art";
import { getPose, HeroState, snapPixel } from "./motion";

const H = {
  outline: "#171b32", shadow: "#234775", blue: "#3e78bb", light: "#77b4e5", rim: "#abd8ef",
  hair: "#493347", hairLight: "#80576a", skin: "#e3a889", skinLight: "#ffdab1", skinShade: "#bd7d78",
  trouser: "#353649", trouserLight: "#575b73", shoe: "#24263a", sole: "#858999",
  bag: "#805538", bagLight: "#bb8752", bagShade: "#513c35",
};

type HeroProps = {
  x: number; y: number; scale?: number; state?: HeroState; facing?: "left" | "right" | "front";
  portrait?: boolean;
};

// Layered 32 × 48 sprite. The feet are the world anchor, shared by every pose.
export const Hero = ({ x, y, scale = 1.5, state = "idle", facing = "front", portrait = false }: HeroProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = getPose(frame, fps, state);
  const gaze = facing === "left" ? -1 : facing === "right" ? 1 : 0;
  const breath = snapPixel(pose.breath);
  const Head = <g transform={`translate(${gaze} ${breath})`}>
    <path d="M-9 -45h17v2h3v3h2v12h-3v5H-9v-3h-4v-13h2v-4h2z" fill={H.outline} />
    <path d="M-8 -44H7v2h3v4h2v11h-3v3H-8v-3h-4v-12h2v-3h2z" fill={H.shadow} />
    <path d="M-8 -43H6v2h3v3h2v7H8v-7H5v-2H-7v2h-2v10h-2v-10h1v-3h2z" fill={H.blue} />
    <Rect x={-7} y={-43} w={10} h={1} fill={H.rim} /><Rect x={-10} y={-38} w={2} h={9} fill={H.light} />
    <path d="M-7 -38H7v3h2v9H6v3H-4v-2h-4v-10h1z" fill={H.skinShade} />
    <path d="M-6 -38H6v3h2v8H5v3h-9v-2h-3v-8h1z" fill={H.skin} />
    <Rect x={-4} y={-34} w={10} h={7} fill={H.skinLight} /><Rect x={-7} y={-31} w={2} h={4} fill={H.skin} />
    <path d="M-7 -38v-3H5v1h3v5H5v-2H2v2h-3v-2h-3v5h-3z" fill={H.hair} />
    <Rect x={-5} y={-40} w={7} h={1} fill={H.hairLight} /><Rect x={2} y={-39} w={3} h={1} fill={H.hairLight} />
    <Rect x={-5} y={pose.surprised ? -34 : -33} w={3} h={1} fill={H.hair} />
    <Rect x={3} y={pose.surprised ? -34 : -33} w={3} h={1} fill={H.hair} />
    {pose.eyesClosed ? <><Rect x={-5} y={-30} w={3} h={1} fill={H.hair} /><Rect x={3} y={-30} w={3} h={1} fill={H.hair} /></> : <>
      <Rect x={-5} y={-31} w={3} h={pose.surprised ? 4 : 3} fill={C.cream} /><Rect x={3} y={-31} w={3} h={pose.surprised ? 4 : 3} fill={C.cream} />
      <Rect x={-4 + gaze} y={-30} w={1} h={2} fill={H.outline} /><Rect x={4 + gaze} y={-30} w={1} h={2} fill={H.outline} />
    </>}
    <Rect x={0} y={-28} w={2} h={1} fill={H.skinShade} />
    <Rect x={-1} y={-25} w={pose.surprised ? 3 : 4} h={pose.mouthOpen || pose.surprised ? 2 : 1} fill={H.hair} />
    <Rect x={-6} y={-27} w={2} h={1} fill="#dc9292" /><Rect x={5} y={-27} w={2} h={1} fill="#dc9292" />
  </g>;
  const arm = (left: boolean) => <g transform={`translate(${left ? -12 : 9} ${snapPixel(left ? pose.leftArm : pose.rightArm)})`}>
    <Rect x={-1} y={-24} w={6} h={14} fill={H.outline} /><Rect x={0} y={-23} w={4} h={11} fill={H.blue} />
    <Rect x={0} y={-22} w={1} h={8} fill={H.light} /><Rect x={3} y={-22} w={1} h={9} fill={H.shadow} />
    <Rect x={0} y={-13} w={4} h={2} fill={H.light} /><Rect x={0} y={-11} w={4} h={4} fill={H.skin} />
    <Rect x={0} y={-10} w={3} h={2} fill={H.skinLight} /><Rect x={3} y={-9} w={1} h={2} fill={H.skinShade} />
  </g>;
  return <g transform={`translate(${snapPixel(x)} ${snapPixel(y)}) scale(${scale})`}>
    {!portrait && state !== "sleep" ? <><Rect x={-13} y={-1} w={26} h={3} fill={C.ink} opacity={0.32} /><Rect x={-9} y={2} w={18} h={1} fill={C.ink} opacity={0.18} /></> : null}
    <g transform={`translate(0 ${snapPixel(pose.bob)})`}>
      {!portrait ? <>
        <g transform={`translate(0 ${pose.leftLeg})`}><Rect x={-8} y={-16} w={8} h={14} fill={H.outline} /><Rect x={-7} y={-15} w={6} h={11} fill={H.trouser} /><Rect x={-6} y={-14} w={2} h={8} fill={H.trouserLight} /><Rect x={-9} y={-4} w={9} h={4} fill={H.shoe} /><Rect x={-9} y={-1} w={9} h={1} fill={H.sole} /><Rect x={-7} y={-3} w={3} h={1} fill="#60728d" /></g>
        <g transform={`translate(0 ${pose.rightLeg})`}><Rect x={1} y={-16} w={8} h={14} fill={H.outline} /><Rect x={2} y={-15} w={6} h={11} fill={H.trouser} /><Rect x={3} y={-14} w={2} h={8} fill={H.trouserLight} /><Rect x={1} y={-4} w={10} h={4} fill={H.shoe} /><Rect x={1} y={-1} w={10} h={1} fill={H.sole} /><Rect x={3} y={-3} w={3} h={1} fill="#60728d" /></g>
      </> : null}
      <g transform={`translate(0 ${breath})`}>
        <Rect x={8} y={-25} w={9} h={15} fill={H.bagShade} /><Rect x={10} y={-24} w={6} h={13} fill={H.bag} />
        <Rect x={10} y={-24} w={5} h={3} fill={H.bagLight} /><Rect x={11} y={-17} w={4} h={5} fill={H.bagLight} />
        <Rect x={12} y={-20} w={2} h={2} fill={C.gold} /><Rect x={15} y={-22} w={1} h={10} fill={H.bagShade} />
        {arm(true)}
        <path d="M-6 -26H7v2h3v13H7v2H-7v-2h-3v-12h4z" fill={H.outline} />
        <path d="M-5 -25H6v2h3v11H6v2H-6v-2h-3v-10h4z" fill={H.blue} />
        <Rect x={-7} y={-22} w={2} h={9} fill={H.light} /><Rect x={7} y={-22} w={2} h={10} fill={H.shadow} />
        <Rect x={-5} y={-25} w={10} h={2} fill={H.light} /><Rect x={-2} y={-25} w={4} h={2} fill={H.skin} />
        <Rect x={-3} y={-23} w={1} h={6} fill={H.rim} /><Rect x={3} y={-23} w={1} h={6} fill={H.rim} />
        <Rect x={-5} y={-15} w={10} h={4} fill={H.shadow} /><Rect x={-4} y={-15} w={8} h={1} fill={H.light} />
        <Rect x={-6} y={-11} w={13} h={1} fill={H.shadow} /><Rect x={6} y={-23} w={2} h={11} fill={H.bagShade} />
        <Rect x={6} y={-22} w={1} h={9} fill={H.bagLight} />
        {arm(false)}
        {state === "sleep" ? <><Rect x={-7} y={-16} w={8} h={3} fill={H.light} /><Rect x={-1} y={-16} w={4} h={3} fill={H.skinLight} /><Rect x={4} y={-18} w={5} h={3} fill={H.blue} /><Rect x={1} y={-18} w={4} h={3} fill={H.skin} /></> : null}
      </g>
      {Head}
    </g>
    {state === "surprised" ? <><Rect x={18} y={-49} w={2} h={7} fill={C.gold} /><Rect x={18} y={-40} w={2} h={2} fill={C.gold} /></> : null}
  </g>;
};

type GuardianProps = { x: number; y: number; scale?: number; speaking?: boolean; gesture?: boolean; portrait?: boolean };
export const Guardian = ({ x, y, scale = 1.65, speaking = false, gesture = false, portrait = false }: GuardianProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const float = portrait ? 0 : snapPixel(Math.sin(t * 1.6) * 2);
  const closed = t % 5 > 4.8;
  const hand = gesture ? snapPixel(-4 + Math.sin(t * 2.5) * 1.5) : 0;
  return <g transform={`translate(${snapPixel(x)} ${snapPixel(y)}) scale(${scale})`}>
    {!portrait ? <><Rect x={-14} y={1} w={28} h={3} fill={C.ink} opacity={0.24} /><Rect x={-10} y={4} w={20} h={1} fill={C.ink} opacity={0.1} /></> : null}
    <g transform={`translate(0 ${float})`}>
      <path d="M-4 -51H4v3h3v5h4v6h2v12h-2v4h4v9h2V-1H-17v-11h2v-9h4v-4h-2v-12h2v-6h4v-5h3z" fill="#362d54" />
      <path d="M-3 -49H3v4h3v5h4v14H6v7h5v7h3v10H-14v-10h3v-7h5v-7h-4v-14h4v-5h3z" fill="#7863a4" />
      <path d="M-3 -47H1v5h3v5h4v8H5v-8H1v-5h-4z" fill="#b99bda" />
      <path d="M-8 -33H7v3h2v8H5v4H-4v-3h-5v-9h1z" fill="#bf98aa" />
      <Rect x={-6} y={-32} w={12} h={11} fill="#f0d4bc" /><Rect x={-6} y={-31} w={3} h={7} fill="#d3b1b1" />
      <Rect x={-5} y={-29} w={3} h={1} fill="#77576e" /><Rect x={3} y={-29} w={3} h={1} fill="#77576e" />
      <Rect x={-5} y={-27} w={2} h={closed ? 1 : 2} fill={C.ink} /><Rect x={3} y={-27} w={2} h={closed ? 1 : 2} fill={C.ink} />
      <Rect x={-1} y={-24} w={2} h={1} fill="#be8b91" />
      <Rect x={-2} y={-22} w={4} h={speaking && Math.floor(t * 7) % 3 !== 0 ? 2 : 1} fill="#8a5c78" />
      <path d="M-4 -18H4v7h2v8H-6v-8h2z" fill={C.lavender} />
      <Rect x={-2} y={-17} w={4} h={3} fill={C.gold} /><Rect x={-1} y={-16} w={2} h={1} fill={C.cream} />
      <Rect x={-9} y={-12} w={2} h={9} fill="#9c7fbf" /><Rect x={7} y={-12} w={2} h={9} fill="#4f426f" />
      <Rect x={-13} y={-3} w={26} h={2} fill={C.gold} /><Rect x={-10} y={-2} w={20} h={1} fill="#b48f72" />
      <g transform={`translate(0 ${hand})`}>
        <path d="M-10 -21h-5v3h-6v7h7v-4h4z" fill="#51436f" /><Rect x={-19} y={-18} w={8} h={4} fill="#a186c4" />
        <Rect x={-22} y={-16} w={5} h={4} fill="#f0d4bc" /><Rect x={-23} y={-17} w={3} h={2} fill="#f7e3c9" />
      </g>
      <Rect x={10} y={-21} w={7} h={9} fill="#51436f" /><Rect x={11} y={-20} w={3} h={7} fill="#a186c4" />
      <Rect x={14} y={-14} w={5} h={4} fill="#f0d4bc" />
      <Rect x={18} y={-39} w={2} h={39} fill="#62485e" /><Rect x={18} y={-36} w={1} h={33} fill="#b39298" />
      <Rect x={15} y={-39} w={8} h={2} fill={C.gold} /><Star x={19} y={-43} size={1.1} color={C.mint} />
      {!portrait ? [0, 1, 2].map((i) => <Star key={i} x={19 + Math.sin(t + i * 2) * 8} y={-44 + Math.cos(t + i * 2) * 7} size={0.3} color={C.lavender} />) : null}
    </g>
  </g>;
};
