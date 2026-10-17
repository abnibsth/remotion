import React from "react";
import { mix, smooth, spring } from "./motion";

const white = "#F2F3F0";
const lime = "#B8F36B";
const muted = "#92979C";
const line = "#30353A";
const sans = "Space Grotesk, Arial, sans-serif";
const inter = "Inter, Arial, sans-serif";
const mono = "IBM Plex Mono, monospace";

// One layout, with the same authored elements repositioned at the mobile breakpoint.
export const Interface: React.FC<{ time: number }> = ({ time: t }) => {
  const m = smooth(t, 3.5, 4.48);
  const lerp = (a: number, b: number) => mix(a, b, m);
  const x = lerp(22, 13);
  const tap = smooth(t, 4.78, 4.95) * (1 - smooth(t, 5.08, 5.28));
  const cardX = lerp(272, 13);
  const cardY = mix(89, 121, smooth(t, 3.5, 3.92));
  const cardW = lerp(68, 106);
  const cardH = lerp(115, 66);
  return (
    <g>
      <g opacity={1 - smooth(t, 3.5, 3.85)}>
        <path d="M0 32H440" stroke={line} />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={17 + i * 9}
            cy="16"
            r="2"
            fill={i ? "#51565B" : lime}
          />
        ))}
        <rect x="125" y="10" width="190" height="12" rx="4" fill="#242930" />
        <text
          x="220"
          y="19"
          textAnchor="middle"
          fontFamily={mono}
          fontSize="6.5"
          fill={muted}
        >
          a place for your next idea
        </text>
      </g>
      <g opacity={m}>
        <rect x="44" y="9" width="44" height="8" rx="4" fill="#080A0C" />
        <text x="12" y="17" fontFamily={inter} fontSize="5.5" fill={muted}>
          9:41
        </text>
        <path d="M106 12H118M108 15H118" stroke={muted} strokeWidth="1.2" />
        <rect x="47" y="240" width="38" height="3" rx="1.5" fill="#59605F" />
      </g>
      <g
        opacity={smooth(t, 1.8, 2.2)}
        transform={`translate(0 ${12 * (1 - spring(t - 1.8))})`}
      >
        <g
          transform={`translate(${x} ${lerp(47, 31)})`}
          fill="none"
          stroke={lime}
          strokeWidth="1.2"
        >
          <path d="M5 0L0 5L5 10M10 0L15 5L10 10M9 -2L6 12" />
        </g>
        <text
          x={lerp(44, 34)}
          y={lerp(57, 41)}
          fontFamily={sans}
          fontSize={lerp(12, 10)}
          fill={white}
        >
          idea.
        </text>
        <g opacity={1 - smooth(t, 3.5, 3.85)}>
          <text x="278" y="56" fontFamily={inter} fontSize="7" fill={muted}>
            Work
          </text>
          <text x="312" y="56" fontFamily={inter} fontSize="7" fill={muted}>
            About
          </text>
          <rect x="354" y="44" width="64" height="20" rx="5" fill={lime} />
          <text
            x="386"
            y="57"
            textAnchor="middle"
            fontFamily={inter}
            fontSize="7"
            fill="#101215"
          >
            Let's build ↗
          </text>
        </g>
        <path d="M108 33H119M108 38H119" opacity={m} stroke={muted} />
      </g>
      <g
        opacity={smooth(t, 1.94, 2.25)}
        transform={`translate(0 ${14 * (1 - spring(t - 1.94))})`}
      >
        <text
          x={x}
          y={lerp(93, 68)}
          fontFamily={mono}
          fontSize={lerp(7, 5)}
          letterSpacing={lerp(1.1, 0.7)}
          fill={lime}
        >
          MADE FOR WHAT'S NEXT
        </text>
        <text
          x={x}
          y={lerp(120, 88)}
          fontFamily={sans}
          fontSize={lerp(24, 16)}
          letterSpacing={lerp(-0.8, -0.5)}
          fill={white}
        >
          Good ideas.
        </text>
        <text
          x={x}
          y={lerp(146, 107)}
          fontFamily={sans}
          fontSize={mix(24, 11.5, smooth(t, 3.5, 3.92))}
          letterSpacing="-0.5"
          fill={white}
        >
          Thoughtfully built.
        </text>
        <text
          x={x}
          y="164"
          fontFamily={inter}
          fontSize="7.5"
          fill={muted}
          opacity={1 - smooth(t, 3.5, 3.85)}
        >
          A better experience starts with a little intention.
        </text>
        <rect
          x={x}
          y={lerp(181, 199)}
          width={lerp(85, 106)}
          height={lerp(23, 26)}
          rx={lerp(5, 6)}
          fill={lime}
          opacity={1 - tap * 0.15}
        />
        <text
          x={lerp(64, 66)}
          y={lerp(196, 215)}
          textAnchor="middle"
          fontFamily={inter}
          fontSize={lerp(8, 7.5)}
          fill="#101215"
        >
          Explore the idea ↗
        </text>
        <circle
          cx={lerp(90, 103)}
          cy={lerp(195, 215)}
          r={4 + tap * 9}
          fill="none"
          stroke="#101215"
          opacity={tap * 0.6}
        />
      </g>
      <g
        opacity={smooth(t, 2.06, 2.4)}
        transform={`translate(${cardX} ${cardY + 20 * (1 - spring(t - 2.06))})`}
      >
        <rect
          width={cardW}
          height={cardH}
          rx="7"
          fill="#232B27"
          stroke={line}
        />
        <rect
          x={lerp(9, 0)}
          y={lerp(10, 0)}
          width={lerp(50, 106)}
          height={lerp(56, 66)}
          rx="5"
          fill="#2B382B"
        />
        <g
          transform={`translate(${cardW / 2} ${lerp(38, 33)}) scale(${lerp(1, 1.4)})`}
          stroke={lime}
          strokeWidth="1.1"
          fill="none"
        >
          <circle r="15" />
          <ellipse rx="7" ry="15" />
          <path d="M-15 0H15M-13 -7H13M-13 7H13" />
        </g>
        <g opacity={1 - smooth(t, 3.5, 3.85)}>
          <text x="9" y="82" fontFamily={sans} fontSize="8" fill={white}>
            Digital craft
          </text>
          <path d="M9 91H56M9 97H44" stroke="#58615D" strokeWidth="2" />
        </g>
      </g>
      <g
        opacity={smooth(t, 2.18, 2.52) * (1 - smooth(t, 3.5, 3.85))}
        transform={`translate(${lerp(349, 140)} ${89 + 20 * (1 - spring(t - 2.18))})`}
      >
        <rect width="68" height="115" rx="7" fill="#20252A" stroke={line} />
        <rect x="9" y="10" width="50" height="56" rx="4" fill="#2A3048" />
        <path
          d="M20 49L31 28L43 49Z"
          fill="none"
          stroke="#7B8DFF"
          strokeWidth="2"
        />
        <text x="9" y="82" fontFamily={sans} fontSize="8" fill={white}>
          Built to grow
        </text>
        <path d="M9 91H56M9 97H44" stroke="#58615D" strokeWidth="2" />
      </g>
    </g>
  );
};
