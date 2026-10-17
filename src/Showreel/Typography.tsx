import React from "react";
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

export const Typography: React.FC = () => {
  const { frame, fps, t } = useClock();
  const settle = progress(t, 0.75, 1.35);
  return (
    <Stage bg={C.paper} color={C.ink}>
      <div
        style={{
          position: "absolute",
          inset: "-180px -200px",
          rotate: `${-10 + settle * 10}deg`,
          scale: 1.12 - settle * 0.12,
          translate: `${(1 - pop(frame, fps, 0, 26)) * 1200}px 0`,
        }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: i * 260 - 20,
              left: -300,
              fontFamily: display,
              fontSize: 280,
              letterSpacing: -6,
              lineHeight: 1,
              whiteSpace: "nowrap",
              color: i === 2 ? C.ink : "transparent",
              WebkitTextStroke: i === 2 ? undefined : `2px ${C.ink}45`,
              translate: `${(i % 2 ? -1 : 1) * (t * 160 + (1 - settle) * 150)}px 0`,
            }}
          >
            TYPE IN MOTION TYPE IN MOTION
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 612,
          height: 155,
          background: C.blue,
          rotate: `${-5 + settle * 2}deg`,
          scale: `${pop(frame, fps, 0.55, 24)} 1`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 38,
          boxShadow: "0 20px 40px #12141415",
        }}
      >
        <Asterisk size={86} color={C.lime} rotate={t * 110} />
        <div
          style={{
            fontSize: 67,
            fontWeight: 700,
            letterSpacing: -3,
            color: C.paper,
          }}
        >
          WORDS WITH A PULSE.
        </div>
        <Asterisk size={86} color={C.lime} rotate={-t * 110} />
      </div>
      <Label
        style={{
          position: "absolute",
          top: 150,
          right: 90,
          fontSize: 23,
          padding: "10px 22px",
          background: C.paper,
          border: `1px solid ${C.ink}`,
        }}
      >
        READ IT. FEEL IT.
      </Label>
      <Corners title="KINETIC TYPOGRAPHY" number="03" dark />
      <Texture />
      <Exit at={2.18} color={C.ink} />
    </Stage>
  );
};
