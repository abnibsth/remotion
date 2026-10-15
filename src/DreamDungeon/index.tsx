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
import { RecordedVoiceText, recording } from "./RecordedVoice";
import { speechVolume } from "./voice-timing";

export { Arrival, Bedroom, Meeting, RemSleep, Victory };

export const DreamDungeon = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Audio name="Narasi Bian - rekaman lengkap" src={staticFile(recording.src)} playbackRate={recording.playbackRate} volume={1} premountFor={fps} />
    <Audio name="Musik dunia mimpi" src={staticFile("dream-dungeon/dream-score.wav")} volume={(audioFrame) => speechVolume(audioFrame / fps, recording.words)} premountFor={fps} />
    <Audio name="Portal terbuka" from={Math.round(5.1 * fps)} src={staticFile("dream-dungeon/sfx/portal.wav")} volume={0.45} premountFor={fps} />
    <Audio name="Notifikasi misi baru" from={Math.round(8.3 * fps)} src={staticFile("dream-dungeon/sfx/quest.wav")} volume={0.45} premountFor={fps} />
    <Audio name="Sihir penjaga mimpi" from={Math.round(17.6 * fps)} src={staticFile("dream-dungeon/sfx/magic.wav")} volume={0.4} premountFor={fps} />
    <Audio name="Ingatan membentuk mimpi" from={Math.round(27.1 * fps)} src={staticFile("dream-dungeon/sfx/magic.wav")} volume={0.3} premountFor={fps} />
    <Audio name="Kristal diberikan" from={Math.round(33.5 * fps)} src={staticFile("dream-dungeon/sfx/crystal.wav")} volume={0.45} premountFor={fps} />
    <Audio name="Misi selesai" from={Math.round(32.5 * fps)} src={staticFile("dream-dungeon/sfx/victory.wav")} volume={0.5} premountFor={fps} />
    <TransitionSeries>
      <TransitionSeries.Sequence name="01 - Portal kamar" durationInFrames={8.5 * fps} premountFor={fps}><Bedroom /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="02 - Dunia mimpi" durationInFrames={7.5 * fps} premountFor={fps}><Arrival /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="03 - Penjaga mimpi" durationInFrames={9.1 * fps} premountFor={fps}><Meeting /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="04 - Tidur REM dan ingatan" durationInFrames={9.2 * fps} premountFor={fps}><RemSleep /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 0.5 * fps })} />
      <TransitionSeries.Sequence name="05 - Hadiah kristal mimpi" durationInFrames={7.7 * fps} premountFor={fps}><Victory /></TransitionSeries.Sequence>
    </TransitionSeries>
    <RecordedVoiceText />
    <svg viewBox="0 0 270 480" width="100%" height="100%" shapeRendering="crispEdges" style={{ position: "absolute", pointerEvents: "none" }}>
      <PixelText text="PIXEL QUEST" x={20} y={24} size={0.8} align="left" color="#a38fae" />
      <PixelText text="EP.02" x={213} y={24} size={0.8} color="#a38fae" />
      <Rect x={20} y={36} w={210} h={1} fill="#39304e" />
      <Rect x={20} y={36} w={210 * Math.min(1, frame / (40 * fps - 1))} h={1} fill={C.lavender} />
    </svg>
  </AbsoluteFill>;
};
