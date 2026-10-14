import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "./Art";
import { snapPixel } from "./motion";

export const Camera = ({ children, focusX = 135, focusY = 235, zoomFrom = 1, zoomTo = 1.12, duration = 6, screenY = 233 }: {
  children: React.ReactNode; focusX?: number; focusY?: number; zoomFrom?: number; zoomTo?: number; duration?: number; screenY?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, duration * fps], [zoomFrom, zoomTo], { ...ease, easing: Easing.inOut(Easing.cubic) });
  return <g transform={`translate(${snapPixel(130 - focusX * zoom)} ${snapPixel(screenY - focusY * zoom)}) scale(${zoom})`}>
    {children}
  </g>;
};

// Props, characters and the ground share the same island motion.
export const IslandMotion = ({ children }: { children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <g transform={`translate(0 ${snapPixel(Math.sin(frame / fps * 1.1) * 1.5)})`}>{children}</g>;
};
