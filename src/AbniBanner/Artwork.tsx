import React from "react";
import { PortfolioScreen } from "./PortfolioScreen";
import { mix, roundedPath, smooth, spring, stateAt, wrapTime } from "./motion";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-400.css";

const C = {
  bg: "#101215",
  white: "#F2F3F0",
  lime: "#B8F36B",
  blue: "#7B8DFF",
  muted: "#92979C",
  line: "#30353A",
  surface: "#171B20",
};
const heading = "Space Grotesk, Arial, sans-serif";
const mono = "IBM Plex Mono, monospace";
const inter = "Inter, Arial, sans-serif";

const Mark: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
}> = ({ x, y, size = 22, color = C.lime }) => (
  <g
    transform={`translate(${x} ${y}) scale(${size / 24})`}
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 6L2 12L8 18M16 6L22 12L16 18M14 3L10 21" />
  </g>
);

export const AbniArtwork: React.FC<{ time: number }> = ({ time }) => {
  const t = wrapTime(time);
  const s = stateAt(t);
  const uiOpacity = smooth(t, 1.7, 2.12) * (1 - smooth(t, 7.2, 7.5));
  const nameSpring = spring(t - 5.5);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 1280 360"
      style={{ display: "block", background: C.bg }}
      aria-label="Abni Basit Munawar — From Code to Creation"
    >
      <defs>
        <pattern
          id="abni-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0H0V40" fill="none" stroke="#24292E" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="abni-light" cx="75%" cy="5%" r="70%">
          <stop offset="0" stopColor="#313B32" stopOpacity="0.26" />
          <stop offset="1" stopColor={C.bg} stopOpacity="0" />
        </radialGradient>
        <clipPath id="abni-screen">
          <path
            d={roundedPath(
              s.x + 3,
              s.y + 3,
              Math.max(0, s.width - 6),
              Math.max(0, s.height - 6),
              Math.max(0, s.radius - 3),
            )}
          />
        </clipPath>
        <clipPath id="abni-code">
          <rect x="144" y="214" width={s.typed * 233} height="35" />
        </clipPath>
        <clipPath id="abni-name">
          <rect x="135" y="95" width="650" height="93" />
        </clipPath>
      </defs>
      <rect width="1280" height="360" fill={C.bg} />
      <rect width="1280" height="360" fill="url(#abni-grid)" opacity="0.25" />
      <rect width="1280" height="360" fill="url(#abni-light)" />
      <path d="M128 39H1152M128 321H1152" stroke="#30353A" strokeWidth="0.6" />
      <Mark x={144} y={16} size={15} />
      <text
        x="172"
        y="27"
        fontFamily={mono}
        fontSize="10.5"
        letterSpacing="1"
        fill={C.white}
      >
        ABNI BASIT MUNAWAR
      </text>
      <text
        x="1136"
        y="27"
        textAnchor="end"
        fontFamily={mono}
        fontSize="11"
        fill={C.muted}
      >
        @abnibsth
      </text>
      <g opacity={s.intro} transform={`translate(${-(1 - s.intro) * 18} 0)`}>
        <text
          x="144"
          y="91"
          fontFamily={mono}
          fontSize="10"
          letterSpacing="2"
          fill={C.lime}
        >
          IDEAS, MADE REAL.
        </text>
        <text
          x="140"
          y="148"
          fontFamily={heading}
          fontWeight="700"
          fontSize="59"
          letterSpacing="-2.8"
          fill={C.white}
        >
          FROM CODE
        </text>
        <text
          x="140"
          y="204"
          fontFamily={heading}
          fontWeight="700"
          fontSize="59"
          letterSpacing="-2.8"
          fill={C.white}
        >
          TO CREATION<tspan fill={C.lime}>.</tspan>
        </text>
      </g>
      <g
        opacity={s.code}
        clipPath="url(#abni-code)"
        fontFamily={mono}
        fontSize="17"
      >
        <text x="144" y="239" fill={C.white}>
          <tspan fill={C.blue}>const</tspan>
          <tspan> idea </tspan>
          <tspan fill={C.muted}>= </tspan>
          <tspan fill={C.lime}>build</tspan>
          <tspan>();</tspan>
        </text>
      </g>
      <path
        d={`M${mix(377, 650, smooth(t, 1.5, 1.9))} 231H${s.x + 1}`}
        fill="none"
        stroke={C.lime}
        strokeWidth="1.5"
        opacity={s.connector}
      />
      <path
        d={roundedPath(
          s.x + 8 * s.shell,
          s.y + 12 * s.shell,
          s.width,
          s.height,
          s.radius,
        )}
        fill="#000"
        opacity={s.shell * 0.16}
      />
      <path
        d={roundedPath(s.x, s.y, s.width, s.height, s.radius)}
        fill={s.shell > 0 ? C.surface : C.lime}
        fillOpacity={Math.max(s.cursor, s.shell)}
        stroke={C.lime}
        strokeOpacity={mix(1, 0.35, s.shell)}
        strokeWidth={mix(1.3, 1, s.shell)}
      />
      <g clipPath="url(#abni-screen)" opacity={uiOpacity}>
        <g transform={`translate(${s.x} ${s.y})`}>
          <PortfolioScreen time={t} width={s.width} height={s.height} />
        </g>
      </g>
      <g opacity={s.identity}>
        <text
          x="144"
          y="91"
          fontFamily={mono}
          fontSize="10"
          letterSpacing="2"
          fill={C.lime}
        >
          FROM CODE TO CREATION
        </text>
        <g clipPath="url(#abni-name)">
          <text
            x="140"
            y={164 + (1 - nameSpring) * 90}
            fontFamily={heading}
            fontWeight="700"
            fontSize="76"
            letterSpacing="-4"
            fill={C.white}
          >
            ABNI BASIT<tspan fill={C.lime}>.</tspan>
          </text>
        </g>
        <path
          d={`M144 185H${144 + 82 * smooth(t, 5.7, 6.3)}`}
          stroke={C.lime}
          strokeWidth="2"
        />
        <text
          x="144"
          y="217"
          fontFamily={mono}
          fontSize="15"
          letterSpacing="2.1"
          fill={C.white}
        >
          FULL STACK DEVELOPER
        </text>
        <text x="144" y="248" fontFamily={inter} fontSize="16" fill={C.muted}>
          Building thoughtful digital experiences.
        </text>
        <text x="144" y="278" fontFamily={inter} fontSize="11.5" fill={C.muted}>
          UI/UX ENTHUSIAST
          <tspan dx="18" fill="#51575C">
            /
          </tspan>
          <tspan dx="18">SAAS BUILDER</tspan>
          <tspan dx="18" fill="#51575C">
            /
          </tspan>
          <tspan dx="18">MOBILE DEVELOPER</tspan>
        </text>
        <text x="144" y="303" fontFamily={mono} fontSize="14" fill={C.lime}>
          abnibasit.me ↗
        </text>
      </g>
      <g opacity={smooth(t, 2.36, 2.65) * (1 - smooth(t, 5.5, 5.9))}>
        <path d="M144 269H166" stroke={C.lime} strokeWidth="1.3" />
        <text
          x="178"
          y="273"
          fontFamily={mono}
          fontSize="11"
          letterSpacing="1.2"
          fill={C.muted}
        >
          WEB / MOBILE / SAAS
        </text>
      </g>
      <text
        x="144"
        y="341"
        fontFamily={mono}
        fontSize="9.5"
        letterSpacing="1.1"
        fill={C.muted}
      >
        DESIGN WITH INTENT. BUILD WITH CARE.
      </text>
      <text
        x="1136"
        y="341"
        textAnchor="end"
        fontFamily={mono}
        fontSize="9.5"
        letterSpacing="0.7"
        fill={C.muted}
      >
        PORTFOLIO / abnibasit.me
      </text>
    </svg>
  );
};
