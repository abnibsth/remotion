import { useCurrentFrame, useVideoConfig } from "remotion";
import recording from "./recording.json";
import { Dialogue } from "./Dialogue";

export { recording };

export const isVoiceSpeaking = (seconds: number) => recording.words.some(
  (word) => seconds * 1000 >= word.startMs && seconds * 1000 < word.endMs,
);

// Captions use measured speech timestamps, not an estimated typewriter speed.
export const RecordedVoiceText = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = frame / fps * 1000;
  const index = recording.pages.findIndex((page, i) => {
    const next = recording.pages[i + 1];
    const holdUntil = Math.min(page.endMs + 280, next?.startMs ?? 40000);
    return ms >= page.startMs && ms < holdUntil;
  });
  if (index < 0) return null;
  const page = recording.pages[index];
  const text = page.words.map((word) => word.text.trim()).join(" ");
  let revealed = 0;
  page.words.forEach((word, i) => {
    if (ms >= word.startMs) revealed += word.text.trim().length + (i ? 1 : 0);
  });
  const guardian = ms >= 15100 && ms < 32200;
  return <svg viewBox="0 0 270 480" width="100%" height="100%" shapeRendering="crispEdges" style={{ position: "absolute", pointerEvents: "none" }}>
    <Dialogue
      text={text}
      start={page.startMs / 1000}
      end={40}
      speaker={guardian ? "PENJAGA MIMPI" : "NARATOR"}
      page={index + 1 < 10 ? `0${index + 1}` : String(index + 1)}
      revealedCharacters={revealed}
      speaking={isVoiceSpeaking(frame / fps)}
    />
  </svg>;
};
