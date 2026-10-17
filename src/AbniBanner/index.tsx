import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AbniArtwork } from "./Artwork";

export const AbniBanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#101215" }}>
      <AbniArtwork time={frame / fps} />
    </AbsoluteFill>
  );
};
