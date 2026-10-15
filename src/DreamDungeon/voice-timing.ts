export type VoiceCaption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

export const toVideoCaptions = (words: VoiceCaption[], playbackRate: number): VoiceCaption[] =>
  words.map((word) => ({
    ...word,
    startMs: Math.round(word.startMs / playbackRate),
    endMs: Math.round(word.endMs / playbackRate),
    timestampMs: word.timestampMs === null ? null : Math.round(word.timestampMs / playbackRate),
  }));

export const buildCaptionPages = (words: VoiceCaption[], maxWords = 9) => {
  const pages: { words: VoiceCaption[]; startMs: number; endMs: number }[] = [];
  let pending: VoiceCaption[] = [];
  const flush = () => {
    if (!pending.length) return;
    pages.push({ words: pending, startMs: pending[0].startMs, endMs: pending[pending.length - 1].endMs });
    pending = [];
  };
  words.forEach((word) => {
    pending.push(word);
    if (pending.length >= maxWords || /[.!?]$/.test(word.text.trim())) flush();
  });
  flush();
  return pages;
};

export const speechVolume = (seconds: number, words: { startMs: number; endMs: number }[]) => {
  const ms = seconds * 1000;
  let duck = 0;
  words.forEach((word) => {
    const attack = Math.max(0, Math.min(1, (ms - word.startMs + 180) / 180));
    const release = Math.max(0, Math.min(1, (word.endMs + 300 - ms) / 300));
    duck = Math.max(duck, Math.min(attack, release));
  });
  return 0.5 - duck * 0.26;
};
