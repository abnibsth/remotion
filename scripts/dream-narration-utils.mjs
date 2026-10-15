export function alignmentToWords(alignment) {
  if (!alignment || !Array.isArray(alignment.characters)) throw new Error('Missing character alignment');
  const words = [];
  let text = '';
  let start = 0;
  let end = 0;
  const flush = () => {
    if (text) words.push({ text: `${words.length ? ' ' : ''}${text}`, startMs: Math.round(start * 1000), endMs: Math.round(end * 1000), timestampMs: Math.round((start + end) * 500), confidence: null });
    text = '';
  };
  alignment.characters.forEach((char, i) => {
    if (/\s/.test(char)) { flush(); return; }
    if (!text) start = alignment.character_start_times_seconds[i];
    text += char;
    end = alignment.character_end_times_seconds[i];
  });
  flush();
  return words;
}

export function fitVoice(duration, budget) {
  if (!(duration > 0 && budget > 0)) throw new Error('Invalid voice duration');
  const playbackRate = Math.max(1, duration / budget);
  if (playbackRate > 1.25) throw new Error('Narration too long: shorten script instead of rushing or truncating speech');
  return { playbackRate, duration: duration / playbackRate };
}
