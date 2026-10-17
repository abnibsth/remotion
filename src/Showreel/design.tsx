import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { noise, progress, torusMesh } from "./motion";
import "@fontsource/anton/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";

export const C = {
  ink: "#121414",
  paper: "#f1f0e8",
  lime: "#d3ff3f",
  blue: "#304bff",
  orange: "#ff683b",
  muted: "#858b82",
};
export const display = "Anton, Impact, sans-serif";
export const sans = "Space Grotesk, Arial, sans-serif";
export const useClock = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};
export const pop = (frame: number, fps: number, delay = 0, damping = 17) =>
  spring({
    frame: frame - delay * fps,
    fps,
    config: { damping, stiffness: 180, mass: 0.8 },
  });

export const Stage: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
}> = ({ children, bg = C.ink, color = C.paper }) => (
  <AbsoluteFill
    style={{ background: bg, color, fontFamily: sans, overflow: "hidden" }}
  >
    {children}
  </AbsoluteFill>
);

export const Texture: React.FC = () => {
  const { frame } = useClock();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: 0.055,
        mixBlendMode: "soft-light",
        translate: `${noise(Math.floor(frame / 4)) * 16 - 8}px ${noise(Math.floor(frame / 4) + 10) * 16 - 8}px`,
        scale: 1.03,
      }}
    >
      <svg width="100%" height="100%">
        <filter id="showreel-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#showreel-grain)"
          opacity="0.85"
        />
      </svg>
    </AbsoluteFill>
  );
};

export const Label: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      fontFamily: sans,
      fontWeight: 500,
      fontSize: 22,
      letterSpacing: 3,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Corners: React.FC<{
  number: string;
  title: string;
  dark?: boolean;
}> = ({ number, title, dark }) => (
  <>
    <Label
      style={{
        position: "absolute",
        left: 80,
        top: 58,
        color: dark ? C.ink : C.paper,
      }}
    >
      M—M / {title}
    </Label>
    <Label
      style={{
        position: "absolute",
        right: 80,
        top: 58,
        color: dark ? C.ink : C.paper,
      }}
    >
      VOL. 01 <span style={{ opacity: 0.5 }}> / </span> {number}
    </Label>
    <Label
      style={{
        position: "absolute",
        left: 80,
        bottom: 52,
        color: dark ? C.ink : C.paper,
        fontSize: 18,
      }}
    >
      INDEPENDENT MOTION EXPERIMENT
    </Label>
    <Label
      style={{
        position: "absolute",
        right: 80,
        bottom: 52,
        color: dark ? C.ink : C.paper,
        fontSize: 18,
      }}
    >
      DESIGN IN EVERY FRAME ↗
    </Label>
  </>
);

export const Asterisk: React.FC<{
  size?: number;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ size = 180, color = C.lime, rotate = 0, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    style={{ rotate: `${rotate}deg`, overflow: "visible", ...style }}
  >
    {Array.from({ length: 8 }, (_, i) => (
      <rect
        key={i}
        x="87"
        y="5"
        width="26"
        height="95"
        rx="4"
        fill={color}
        transform={`rotate(${i * 45} 100 100)`}
      />
    ))}
  </svg>
);

export const Arrow: React.FC<{
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size = 200, color = C.ink, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path
      d="M12 88L83 17M13 17H83V87"
      fill="none"
      stroke={color}
      strokeWidth="14"
      strokeLinejoin="miter"
    />
  </svg>
);

export const Chrome: React.FC<{
  time: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ time, size = 900, style }) => (
  <svg
    viewBox="-460 -460 920 920"
    width={size}
    height={size}
    style={{ overflow: "visible", ...style }}
  >
    {torusMesh(time).map((patch, i) => (
      <path
        key={i}
        d={patch.d}
        fill={patch.fill}
        stroke={patch.fill}
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
    ))}
  </svg>
);

export const Exit: React.FC<{
  at: number;
  color: string;
  type?: "bars" | "iris" | "slash";
}> = ({ at, color, type = "bars" }) => {
  const { t } = useClock();
  if (t < at) return null;
  if (type === "iris")
    return (
      <AbsoluteFill
        style={{
          background: color,
          zIndex: 20,
          clipPath: `circle(${progress(t, at, at + 0.23) * 125}% at 72% 50%)`,
        }}
      />
    );
  if (type === "slash")
    return (
      <AbsoluteFill
        style={{
          background: color,
          zIndex: 20,
          translate: `${interpolate(progress(t, at, at + 0.24), [0, 1], [-130, 0])}% 0`,
          transform: "skewX(-15deg)",
          width: "135%",
          left: "-17%",
        }}
      />
    );
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row", zIndex: 20 }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            width: "12.6%",
            height: "100%",
            background: color,
            translate: `0 ${(1 - progress(t, at + i * 0.012, at + i * 0.012 + 0.17)) * (i % 2 ? 105 : -105)}%`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
