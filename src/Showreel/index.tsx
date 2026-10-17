import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { Opening } from "./Opening";
import { Shapes } from "./Shapes";
import { Typography } from "./Typography";
import { Dimension } from "./Dimension";
import { Chaos } from "./Chaos";
import { Finale } from "./Finale";

export { Opening, Shapes, Typography, Dimension, Chaos, Finale };

export const MotionShowreel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#121414" }}>
      <Audio
        src={staticFile("showreel/score.wav")}
        premountFor={fps}
        volume={0.86}
      />
      <Series>
        <Series.Sequence
          name="01 / MAKE IT MOVE"
          durationInFrames={2 * fps}
          premountFor={fps}
        >
          <Opening />
        </Series.Sequence>
        <Series.Sequence
          name="02 / SHAPE SHIFT"
          durationInFrames={2.5 * fps}
          premountFor={fps}
        >
          <Shapes />
        </Series.Sequence>
        <Series.Sequence
          name="03 / TYPE IN MOTION"
          durationInFrames={2.5 * fps}
          premountFor={fps}
        >
          <Typography />
        </Series.Sequence>
        <Series.Sequence
          name="04 / BEYOND FLAT"
          durationInFrames={3 * fps}
          premountFor={fps}
        >
          <Dimension />
        </Series.Sequence>
        <Series.Sequence
          name="05 / CONTROLLED CHAOS"
          durationInFrames={2.5 * fps}
          premountFor={fps}
        >
          <Chaos />
        </Series.Sequence>
        <Series.Sequence
          name="06 / MAKE IT MOVE — FINALE"
          durationInFrames={2.5 * fps}
          premountFor={fps}
        >
          <Finale />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
