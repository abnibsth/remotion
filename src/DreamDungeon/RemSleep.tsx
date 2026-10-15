import { useCurrentFrame, useVideoConfig } from "remotion";
import { Brain, C, DreamWorld, Island, Memory, Panel, PixelText, Rect, SceneCanvas, Star, Tree, progress } from "./Art";
import { Camera, IslandMotion } from "./Camera";
import { isVoiceSpeaking } from "./RecordedVoice";
import { Guardian, Hero } from "./Sprites";

export const RemSleep = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const merge = progress(f, fps, 0.8, 2.5);
  const form = progress(f, fps, 2.5, 4.8);
  return <SceneCanvas>
    <DreamWorld cameraY={form * 15} />
    <Camera focusX={135} focusY={232} zoomFrom={1.06} zoomTo={1.12} screenY={214} duration={8}>
      <Brain x={135} y={161} scale={1.06} active />
      <g opacity={1 - merge}>
        <Memory x={61 + merge * 60} y={153 + merge * 12} type="home" scale={0.85} />
        <Memory x={206 - merge * 58} y={148 + merge * 14} type="heart" scale={0.85} />
        <Memory x={70 + merge * 50} y={217 - merge * 47} type="book" scale={0.7} />
        <Memory x={197 - merge * 50} y={210 - merge * 40} type="moon" scale={0.7} />
      </g>
      <IslandMotion>
        <Island x={135} y={310} scale={1.5} />
        <Tree x={43} y={292} scale={0.85} pink />
        <g opacity={form} transform={`translate(146 ${Math.round(230 + Math.sin(t) * 1.5)})`}>
          <path d="M-25 6v-7h7v-7h8v-7h20v7h8v7h7v7z" fill="#7e587e" />
          <path d="M-21 3v-5h7v-6h8v-5H6v5h8v6h7v5z" fill={C.pink} />
          <Rect x={-19} y={6} w={38} h={33} fill="#b399ae" /><Rect x={-15} y={11} w={30} h={24} fill="#746b94" />
          <Rect x={-3} y={23} w={8} h={16} fill="#393454" /><Rect x={-11} y={16} w={7} h={7} fill={C.gold} />
          <Rect x={7} y={16} w={6} h={7} fill={C.mint} /><Star x={0} y={-2} size={0.7} />
          <Memory x={32} y={-11} type="heart" scale={0.55} /><Memory x={-34} y={22} type="book" scale={0.55} />
        </g>
        <Hero x={89} y={309} scale={1.5} facing="right" />
        <Guardian x={204} y={312} scale={1.4} speaking={isVoiceSpeaking(t + 23.6)} gesture />
      </IslandMotion>
      {[0, 1, 2, 3, 4, 5].map((i) => <Star key={i} x={112 + i * 9} y={206 + ((t * 12 + i * 9) % 54)} color={i % 2 ? C.mint : C.gold} size={0.35} />)}
    </Camera>
    <Panel y={44} title="TIDUR REM" subtitle="FASE GERAK MATA CEPAT" color={C.mint} />
    <PixelText text="MIMPI JUGA BISA DI LUAR REM" x={125} y={411} size={0.9} color={C.lavender} />
  </SceneCanvas>;
};
