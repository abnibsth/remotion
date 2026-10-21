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
import { noise, progress } from "./motion";

export const Chaos: React.FC = () => {
  const { frame, fps, t } = useClock();
  const burst = progress(t, 0.82, 1.5);
  return (
    <Stage bg={C.blue}>
      {Array.from({ length: 18 }, (_, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const x = 128 + col * 316;
        const y = 192 + row * 300;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 106,
              height: 106,
              translate: `${(noise(i + 1) - 0.5) * 700 * burst}px ${(noise(i + 30) - 0.5) * 650 * burst}px`,
              scale: pop(frame, fps, i * 0.018) * (1 + burst * noise(i + 40)),
              rotate: `${t * (i % 2 ? 80 : -80) + burst * 100}deg`,
              opacity: 0.32 + burst * 0.3,
            }}
          >
            {i % 3 === 0 ? (
              <Asterisk size={106} color={C.lime} />
            ) : i % 3 === 1 ? (
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  border: `17px solid ${C.paper}`,
                }}
              />
            ) : (
              <Arrow size={100} color={C.orange} />
            )}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 263,
          right: 170,
          textAlign: "center",
          rotate: `${-5 + progress(t, 0.8, 1.2) * 5}deg`,
          scale: pop(frame, fps, 0.15, 21),
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontSize: 196,
            lineHeight: 1.02,
            letterSpacing: -5,
            textShadow: `8px 9px 0 ${C.ink}`,
          }}
        >
          CONTROLLED
        </div>
        <div
          style={{
            fontFamily: display,
            fontSize: 310,
            lineHeight: 1.01,
            letterSpacing: -8,
            color: C.lime,
            textShadow: `10px 12px 0 ${C.ink}`,
          }}
        >
          CHAOS.
        </div>
      </div>
      <Label
        style={{
          position: "absolute",
          left: 800,
          top: 840,
          fontSize: 27,
          background: C.ink,
          padding: "14px 30px",
          rotate: "-3deg",
          scale: pop(frame, fps, 0.8),
        }}
      >
        EVERY MOVE. ON PURPOSE.
      </Label>
      <Corners title="RHYTHM & REACTION" number="05" />
      <Texture />
      <Exit at={2.18} color={C.paper} />
    </Stage>
  );
};
