export function parseLoudness(stderr) {
  const match = stderr.match(/\{\s*"input_i"[\s\S]*?\}/);
  if (!match) throw new Error('Missing FFmpeg loudnorm JSON');
  return JSON.parse(match[0]);
}
