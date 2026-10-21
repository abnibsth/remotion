export const portfolioAssets = {
  desktop: "abni-portfolio/capture-1792245251714/desktop.png",
  mobile: "abni-portfolio/capture-1792245251714/mobile.png",
};

export const portfolioAt = (seconds: number) => {
  const t = ((seconds % 8) + 8) % 8;
  const p = Math.max(0, Math.min(1, (t - 3.65) / 0.65));
  return { mobileBlend: p * p * p * (p * (p * 6 - 15) + 10) };
};
