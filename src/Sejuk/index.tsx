import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "@fontsource/anton/latin-400.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/inter/latin-900.css";
import { C } from "./art";
import { Calm, Ghost, Hook, Price, Wait } from "./Problems";
import { End, Gag, Reveal, UI } from "./Brand";
import {
  clamp,
  hash,
  posterized,
  sceneAt,
  shake,
  spring,
  visualTime,
} from "./motion";

const Transitions = ({ t }: { t: number }) => (
  <>
    {[3, 7.5, 11.5].map((c) => {
      const u = t - c;
      if (u < -0.35 || u > 0.45) return null;
      return (
        <g key={c} transform="rotate(-18 540 960)">
          {[0, 1].map((i) => (
            <rect
              key={i}
              x={
                -1900 +
                2400 * spring(u + 0.3 - i * 0.045, 300, 30) +
                2200 * spring(u - i * 0.045, 300, 30)
              }
              y="-400"
              width="1750"
              height="2800"
              fill={i ? C.navy : C.yellow}
            />
          ))}
        </g>
      );
    })}
    {t > 14.72 &&
      t < 15.36 &&
      Array.from({ length: 6 }, (_, i) => {
        const u = t - 15 + i * 0.025;
        return (
          <rect
            key={i}
            x={i * 180}
            y={
              -2100 +
              2100 * spring(u + 0.22, 500, 35) +
              2100 * spring(u, 400, 30)
            }
            width="181"
            height="2100"
            fill={i % 2 ? C.yellow : C.cream}
          />
        );
      })}
    {t >= 16.5 && t < 16.68 && (
      <rect
        width="1080"
        height="1920"
        fill="white"
        opacity={clamp(1 - (t - 16.5) / 0.18)}
      />
    )}
    {t >= 24.25 && t < 24.25 + 1 / 30 && (
      <rect width="1080" height="1920" fill="white" />
    )}
    {t > 26.3 && t < 26.7 && (
      <rect
        width="1080"
        height="1920"
        fill={C.yellow}
        opacity={Math.max(0, 1 - Math.abs(t - 26.5) / 0.2)}
      />
    )}
  </>
);
export const SejukFrame = ({ time }: { time: number }) => {
  const t = clamp(time, 0, 28.99999),
    v = visualTime(t),
    scene = sceneAt(t),
    p = posterized(t);
  const start =
    scene === "hook"
      ? 0
      : scene === "wait"
        ? 3
        : scene === "price"
          ? 7.5
          : scene === "ghost"
            ? 11.5
            : scene === "calm"
              ? 15
              : scene === "reveal"
                ? 16.5
                : scene === "ui"
                  ? 19.5
                  : scene === "gag"
                    ? 23.5
                    : 26.5;
  const u = v - start;
  const boil = p ? hash(Math.floor(v * 8)) * 4 - 2 : 0;
  const hit = shake(t, 10, 13) + shake(t, 24.25, 19) + shake(t, 25.75, 12);
  const zoom =
    scene === "calm" || scene === "ui" || scene === "end"
      ? 1
      : 1 +
        Math.min(u, 4) * 0.008 +
        (scene === "gag" ? clamp(spring(u - 0.75, 300, 24)) * 0.018 : 0);
  const inverted = t >= 24.25 + 1 / 30 && t < 24.25 + 3 / 30;
  const main =
    scene === "hook" ? (
      <Hook t={u} />
    ) : scene === "wait" ? (
      <Wait t={u} />
    ) : scene === "price" ? (
      <Price t={u} />
    ) : scene === "ghost" ? (
      <Ghost t={u} />
    ) : scene === "calm" ? (
      <Calm t={u} />
    ) : scene === "reveal" ? (
      <Reveal t={u} />
    ) : scene === "ui" ? (
      <UI t={u} />
    ) : scene === "gag" ? (
      <Gag t={u} />
    ) : (
      <End t={u} />
    );
  return (
    <AbsoluteFill
      style={{
        background: C.navy,
        overflow: "hidden",
        fontFamily: "Inter",
        filter: inverted
          ? "invert(1)"
          : p
            ? "contrast(1.10) saturate(1.08)"
            : "none",
      }}
    >
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="warm-light" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={C.gold} stopOpacity=".8" />
            <stop offset="1" stopColor={C.gold} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cold-light" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={C.ice} />
            <stop offset="1" stopColor={C.ice} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="vignette">
            <stop offset=".35" stopColor={C.out} stopOpacity="0" />
            <stop offset="1" stopColor={C.out} stopOpacity=".6" />
          </radialGradient>
          <pattern
            id="halftone"
            width="19"
            height="19"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="9" cy="9" r="3" fill={C.ice} />
          </pattern>
          <clipPath id="gag-iris">
            <circle
              cx="770"
              cy="1440"
              r={t >= 23.5 ? 2260 * clamp(spring(t - 23.5, 170, 28)) : 2260}
            />
          </clipPath>
        </defs>
        <g
          transform={`translate(${boil + hit} ${boil * 0.7}) translate(520 960) scale(${zoom}) translate(-520 -960)`}
        >
          {scene === "gag" && t < 24.05 ? (
            <>
              <UI t={3.99} />
              <g clipPath="url(#gag-iris)">{main}</g>
            </>
          ) : (
            main
          )}
        </g>
        <rect
          width="1080"
          height="1920"
          fill="url(#vignette)"
          opacity={scene === "calm" ? 0.17 : 0.65}
        />
        <Transitions t={t} />
      </svg>
      <svg
        width="1500"
        height="2400"
        style={{
          position: "absolute",
          left: -hash(Math.floor(v * 15)) * 400,
          top: -hash(Math.floor(v * 15) + 3) * 400,
          opacity: p ? 0.27 : 0.13,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <image
          href={staticFile("sejuk/grain.png")}
          width="1500"
          height="2400"
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </AbsoluteFill>
  );
};
export const SejukSigap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <SejukFrame time={frame / fps} />
      <Audio src={staticFile("sejuk/audio/mix-normalized.wav")} />
    </>
  );
};
