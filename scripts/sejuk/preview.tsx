import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import "@fontsource/anton/latin-400.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-900.css";
import { SejukFrame } from "../../src/Sejuk";
import { staticFile } from "remotion";

declare global {
  interface Window {
    seek: (t: number) => Promise<void>;
    ready: Promise<void>;
  }
}

const element = document.getElementById("root");
if (!element) throw new Error("Missing preview root");
const root = createRoot(element);
window.seek = async (time: number) => {
  if (!Number.isFinite(time)) throw new Error("Seek time must be finite");
  flushSync(() => root.render(<SejukFrame key={time} time={time} />));
};
window.ready = (async () => {
  await Promise.all([
    document.fonts.load("400 100px Anton"),
    ...[400, 600, 700, 900].map((weight) =>
      document.fonts.load(`${weight} 40px Inter`),
    ),
  ]);
  await document.fonts.ready;
  const grain = new Image();
  grain.src = staticFile("sejuk/grain.png");
  await grain.decode();
  if (
    !document.fonts.check("400 100px Anton") ||
    ![400, 600, 700, 900].every((weight) =>
      document.fonts.check(`${weight} 40px Inter`),
    )
  ) {
    throw new Error("Required Anton or Inter font failed to load");
  }
  window.seek(0);
})();
