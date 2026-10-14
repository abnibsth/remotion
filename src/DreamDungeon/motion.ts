export type HeroState = "idle" | "walk" | "sleep" | "surprised" | "talk" | "celebrate";

export const snapPixel = (value: number) => Math.round(value * 4) / 4;

export const glyphWidth = (char: string) => {
  if (char === "I" || char === "1" || char === " " || char === "+" || char === "-") return 3;
  if (char === "!" || char === "." || char === ":" || char === ",") return 1;
  return 5;
};

export const measureText = (text: string, size: number) =>
  text.toUpperCase().split("").reduce((width, char) => width + glyphWidth(char) + 1, 0) * size;

export const wrapWords = (text: string, width: number, size: number): string[] => {
  const lines: string[] = [];
  let line = "";
  for (const word of text.trim().split(/\s+/)) {
    if (!word) continue;
    const next = line ? `${line} ${word}` : word;
    if (line && measureText(next, size) > width) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
};

export const visibleCharacters = (frame: number, fps: number, length: number, rate = 26) =>
  Math.min(length, Math.max(0, Math.floor(frame / fps * rate)));

export const getPose = (frame: number, fps: number, state: HeroState) => {
  const t = Math.max(0, frame) / fps;
  const step = Math.floor(t * 10) % 8;
  const walking = state === "walk";
  const stride = [0, 1, 2, 1, 0, -1, -2, -1][step];
  const breath = Math.sin(t * 2.4);
  const blink = t % 4.6 > 4.35;
  return {
    leftLeg: walking ? stride : 0,
    rightLeg: walking ? -stride : 0,
    leftArm: walking ? -stride : state === "celebrate" ? -12 : 0,
    rightArm: walking ? stride : state === "celebrate" ? -12 : 0,
    bob: walking ? [0, 0, -0.5, 0, 0, 0, -0.5, 0][step] : breath * 0.3,
    breath: walking ? 0 : breath * 0.35,
    eyesClosed: state === "sleep" || (state !== "surprised" && blink),
    mouthOpen: state === "talk" && Math.floor(t * 7) % 3 !== 0,
    surprised: state === "surprised",
  };
};
