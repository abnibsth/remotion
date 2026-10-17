import React from "react";
import { hash, spring } from "./motion";
export const C = {
  navy: "#141235",
  navy2: "#23205A",
  navy3: "#34307A",
  out: "#17132E",
  cream: "#F7EEDB",
  yellow: "#FFD21F",
  gold: "#F2A516",
  red: "#FF3B30",
  red2: "#B81F2A",
  skin: "#EDB08A",
  skin2: "#C98463",
  ice: "#BCECE8",
};
export const Pop = ({
  x = 0,
  y = 0,
  t,
  delay = 0,
  children,
  k = 300,
  d = 22,
}: {
  x?: number;
  y?: number;
  t: number;
  delay?: number;
  children: React.ReactNode;
  k?: number;
  d?: number;
}) => {
  const s = spring(t - delay, k, d);
  return (
    <g
      opacity={t < delay ? 0 : 1}
      transform={`translate(${x} ${y}) scale(${s})`}
    >
      {children}
    </g>
  );
};
export const Sh = ({
  id,
  shape,
  fill,
  shade,
  sw = 6,
}: {
  id: string;
  shape: React.ReactNode;
  fill: string;
  shade: string;
  sw?: number;
}) => (
  <g>
    <defs>
      <clipPath id={id}>{shape}</clipPath>
    </defs>
    <g clipPath={`url(#${id})`}>
      <g fill={shade}>{shape}</g>
      <g fill={fill} transform="translate(-18 -17)">
        {shape}
      </g>
    </g>
    <g fill="none" stroke={C.out} strokeWidth={sw} strokeLinejoin="round">
      {shape}
    </g>
  </g>
);
export const Type = ({
  x = 80,
  y,
  size = 110,
  children,
  fill = C.cream,
  anchor = "start",
  extrude = false,
  rotate = 0,
}: {
  x?: number;
  y: number;
  size?: number;
  children: React.ReactNode;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  extrude?: boolean;
  rotate?: number;
}) => (
  <text
    x={x}
    y={y}
    transform={`rotate(${rotate} ${x} ${y})`}
    textAnchor={anchor}
    fill={fill}
    fontSize={size}
    fontFamily="Anton"
    letterSpacing="-1"
    style={
      extrude
        ? {
            paintOrder: "stroke",
            stroke: C.out,
            strokeWidth: 3,
            filter: `drop-shadow(2px 2px 0 ${C.red2}) drop-shadow(3px 3px 0 ${C.red2}) drop-shadow(3px 3px 0 ${C.red2}) drop-shadow(8px 15px 8px #08061999)`,
          }
        : {}
    }
  >
    {children}
  </text>
);
export const Sans = ({
  x = 80,
  y,
  size = 30,
  children,
  fill = C.cream,
  anchor = "start",
  spacing = 0,
}: {
  x?: number;
  y: number;
  size?: number;
  children: React.ReactNode;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  spacing?: number;
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={fill}
    fontFamily="Inter"
    fontWeight="900"
    fontSize={size}
    letterSpacing={spacing}
  >
    {children}
  </text>
);
export const Kicker = ({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <g>
    <path d="M80 184h40" stroke={dark ? C.navy : C.yellow} strokeWidth="9" />
    <Sans x={141} y={195} size={25} fill={dark ? C.navy : C.yellow} spacing={4}>
      {children}
    </Sans>
  </g>
);
export const Rise = ({
  t,
  delay = 0,
  y,
  children,
}: {
  t: number;
  delay?: number;
  y: number;
  children: React.ReactNode;
}) => (
  <svg x="50" y={y} width="910" height="160" overflow="hidden">
    <g
      opacity={t < delay ? 0 : 1}
      transform={`translate(0 ${155 * (1 - spring(t - delay, 170, 28))})`}
    >
      {children}
    </g>
  </svg>
);
export const Tape = ({
  x = 100,
  y = 550,
  w = 500,
  children,
  t = 1,
}: {
  x?: number;
  y?: number;
  w?: number;
  children: React.ReactNode;
  t?: number;
}) => (
  <g
    transform={`translate(${x} ${y}) rotate(-5) scale(${Math.max(0, spring(t, 300, 23))} 1)`}
    opacity={t < 0 ? 0 : 1}
  >
    <path
      d={`M0 6 L22 0 L${w - 12} 0 L${w} 13 L${w - 9} 29 L${w} 48 L${w - 14} 69 L${w} 89 L${w - 24} 94 L9 94 L0 81 L9 63 L0 45 L10 25Z`}
      fill={C.yellow}
    />
    <Sans x={w / 2} y={65} size={51} anchor="middle" fill={C.navy}>
      {children}
    </Sans>
  </g>
);
export const Bubble = ({
  x,
  y,
  w = 590,
  children,
  t = 1,
  size = 40,
}: {
  x: number;
  y: number;
  w?: number;
  children: React.ReactNode;
  t?: number;
  size?: number;
}) => (
  <Pop x={x} y={y} t={t}>
    <path
      d={`M23 12H${w - 22}Q${w} 12 ${w} 40V124Q${w} 148 ${w - 25} 148H100L50 186L62 148H25Q0 148 0 123V39Q0 12 23 12Z`}
      transform="translate(9 12)"
      fill={C.red2}
    />
    <path
      d={`M23 0H${w - 22}Q${w} 0 ${w} 28V112Q${w} 136 ${w - 25} 136H100L50 174L62 136H25Q0 136 0 111V27Q0 0 23 0Z`}
      fill={C.cream}
      stroke={C.out}
      strokeWidth="6"
    />
    <Sans x={w / 2} y={83} size={size} anchor="middle" fill={C.navy}>
      {children}
    </Sans>
  </Pop>
);
export const Stamp = ({
  t,
  text,
  x = 510,
  y = 1280,
  size = 87,
}: {
  t: number;
  text: string;
  x?: number;
  y?: number;
  size?: number;
}) => (
  <Pop x={x} y={y} t={t} k={300} d={17}>
    <g
      transform={`rotate(-11) scale(${1 + 1.4 * Math.exp(-10 * Math.max(0, t))})`}
    >
      <rect
        x="-376"
        y="-83"
        width="752"
        height="130"
        rx="9"
        fill={C.cream}
        stroke={C.red}
        strokeWidth="12"
      />
      <rect
        x="-361"
        y="-68"
        width="722"
        height="100"
        rx="3"
        fill="none"
        stroke={C.red}
        strokeWidth="3"
      />
      <Type x={0} y={18} size={size} anchor="middle" fill={C.red}>
        {text}
      </Type>
    </g>
  </Pop>
);
export const Snow = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g
    transform={`translate(${x} ${y}) scale(${s})`}
    stroke={C.ice}
    strokeWidth="7"
    strokeLinecap="round"
  >
    {[0, 60, 120].map((r) => (
      <g key={r} transform={`rotate(${r})`}>
        <path d="M-40 0h80M-29 -12l12 12-12 12M29 -12L17 0l12 12" fill="none" />
      </g>
    ))}
  </g>
);
export const AC = ({
  x = 150,
  y = 560,
  cold = false,
  t = 0,
}: {
  x?: number;
  y?: number;
  cold?: boolean;
  t?: number;
}) => (
  <g transform={`translate(${x} ${y})`}>
    <Sh
      id="ac-body"
      fill={C.cream}
      shade="#AAA6BE"
      shape={<rect width="610" height="158" rx="34" />}
    />
    <path d="M35 105H574M56 127H554" stroke={C.out} strokeWidth="7" />
    <circle cx="552" cy="58" r="8" fill={cold ? C.ice : C.red} />
    <Sans x={475} y={65} size={23} fill={C.navy}>
      {cold ? "18°" : "--"}
    </Sans>
    {cold &&
      [0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${120 + i * 170} 170 Q${80 + i * 170 + Math.sin(t * 4) * 25} 250 ${140 + i * 170} 340`}
          stroke={C.ice}
          strokeWidth="18"
          opacity=".7"
          fill="none"
        />
      ))}
  </g>
);
export const Character = ({
  x = 510,
  y = 1030,
  s = 1,
  t = 0,
  mood = "hot",
  raisin = 0,
  tech = false,
}: {
  x?: number;
  y?: number;
  s?: number;
  t?: number;
  mood?: "hot" | "calm" | "cold" | "waiting";
  raisin?: number;
  tech?: boolean;
}) => (
  <g
    transform={`translate(${x} ${y}) scale(${s * (1 - raisin * 0.43)} ${s * (1 - raisin * 0.25)}) rotate(${mood === "cold" ? -6 : Math.sin(t * 2) * 1.2})`}
  >
    <ellipse cx="0" cy="320" rx="170" ry="35" fill={C.out} opacity=".5" />
    <path
      d="M-67 165L-102 300M67 165L107 300"
      stroke={C.out}
      strokeWidth="68"
      strokeLinecap="round"
    />
    <path
      d="M-104 298l-47 8M106 298l48 4"
      stroke={C.cream}
      strokeWidth="43"
      strokeLinecap="round"
    />
    <Sh
      id={tech ? "tech-body" : "person-body"}
      fill={tech ? C.yellow : C.navy3}
      shade={tech ? C.gold : C.navy2}
      shape={
        <path d="M-80 -40Q-135 -15-131 94L-108 190Q0 220 112 185L130 80Q131-24 76-43Z" />
      }
    />
    <path
      d={
        mood === "cold"
          ? "M-110 0Q-180 -100-206 -146M112 0Q192-69 198-150"
          : tech
            ? "M-111 0L-175 142M112 0L184 133"
            : "M-110 0Q-185 50-194 121M113 0Q175 38 187 86"
      }
      fill="none"
      stroke={C.out}
      strokeWidth="55"
      strokeLinecap="round"
    />
    <path
      d={
        mood === "cold"
          ? "M-110 0Q-180 -100-206 -146M112 0Q192-69 198-150"
          : tech
            ? "M-111 0L-175 142M112 0L184 133"
            : "M-110 0Q-185 50-194 121M113 0Q175 38 187 86"
      }
      fill="none"
      stroke={C.skin}
      strokeWidth="40"
      strokeLinecap="round"
    />
    <Sh
      id={tech ? "tech-neck" : "person-neck"}
      fill={C.skin}
      shade={C.skin2}
      shape={<rect x="-32" y="-100" width="64" height="85" rx="20" />}
    />
    <Sh
      id={tech ? "tech-head" : "person-head"}
      fill={raisin > 0.3 ? "#A46D82" : C.skin}
      shade={raisin > 0.3 ? "#694559" : C.skin2}
      shape={
        <path d="M-102-224Q-99-300 1-302Q103-301 105-219L96-132Q77-66 0-64Q-83-68-101-139Z" />
      }
    />
    <path
      d={
        mood === "cold"
          ? "M-107-219L-147-282-61-272-90-335-8-293 54-350 67-294 116-322 104-218 52-247-10-229-48-253Z"
          : "M-106-211Q-137-302-55-324Q-14-358 38-317Q125-325 111-213L69-236 27-263Q-35-221-106-211Z"
      }
      fill={C.out}
    />
    {tech && (
      <g>
        <path
          d="M-120-250Q-115-351 14-346Q113-340 115-263L150-242H-120Z"
          fill={C.yellow}
          stroke={C.out}
          strokeWidth="7"
        />
        <path d="M-24-339V-268" stroke={C.gold} strokeWidth="17" />
      </g>
    )}
    <path
      d={
        mood === "calm"
          ? "M-70-176Q-49-194-28-176M29-176Q48-194 70-176"
          : "M-73-191L-30-181M31-180L75-193"
      }
      stroke={C.out}
      strokeWidth="10"
      fill="none"
      strokeLinecap="round"
    />
    {mood !== "calm" && (
      <g fill={C.out}>
        <ellipse cx="-48" cy="-165" rx="8" ry="13" />
        <ellipse cx="51" cy="-165" rx="8" ry="13" />
      </g>
    )}
    <path
      d={
        mood === "calm" || tech
          ? "M-34-113Q0-88 36-115"
          : mood === "cold"
            ? "M-26-110l12-7 13 8 14-9 15 7"
            : "M-33-106Q0-129 34-106"
      }
      stroke={C.out}
      strokeWidth="9"
      strokeLinecap="round"
      fill="none"
    />
    {raisin > 0.3 &&
      [0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${-80 + i * 45}-235q-15 70 0 110`}
          fill="none"
          stroke="#805466"
          strokeWidth="6"
          opacity=".7"
        />
      ))}
    {mood === "hot" && (
      <g fill="#F7EEDB">
        <path d="M115-164q-25 38 1 38q25-2-1-38" />
        <path d="M-126-213q-22 33 0 32q19 0 0-32" />
      </g>
    )}
    {mood === "cold" && (
      <g>
        <path
          d="M-88-193H-10V-144H-88ZM10-193H88V-144H10ZM-10-180H10"
          fill={C.ice}
          stroke={C.out}
          strokeWidth="6"
        />
        <Snow x={-54} y={-207} s={0.55} />
        <Snow x={52} y={-208} s={0.55} />
        <path d="M-80-188l10 36m82-32 15 29" stroke="white" strokeWidth="5" />
      </g>
    )}
  </g>
);
export const Room = ({
  t,
  cold = false,
  door = false,
}: {
  t: number;
  cold?: boolean;
  door?: boolean;
}) => (
  <g>
    <path d="M0 620H1080V1550H0Z" fill={C.navy2} />
    {Array.from({ length: 13 }, (_, i) => (
      <path
        key={i}
        d={`M${i * 92} 620v930`}
        stroke={C.navy3}
        strokeWidth="3"
        opacity=".38"
      />
    ))}
    <path d="M0 1450H1080V1920H0Z" fill={C.navy} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path
        key={i}
        d={`M${-700 + i * 500} 1920L540 1450`}
        stroke={C.navy3}
        strokeWidth="3"
      />
    ))}
    <path d="M0 1560H1080M0 1720H1080" stroke={C.navy3} strokeWidth="3" />
    <g style={{ mixBlendMode: "screen" }} opacity={cold ? 0.42 : 0.27}>
      <path
        d={
          door
            ? "M760 670L1080 610V1750L260 1610Z"
            : "M0 650L220 650 1080 1510 600 1510Z"
        }
        fill={cold ? "url(#cold-light)" : "url(#warm-light)"}
      />
      <ellipse
        cx="100"
        cy="860"
        rx="540"
        ry="600"
        fill={cold ? "url(#cold-light)" : "url(#warm-light)"}
      />
    </g>
    <ellipse cx="480" cy="1510" rx="460" ry="90" fill={C.out} opacity=".45" />
    {!door && (
      <g>
        <Sh
          id="sofa-back"
          fill="#62548E"
          shade="#382F61"
          shape={<rect x="110" y="1060" width="760" height="310" rx="65" />}
        />
        <Sh
          id="sofa-seat"
          fill="#746099"
          shade="#443660"
          shape={<rect x="86" y="1255" width="810" height="195" rx="45" />}
        />
        <path d="M166 1446v65M824 1446v65" stroke={C.out} strokeWidth="26" />
        <Sh
          id="sofa-arm"
          fill="#7C68A1"
          shade="#493D71"
          shape={<rect x="75" y="1170" width="115" height="260" rx="42" />}
        />
      </g>
    )}
    <path
      d="M-45 1920V1530q150-145 232-6l35 396Z"
      fill={C.out}
      opacity=".8"
      style={{ filter: "blur(7px)" }}
      transform={`translate(${Math.sin(t) * 12} 0)`}
    />
  </g>
);
export const Remote = ({
  x,
  y,
  t = 0,
  s = 1,
}: {
  x: number;
  y: number;
  t?: number;
  s?: number;
}) => (
  <g transform={`translate(${x} ${y}) rotate(-20) scale(${s})`}>
    <Sh
      id="remote"
      fill={C.cream}
      shade="#AAA6BE"
      shape={<rect x="-45" y="-95" width="90" height="205" rx="23" />}
    />
    <rect x="-27" y="-73" width="54" height="44" rx="4" fill={C.navy2} />
    <circle cy="5" r={14 + Math.sin(t * 35) * 2} fill={C.red} />
    {[-18, 18].map((x) => (
      <g key={x} fill={C.navy3}>
        <circle cx={x} cy="43" r="8" />
        <circle cx={x} cy="75" r="8" />
      </g>
    ))}
  </g>
);
export const Burst = ({ t = 0 }: { t?: number }) => (
  <g transform={`translate(540 960) rotate(${t * 8})`}>
    {Array.from({ length: 24 }, (_, i) => (
      <path
        key={i}
        d="M0 0L-220-1450 220-1450Z"
        transform={`rotate(${i * 15})`}
        fill={i % 2 ? C.navy : C.navy2}
      />
    ))}
  </g>
);
export const Badge = ({
  x = 520,
  y = 780,
  t = 0,
  s = 1,
}: {
  x?: number;
  y?: number;
  t?: number;
  s?: number;
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r="235" fill={C.out} transform="translate(11 18)" />
    <circle r="235" fill={C.yellow} stroke={C.out} strokeWidth="8" />
    <circle r="174" fill={C.navy} />
    <g transform={`rotate(${t * 12})`}>
      <defs>
        <path id="badge-ring" d="M0-195a195 195 0 1 1-1 0" />
      </defs>
      <text
        fontFamily="Inter"
        fontWeight="900"
        fontSize="23"
        fill={C.navy}
        letterSpacing="3"
      >
        <textPath href="#badge-ring">
          DATANG TEPAT WAKTU · HARGA PASTI · DINGIN LAGI ·{" "}
        </textPath>
      </text>
    </g>
    <Snow x={0} y={-20} s={2.5} />
    <path
      d="M-53 91l40 32 79-80"
      fill="none"
      stroke={C.yellow}
      strokeWidth="18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);
export const Dust = ({ t }: { t: number }) => (
  <g fill={C.cream}>
    {Array.from({ length: 32 }, (_, i) => (
      <circle
        key={i}
        cx={250 + hash(i) * 680 + Math.sin(t * 0.7 + i) * 20}
        cy={680 + ((hash(i + 50) * 820 + t * 18) % 820)}
        r={1.5 + hash(i + 100) * 3}
        opacity={0.1 + hash(i + 4) * 0.35}
      />
    ))}
  </g>
);
