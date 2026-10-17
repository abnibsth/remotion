import React from "react";
import {
  Asterisk,
  C,
  Chrome,
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

export const Dimension: React.FC = () => {
  const { frame, fps, t } = useClock();
  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          width: 1250,
          height: 1050,
          left: 540,
          top: 0,
          background: "radial-gradient(ellipse,#304bff36,transparent 62%)",
        }}
      />
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", opacity: 0.19 }}
      >
        {Array.from({ length: 13 }, (_, i) => (
          <ellipse
            key={i}
            cx="1230"
            cy="550"
            rx={140 + i * 51}
            ry={90 + i * 32}
            fill="none"
            stroke={C.paper}
            strokeWidth="1"
            transform={`rotate(-28 1230 550)`}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 246,
          zIndex: 1,
          translate: `0 ${(1 - pop(frame, fps, 0.1, 24)) * 150}px`,
          opacity: progress(t, 0, 0.16),
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontSize: 192,
            lineHeight: 0.99,
            letterSpacing: -4,
          }}
        >
          BEYOND
          <br />
          <span style={{ color: C.lime }}>FLAT.</span>
        </div>
        <Label
          style={{
            fontSize: 26,
            marginTop: 54,
            lineHeight: 1.7,
            color: "#b0b5aa",
          }}
        >
          A little depth.
          <br />A different dimension.
        </Label>
      </div>
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 90,
          left: 900,
          top: 866,
          borderRadius: "50%",
          background: "#000",
          filter: "blur(35px)",
          scale: 0.8 + Math.sin(t * 1.7) * 0.08,
          opacity: 0.8,
        }}
      />
      <Chrome
        time={t + 0.8}
        size={1080}
        style={{
          position: "absolute",
          left: 685,
          top: 1,
          scale: pop(frame, fps, 0.05, 22) * (1 + t * 0.025),
          translate: `0 ${Math.sin(t * 1.7) * 22}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1510,
          top: 640,
          background: C.lime,
          color: C.ink,
          borderRadius: 80,
          padding: "22px 35px",
          fontSize: 26,
          fontWeight: 700,
          rotate: "-10deg",
          scale: pop(frame, fps, 0.65),
        }}
      >
        NOT SO FLAT ↗
      </div>
      <Asterisk
        size={76}
        color={C.lime}
        rotate={t * 50}
        style={{
          position: "absolute",
          left: 1620,
          top: 170,
          scale: pop(frame, fps, 0.55),
        }}
      />
      <Corners title="LIGHT / SPACE / FORM" number="04" />
      <Texture />
      <Exit at={2.68} color={C.blue} type="iris" />
    </Stage>
  );
};
