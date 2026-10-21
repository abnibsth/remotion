import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { AbniArtwork } from "../../src/AbniBanner/Artwork";
import { staticFile } from "remotion";
import { portfolioAssets } from "../../src/AbniBanner/portfolio";

declare global {
  interface Window {
    seek: (time: number) => Promise<void>;
    ready: Promise<void>;
  }
}
const element = document.getElementById("root");
if (!element) throw new Error("Missing preview root");
const root = createRoot(element);
window.seek = async (time) => {
  if (!Number.isFinite(time)) throw new Error("Seek time must be finite");
  flushSync(() => root.render(<AbniArtwork key={time} time={time} />));
};
window.ready = (async () => {
  await window.seek(0);
  await Promise.all([
    document.fonts.load('700 76px "Space Grotesk"'),
    document.fonts.load('400 17px "IBM Plex Mono"'),
    document.fonts.load("400 16px Inter"),
  ]);
  await document.fonts.ready;
  await Promise.all(
    Object.values(portfolioAssets).map(async (file) => {
      const image = new Image();
      image.src = staticFile(file);
      await image.decode();
    }),
  );
  for (const name of ["Space Grotesk", "IBM Plex Mono", "Inter"]) {
    if (
      ![...document.fonts].some(
        (face) =>
          face.family.replace(/"/g, "") === name && face.status === "loaded",
      )
    )
      throw new Error(`Font missing: ${name}`);
  }
})();
