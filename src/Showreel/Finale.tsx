import React from "react";
import {
  Asterisk,
  Arrow,
  C,
  Corners,
  display,
  Label,
  pop,
  Stage,
  Texture,
  useClock,
} from "./design";
import { progress } from "./motion";

export const Finale: React.FC = () => {
  const { frame, fps, t } = useClock();
  return (
    <Stage bg={C.paper} color={C.ink}>
      <div style={{ position: "absolute", left: 90, top: 231, right: 90 }}>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 242,
              letterSpacing: -5,
              lineHeight: 1,
              translate: `0 ${(1 - pop(frame, fps, 0.02, 24)) * 220}px`,
              opacity: progress(t, 0, 0.12),
            }}
          >
            MAKE IT
          </div>
          <Asterisk
            size={170}
            color={C.blue}
            rotate={90 * pop(frame, fps, 0.17, 20) + t * 12}
            style={{ marginLeft: 20, scale: pop(frame, fps, 0.12) }}
          />
          <Label
            style={{
              fontSize: 26,
              lineHeight: 1.5,
              marginLeft: 35,
              opacity: progress(t, 0.55, 0.85),
            }}
          >
            IDEAS INTO
            <br />
            MOVEMENT.
          </Label>
        </div>
        <div
          style={{
            position: "relative",
            marginTop: 13,
            height: 321,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: display,
              fontSize: 377,
              lineHeight: 0.85,
              letterSpacing: -8,
              translate: `0 ${(1 - pop(frame, fps, 0.18, 24)) * 340}px`,
            }}
          >
            MOVE<span style={{ color: C.blue }}>.</span>
          </div>
          <div
            style={{
              position: "absolute",
              right: 65,
              top: 57,
              width: 260,
              height: 192,
              borderRadius: 120,
              background: C.lime,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              rotate: "-8deg",
              scale: pop(frame, fps, 0.35),
            }}
          >
            <Arrow size={125} />
          </div>
        </div>
        <div
          style={{
            height: 2,
            background: C.ink,
            marginTop: 53,
            scale: `${progress(t, 0.5, 0.95)} 1`,
            transformOrigin: "left",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
            opacity: progress(t, 0.7, 1),
          }}
        >
          <Label style={{ fontSize: 29, letterSpacing: 4 }}>
            MOTION DESIGN / SHOWREEL
          </Label>
          <Label style={{ fontSize: 24 }}>15 SECONDS. NO STILL IDEAS.</Label>
        </div>
      </div>
      <Corners title="MAKE IT MOVE" number="06" dark />
      <Texture />
    </Stage>
  );
};
