import React from "react";
import {
  Asterisk,
  Arrow,
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

export const Shapes: React.FC = () => {
  const { frame, fps, t } = useClock();
  const shift = progress(t, 0.95, 1.65);
  return (
    <Stage bg={C.lime} color={C.ink}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: 710,
          top: -30,
          border: `1px solid ${C.ink}30`,
          borderRadius: "50%",
          scale: 0.85 + t * 0.1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 194,
          fontFamily: display,
          fontSize: 238,
          lineHeight: 0.98,
          letterSpacing: -5,
          translate: `${(1 - pop(frame, fps, 0.06, 24)) * -800}px 0`,
        }}
      >
        SHAPE
        <br />
        <span
          style={{ display: "inline-block", translate: `${shift * 58}px 0` }}
        >
          SHIFT.
        </span>
      </div>
      <Label
        style={{
          position: "absolute",
          left: 94,
          top: 754,
          lineHeight: 1.7,
          fontSize: 27,
        }}
      >
        Nothing stays still.
        <br />
        Not even the rules.
      </Label>
      <div
        style={{
          position: "absolute",
          left: 945,
          top: 180,
          width: 680,
          height: 680,
          scale: pop(frame, fps, 0.15),
          rotate: `${t * 30}deg`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 34,
            borderRadius: `${50 - shift * 40}%`,
            background: C.ink,
            rotate: `${shift * 90}deg`,
            boxShadow: "26px 36px 0 #12141420",
            scale: 1 - shift * 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 130,
            borderRadius: "50%",
            background: C.lime,
            scale: 1 - shift * 0.7,
          }}
        />
        <Asterisk
          size={500}
          color={C.blue}
          rotate={-t * 70}
          style={{
            position: "absolute",
            left: 90,
            top: 90,
            scale: progress(t, 0.9, 1.6),
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 148,
            height: 148,
            top: 250 + Math.sin(t * 3) * 250,
            left: 260 + Math.cos(t * 3) * 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 32% 25%,#fff7d8,#ff9b4d 30%,#ff683b 58%,#9a2711 95%)",
            boxShadow: "12px 20px 25px #12141430",
          }}
        />
      </div>
      <Arrow
        size={110}
        color={C.ink}
        style={{
          position: "absolute",
          right: 100,
          bottom: 130,
          rotate: `${90 * shift}deg`,
        }}
      />
      <Corners title="FORM EXPLORATION" number="02" dark />
      <Texture />
      <Exit at={2.18} color={C.paper} type="slash" />
    </Stage>
  );
};
