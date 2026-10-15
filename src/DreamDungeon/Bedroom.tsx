import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, PixelText, Portal, Rect, SceneCanvas, Star, progress } from "./Art";
import { Camera } from "./Camera";
import { Hero } from "./Sprites";

export const Bedroom = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portal = progress(frame, fps, 4.9, 5.8);
  const enter = progress(frame, fps, 6.1, 7.7);
  return <SceneCanvas>
    <Rect x={0} y={0} w={270} h={480} fill="#17182b" />
    <Camera focusX={143} focusY={232} zoomFrom={1.18} zoomTo={1.32} screenY={269} duration={7}>
    <Rect x={22} y={132} w={226} h={218} fill="#292332" />
    <Rect x={28} y={167} w={214} h={174} fill="#614650" />
    {Array.from({ length: 17 }, (_, i) => <g key={i}>
      <Rect x={28} y={167 + i * 10} w={214} h={1} fill="#362d3c" />
      <Rect x={28 + (i % 3) * 24} y={168 + i * 10} w={1} h={9} fill="#3c303e" />
      <Rect x={104 + (i % 4) * 20} y={168 + i * 10} w={1} h={9} fill="#3c303e" />
      <Rect x={35 + (i * 31 % 170)} y={172 + i * 10} w={15} h={1} fill="#987075" opacity={0.45} />
    </g>)}
    <Rect x={28} y={129} w={214} h={40} fill="#795461" />
    <Rect x={30} y={135} w={210} h={2} fill="#a77d80" /><Rect x={30} y={162} w={210} h={4} fill="#3b2c3c" />
    {Array.from({ length: 10 }, (_, i) => <Rect key={i} x={32 + i * 22} y={135} w={2} h={27} fill="#503947" />)}
    <Rect x={35} y={139} w={60} h={6} fill="#4b3444" /><Rect x={40} y={129} w={49} h={9} fill="#a67c83" />
    <Rect x={44} y={118} w={41} h={24} fill="#242943" /><Rect x={46} y={119} w={37} h={20} fill="#3a4268" />
    <path d="M70 121h5v3h-4v6h5v3h-7v-3h-3v-6h4z" fill="#eee1bd" />
    <Star x={52} y={126} size={0.4} /><Star x={61} y={134} size={0.3} />
    <Rect x={61} y={119} w={3} h={23} fill="#b69698" /><Rect x={44} y={131} w={41} h={2} fill="#b69698" />
    <path d="M43 144h44l82 141H47z" fill="#b8b8df" opacity={0.08} />
    <path d="M61 144h25l52 102H78z" fill="#bdc5ed" opacity={0.06} />
    <Rect x={156} y={136} w={65} h={6} fill="#483240" />
    <Rect x={162} y={123} w={6} h={13} fill="#b09982" /><Rect x={168} y={126} w={6} h={10} fill="#62888e" />
    <Rect x={176} y={121} w={5} h={15} fill="#a37888" /><Rect x={183} y={124} w={6} h={12} fill="#9f8f65" />
    <Rect x={201} y={128} w={12} h={8} fill="#a77b76" /><Rect x={204} y={119} w={6} h={10} fill="#628779" />
    <Rect x={199} y={122} w={5} h={4} fill="#92b397" /><Rect x={209} y={120} w={5} h={4} fill="#92b397" />
    <Rect x={65} y={242} w={145} h={73} fill="#3d324b" /><Rect x={69} y={246} w={137} h={65} fill="#877395" />
    <Rect x={74} y={250} w={127} h={57} fill="#6a567d" /><Rect x={78} y={254} w={119} h={49} fill="#877395" />
    {Array.from({ length: 12 }, (_, i) => <Rect key={i} x={78 + i * 10} y={300} w={3} h={4} fill="#baa4b7" />)}
    <Rect x={113} y={179} w={74} h={102} fill="#372c3d" /><Rect x={116} y={172} w={68} h={101} fill="#997279" />
    <Rect x={120} y={176} w={60} h={96} fill="#563e50" /><Rect x={120} y={184} w={60} h={81} fill="#d3b8b5" />
    <Rect x={126} y={188} w={48} h={19} fill="#f2d9c3" /><Rect x={128} y={190} w={44} h={4} fill="#fff0d5" />
    {enter === 0 ? <Hero x={150} y={248} scale={1.12} state={frame < 5.1 * fps ? "sleep" : "surprised"} /> : null}
    <Rect x={120} y={220} w={60} h={43} fill="#596b91" /><Rect x={120} y={220} w={60} h={6} fill="#a4b7c9" />
    <Rect x={125} y={229} w={3} h={29} fill="#7e91af" /><Rect x={174} y={229} w={3} h={29} fill="#435479" />
    {Array.from({ length: 5 }, (_, i) => <Star key={i} x={135 + (i * 11 % 37)} y={235 + (i * 7 % 23)} size={0.3} color="#a4b7c9" />)}
    <Rect x={192} y={183} w={29} h={32} fill="#3f2d3b" /><Rect x={193} y={183} w={28} h={7} fill="#aa7a78" />
    <Rect x={196} y={194} w={22} h={13} fill="#73505b" /><Rect x={204} y={198} w={6} h={2} fill={C.gold} />
    <Rect x={203} y={172} w={4} h={11} fill="#c89b7c" /><Rect x={197} y={165} w={16} h={8} fill="#f1c48f" />
    <Rect x={188} y={159} w={36} h={31} fill={C.gold} opacity={0.045} />
    <Rect x={44} y={286} w={19} h={18} fill="#97696c" /><Rect x={40} y={273} w={26} h={15} fill="#597a71" />
    <Rect x={45} y={263} w={16} h={24} fill="#789c83" /><Rect x={52} y={263} w={3} h={22} fill="#a0b798" />
    {frame < 5 * fps ? <PixelText text="Z Z Z" x={182} y={184 - Math.floor(frame / fps * 3)} size={0.8} color={C.lavender} /> : null}
    <Portal x={149} y={184} amount={portal} />
    {enter > 0 ? <g opacity={1 - enter * 0.75}><Hero x={149} y={248 - enter * 53} scale={1.12 * (1 - enter * 0.55)} state="surprised" /></g> : null}
    {Array.from({ length: 17 }, (_, i) => <rect key={i} x={38 + i * 13 % 194} y={173 + (i * 31 + Math.floor(frame / 12)) % 156} width={1} height={1} fill={C.gold} opacity={0.25} />)}
    </Camera>
    <PixelText text="PIXEL QUEST" x={125} y={43} size={2.3} color={C.gold} />
    <PixelText text="EPISODE 02" x={125} y={67} size={1.2} color={C.lavender} />
    <PixelText text="LABIRIN MIMPI" x={125} y={88} size={1.8} />
    <PixelText text="01 - PORTAL TENGAH MALAM" x={125} y={415} size={1.1} color={C.lavender} />
    <Rect x={0} y={0} w={270} h={480} fill={C.lavender} opacity={progress(frame, fps, 7.5, 8) * 0.55} />
  </SceneCanvas>;
};
