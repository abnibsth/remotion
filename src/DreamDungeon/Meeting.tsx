import { useCurrentFrame, useVideoConfig } from "remotion";
import { Brain, C, DreamWorld, Island, Memory, Panel, SceneCanvas, Star, Tree, progress } from "./Art";
import { Camera, IslandMotion } from "./Camera";
import { isVoiceSpeaking } from "./RecordedVoice";
import { Guardian, Hero } from "./Sprites";

export const Meeting = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const walk = progress(f, fps, 0, 1.8);
  const summon = progress(f, fps, 1.6, 2.7);
  const t = f / fps;
  const speaking = isVoiceSpeaking(t + 15);
  return <SceneCanvas>
    <DreamWorld cameraX={walk * 8} />
    <Camera focusX={140} focusY={238} zoomFrom={1.04} zoomTo={1.15} screenY={217}>
      <IslandMotion>
        <Island x={135} y={307} scale={1.5} />
        <Tree x={42} y={290} scale={0.8} pink /><Tree x={232} y={285} scale={0.8} />
        <Hero x={89 + walk * 9} y={315 - walk * 8} scale={1.6} state={walk < 1 ? "walk" : t < 2.8 ? "surprised" : "idle"} facing="right" />
        <Guardian x={180} y={302} scale={1.65} speaking={speaking} gesture={t > 1.6} />
      </IslandMotion>
      <g opacity={summon}>
        <Brain y={170} scale={0.9 * Math.max(0.01, summon)} active />
        <Memory x={76 + Math.sin(t) * 3} y={143} type="home" scale={0.75} />
        <Memory x={194 + Math.sin(t + 2) * 3} y={141} type="heart" scale={0.75} />
        <Memory x={80} y={204 + Math.sin(t) * 2} type="book" scale={0.65} />
        <Memory x={191} y={205 + Math.sin(t + 2) * 2} type="moon" scale={0.65} />
        <Star x={117} y={222} color={C.gold} size={0.5} />
      </g>
    </Camera>
    <Panel y={44} title="TEMUI PENJAGA MIMPI" color={C.mint} />
  </SceneCanvas>;
};
