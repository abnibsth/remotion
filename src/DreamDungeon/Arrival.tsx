import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DreamWorld, Island, Panel, PixelText, Portal, SceneCanvas, Tree, ease, progress } from "./Art";
import { Camera, IslandMotion } from "./Camera";
import { Hero } from "./Sprites";
import { Dialogue } from "./Dialogue";

export const Arrival = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const walk = interpolate(f, [fps, 5.5 * fps], [0, 1], { ...ease, easing: Easing.inOut(Easing.quad) });
  const heroX = 113 + walk * 24;
  const heroY = 307 - walk * 30;
  return <SceneCanvas>
    <DreamWorld cameraX={heroX - 113} cameraY={heroY - 316} />
    <Camera focusX={125 + walk * 8} focusY={252 - walk * 9} zoomFrom={1.04} zoomTo={1.17} screenY={248}>
      <IslandMotion>
        <Island x={135} y={295} scale={1.5} ruins />
        <Tree x={46} y={279} scale={0.9} pink /><Tree x={226} y={282} scale={0.85} />
        <Portal x={113} y={304} amount={1 - progress(f, fps, 0.9, 2.4)} />
        <Hero x={heroX} y={heroY} scale={1.5} state={walk > 0 && walk < 1 ? "walk" : f < fps ? "surprised" : f < 6.7 * fps ? "talk" : "idle"} facing={walk < 1 ? "right" : "left"} />
      </IslandMotion>
    </Camera>
    <g opacity={progress(f, fps, 0.8, 1.4)}><Panel y={44} title="MISI BARU" subtitle="KENAPA KITA BERMIMPI?" color={C.gold} /></g>
    <PixelText text="DUNIA MIMPI" x={125} y={105} size={1.5} color={C.lavender} />
    <Dialogue start={5.5} end={8.5} speaker="PETUALANG" text="Aku di mana? Ini dunia mimpi?" />
  </SceneCanvas>;
};
