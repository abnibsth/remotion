import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrival } from "./Arrival";
import { Bedroom } from "./Bedroom";
import { Meeting } from "./Meeting";
import { RemSleep } from "./RemSleep";
import { Victory } from "./Victory";
import { C, PixelText, Rect } from "./Art";

export { Arrival, Bedroom, Meeting, RemSleep, Victory };

export const DreamDungeon = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Audio src={staticFile("dream-dungeon/dream-score.wav")} volume={0.8} premountFor={fps} />
    <TransitionSeries>
      <TransitionSeries.Sequence name="01 - Portal kamar" durationInFrames={8 * fps} premountFor={fps}><Bedroom /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="02 - Dunia mimpi" durationInFrames={8.5 * fps} premountFor={fps}><Arrival /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="03 - Penjaga mimpi" durationInFrames={8.5 * fps} premountFor={fps}><Meeting /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="04 - Tidur REM dan ingatan" durationInFrames={10.5 * fps} premountFor={fps}><RemSleep /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="05 - Hadiah kristal mimpi" durationInFrames={6.5 * fps} premountFor={fps}><Victory /></TransitionSeries.Sequence>
    </TransitionSeries>
    <svg viewBox="0 0 270 480" width="100%" height="100%" shapeRendering="crispEdges" style={{ position: "absolute", pointerEvents: "none" }}>
      <PixelText text="PIXEL QUEST" x={20} y={24} size={0.8} align="left" color="#a38fae" />
      <PixelText text="EP.02" x={213} y={24} size={0.8} color="#a38fae" />
      <Rect x={20} y={36} w={210} h={1} fill="#39304e" />
      <Rect x={20} y={36} w={210 * Math.min(1, frame / (40 * fps - 1))} h={1} fill={C.lavender} />
    </svg>
  </AbsoluteFill>;
};
