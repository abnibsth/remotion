import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, Crystal, DreamWorld, Island, Panel, SceneCanvas, Star, Tree, progress } from "./Art";
import { Camera, IslandMotion } from "./Camera";
import { Guardian, Hero } from "./Sprites";

export const Victory = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const give = progress(f, fps, 1.1, 3.1);
  const victory = progress(f, fps, 0.2, 0.55);
  const t = f / fps;
  return <SceneCanvas>
    <DreamWorld cameraX={give * 5} />
    <Camera focusX={138} focusY={236} zoomFrom={1.08} zoomTo={1.2} screenY={222} duration={5}>
      <IslandMotion>
        <Island x={135} y={304} scale={1.5} />
        <Tree x={44} y={286} scale={0.8} pink /><Tree x={229} y={280} scale={0.8} />
        <Guardian x={181} y={304} scale={1.6} gesture={give < 1} />
        <Hero x={102} y={307 - (victory > 0 ? Math.max(0, Math.sin((t - 2) * 4)) * 2 : 0)} scale={1.65} state={victory > 0 ? "celebrate" : "idle"} facing={victory > 0 ? "front" : "right"} />
        <Crystal x={151 - give * 48} y={267 - give * 47 + Math.sin(t * 2) * 2} scale={1.3} />
      </IslandMotion>
      <g opacity={victory}>
        <Crystal x={135} y={154 + Math.sin(t * 2) * 2} scale={2.6} />
        {Array.from({ length: 12 }, (_, i) => <Star key={i} x={65 + i * 41 % 141} y={132 + (i * 29 + Math.floor(t * 5)) % 126} color={i % 2 ? C.gold : C.mint} size={i % 3 === 0 ? 0.6 : 0.35} />)}
      </g>
    </Camera>
    <g opacity={victory}><Panel y={44} title="MISI SELESAI!" subtitle="PENGETAHUAN +100 XP" color={C.gold} /></g>
  </SceneCanvas>;
};
