import React from "react";
import { interpolate } from "remotion";
import {
  Asterisk,
  C,
  Corners,
  display,
  Exit,
  Label,
  pop,
  Stage,
  Texture,
  useClock,
} from "./design";
import { progress } from "./motion";

export const Opening: React.FC = () => {
  const { frame, fps, t } = useClock();
  const zoom = 1 + progress(t, 1.48, 1.86) * 0.14;
  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(#f1f0e809 1px,transparent 1px),linear-gradient(90deg,#f1f0e809 1px,transparent 1px)",
          backgroundSize: "120px 120px",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 170,
          right: 76,
          scale: zoom,
          transformOrigin: "60% 50%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 292,
              letterSpacing: -5,
              lineHeight: 1.02,
              translate: `0 ${(1 - pop(frame, fps, 0, 23)) * 300}px`,
              opacity: progress(t, 0, 0.06),
            }}
          >
            MAKE
          </div>
          <div
            style={{
              height: 210,
              width: 462,
              background: C.lime,
              color: C.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              rotate: `${-7 + pop(frame, fps, 0.14) * 4}deg`,
              scale: pop(frame, fps, 0.14),
              borderRadius: 110,
            }}
          >
            <div style={{ fontFamily: display, fontSize: 205, lineHeight: 1 }}>
              IT
            </div>
          </div>
          <Asterisk
            size={200}
            rotate={t * 60}
            style={{ marginLeft: 25, scale: pop(frame, fps, 0.22) }}
          />
        </div>
        <div style={{ height: 360, overflow: "hidden", marginTop: 4 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 398,
              lineHeight: 0.91,
              letterSpacing: -8,
              color: C.lime,
              translate: `0 ${(1 - pop(frame, fps, 0.32, 23)) * 400}px`,
              whiteSpace: "nowrap",
            }}
          >
            MOVE
            <span style={{ fontSize: 230, marginLeft: 18, color: C.paper }}>
              ↗
            </span>
          </div>
        </div>
      </div>
      <Label
        style={{
          position: "absolute",
          right: 116,
          top: 476,
          width: 300,
          lineHeight: 1.7,
          fontSize: 25,
          opacity: progress(t, 0.6, 0.85),
          translate: `${interpolate(progress(t, 0.6, 0.95), [0, 1], [40, 0])}px 0`,
        }}
      >
        An exploration of
        <br />
        form, type & feeling.
      </Label>
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          bottom: 122,
          height: 2,
          background: "#f1f0e826",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress(t, 0.1, 1.65) * 100}%`,
            background: C.lime,
          }}
        />
      </div>
      <Corners title="THE SHOWREEL" number="01" />
      <Texture />
      <Exit at={1.7} color={C.lime} type="iris" />
    </Stage>
  );
};
