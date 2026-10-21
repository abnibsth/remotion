import { useId } from "react";

export type CharacterPose =
  | "neutral"
  | "excited"
  | "celebrating"
  | "confused"
  | "panicking"
  | "shocked"
  | "defeated"
  | "rich"
  | "reaching"
  | "seated";

export type CharacterProps = {
  pose?: CharacterPose;
  /** Animation time in seconds; the component never owns a clock. */
  t: number;
  /** 0 = absent, 1 = worn, intermediate values lower the glasses onto the face. */
  sunglasses?: number;
  /** 0 = absent, 0..1 = a tear travelling down the cheek. */
  tear?: number;
  /** Horizontal gaze / subtle head turn: 0 = left, .5 = forward, 1 = right. */
  look?: number;
  width?: number;
};

type Point = readonly [number, number];
type ArmPose = {
  elbow: Point;
  wrist: Point;
  hand?: "open" | "fist" | "relaxed";
};
type Stance = { left: ArmPose; right: ArmPose; lean: number; head: number };

const C = {
  ink: "#171222",
  hair: "#20243D",
  hairLight: "#363D58",
  skin: "#CE9167",
  skinLight: "#E8AF7F",
  skinShade: "#AC6B50",
  cream: "#F8EBD4",
  creamShade: "#DACAAC",
  mint: "#91D7BD",
  mintShade: "#4B9E8D",
  trousers: "#303248",
  trouserLight: "#474B62",
  white: "#FFF9ED",
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const angle = (a: Point, b: Point) =>
  (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI - 90;
const distance = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);

const stances: Record<CharacterPose, Stance> = {
  neutral: {
    left: { elbow: [215, 465], wrist: [220, 551] },
    right: { elbow: [401, 453], wrist: [365, 485] },
    lean: -1,
    head: -2,
  },
  excited: {
    left: { elbow: [180, 409], wrist: [182, 314], hand: "fist" },
    right: { elbow: [420, 402], wrist: [421, 302], hand: "fist" },
    lean: -2,
    head: -5,
  },
  celebrating: {
    left: { elbow: [163, 298], wrist: [142, 206], hand: "fist" },
    right: { elbow: [435, 295], wrist: [460, 201], hand: "open" },
    lean: -3,
    head: -7,
  },
  confused: {
    left: { elbow: [184, 435], wrist: [140, 396], hand: "open" },
    right: { elbow: [417, 399], wrist: [385, 283] },
    lean: 3,
    head: 10,
  },
  panicking: {
    left: { elbow: [158, 333], wrist: [108, 262], hand: "open" },
    right: { elbow: [444, 336], wrist: [494, 261], hand: "open" },
    lean: 2,
    head: -5,
  },
  shocked: {
    left: { elbow: [192, 420], wrist: [229, 307], hand: "open" },
    right: { elbow: [414, 419], wrist: [387, 309], hand: "open" },
    lean: -3,
    head: -4,
  },
  defeated: {
    left: { elbow: [222, 460], wrist: [230, 533] },
    right: { elbow: [393, 456], wrist: [379, 528] },
    lean: 8,
    head: 13,
  },
  rich: {
    left: { elbow: [180, 423], wrist: [217, 474] },
    right: { elbow: [425, 423], wrist: [393, 475] },
    lean: -6,
    head: -7,
  },
  reaching: {
    left: { elbow: [213, 463], wrist: [204, 549] },
    right: { elbow: [405, 278], wrist: [436, 181], hand: "open" },
    lean: -5,
    head: -12,
  },
  seated: {
    left: { elbow: [213, 452], wrist: [234, 508] },
    right: { elbow: [399, 449], wrist: [364, 472] },
    lean: 2,
    head: 3,
  },
};

const Hand = ({
  kind = "relaxed",
  phone = false,
}: {
  kind?: ArmPose["hand"];
  phone?: boolean;
}) => (
  <g data-part="hand">
    {kind === "fist" ? (
      <>
        <path d="M-11-4-18 9-17 30-7 39 12 36 20 27 18 8 10 1Z" fill={C.skin} />
        <path
          d="m-15 10 11 5 1 15M-3 7l1 10M6 7l1 10M14 11l1 9"
          fill="none"
          strokeWidth={2.6}
        />
        <path
          d="M-16 12q-13 0-11 10l11 10 9-3-1-9Z"
          fill={C.skinLight}
          strokeWidth={3.4}
        />
      </>
    ) : kind === "open" ? (
      <>
        <path
          d="M-11-3-14 10-23 4Q-30 0-32 6L-28 16-17 31-14 45Q-13 51-8 49L-8 33-6 58Q-4 64 1 60L2 35 6 61Q10 66 14 60L13 33 18 53Q23 58 26 51L22 25 14 5 10-3Z"
          fill={C.skinLight}
        />
        <path
          d="m14 6 8 20 3 25q-4 7-7 2l-5-20 1 27q-4 6-8 1L2 35 1 60q-5 4-7-2l-2-25-2-10Z"
          fill={C.skin}
          stroke="none"
        />
        <path
          d="m-12 17 8 9 13-1M-8 33l-1-8M2 35l-1-10M13 33l-3-10"
          fill="none"
          strokeWidth={2.3}
        />
      </>
    ) : (
      <>
        <path
          d="M-10-3-14 13-12 31-5 47Q0 51 2 45L0 29 5 49Q10 53 13 46L11 27 17 43Q23 46 24 39L20 14 11-3Z"
          fill={C.skin}
        />
        <path
          d="M-10 2-18 12-22 28q-1 7 5 7l8-14 7 1 3-10"
          fill={C.skinLight}
          strokeWidth={3.4}
        />
        <path
          d="m0 29-2-11M11 27l-3-11M20 27l-4-12"
          fill="none"
          strokeWidth={2.3}
        />
      </>
    )}
    {phone && (
      <g transform="translate(0 17) rotate(-12)" data-part="phone">
        <path
          d="M-20-43 17-43 21-38 21 25 17 29-20 29-24 25-24-38Z"
          fill={C.ink}
          strokeWidth={4}
        />
        <path d="M-18-34H15V18H-18Z" fill={C.mintShade} stroke="none" />
        <path d="m-18-34 33 0-33 39Z" fill={C.mint} stroke="none" />
        <path d="M-7-38H3M-7 23H3" stroke={C.cream} strokeWidth={2} />
        <path
          d="M-25-7q10-6 15-2 3 5-2 9l-11 6M20 1q8 0 7 7l-5 12"
          fill={C.skinLight}
          strokeWidth={3.5}
        />
      </g>
    )}
  </g>
);

const Arm = ({
  shoulder,
  elbow,
  wrist,
  hand,
  phone,
  sleeveId,
  wristTurn = 0,
}: {
  shoulder: Point;
  elbow: Point;
  wrist: Point;
  hand?: ArmPose["hand"];
  phone?: boolean;
  sleeveId: string;
  wristTurn?: number;
}) => {
  const upperLength = distance(shoulder, elbow);
  const foreLength = distance(elbow, wrist);
  return (
    <g data-part="arm">
      <g
        transform={`translate(${shoulder.join(" ")}) rotate(${angle(shoulder, elbow)})`}
        data-part="upper-arm"
      >
        <path
          d={`M-21 29 20 30 15 ${upperLength - 1}Q0 ${upperLength + 16}-15 ${upperLength - 1}Z`}
          fill={C.skin}
        />
        <path
          d={`M-18 34-6 34-9 ${upperLength - 2}-15 ${upperLength - 1}Z`}
          fill={C.skinLight}
          stroke="none"
        />
      </g>
      <g
        transform={`translate(${elbow.join(" ")}) rotate(${angle(elbow, wrist)})`}
        data-part="forearm"
      >
        <path
          d={`M-15-5Q-4-14 14-4L11 ${foreLength + 1}-11 ${foreLength + 1}Z`}
          fill={C.skin}
        />
        <path
          d={`M-14-3-4-6-5 ${foreLength}-11 ${foreLength}Z`}
          fill={C.skinLight}
          stroke="none"
        />
        <path
          d="m-8 0 12 3"
          fill="none"
          stroke={C.skinShade}
          strokeWidth={2.5}
        />
        <g transform={`translate(0 ${foreLength - 2}) rotate(${wristTurn})`}>
          <Hand kind={hand} phone={phone} />
        </g>
      </g>
      <g
        transform={`translate(${shoulder.join(" ")}) rotate(${angle(shoulder, elbow)})`}
        data-part="sleeve"
      >
        <defs>
          <clipPath id={sleeveId}>
            <path d="M-20-10Q0-20 22-7L27 51 19 61-25 58-29 49Z" />
          </clipPath>
        </defs>
        <path d="M-20-10Q0-20 22-7L27 51 19 61-25 58-29 49Z" fill={C.cream} />
        <path
          d="M12-15 35-4 35 67 3 62 17 42Z"
          clipPath={`url(#${sleeveId})`}
          fill={C.creamShade}
          stroke="none"
        />
        <path d="m-25 49 43 3M-15 10l-3 23" fill="none" strokeWidth={2.5} />
      </g>
    </g>
  );
};

const Sneaker = ({
  x,
  y,
  flip = false,
  turn = 0,
}: {
  x: number;
  y: number;
  flip?: boolean;
  turn?: number;
}) => (
  <g
    transform={`translate(${x} ${y}) rotate(${turn}) scale(${flip ? -1 : 1} 1)`}
    data-part="sneaker"
  >
    <path d="M-20-25H18L23-8 50 3Q58 7 57 21L-26 21-29 13Z" fill={C.cream} />
    <path d="m18-18 8 15 22 7-4 8-26-4-8-23Z" fill={C.mint} strokeWidth={3} />
    <path d="M-28 12H57V23H-27Z" fill={C.white} strokeWidth={3.5} />
    <path
      d="m20-4-12 5M28 1 15 6M35 6l-12 4M-18-18v21"
      fill="none"
      strokeWidth={2.5}
    />
    <path d="M-20 23H48" stroke={C.ink} strokeWidth={4} />
  </g>
);

const Legs = ({
  seated,
  rich,
  kick,
}: {
  seated: boolean;
  rich: boolean;
  kick: number;
}) => (
  <g data-part="legs">
    {seated ? (
      <>
        <path
          d="M254 602 301 620 263 692 248 801 207 801 212 671Z"
          fill={C.trousers}
        />
        <path
          d="m252 632-21 50-9 109 14 2 15-112 26-38Z"
          fill={C.trouserLight}
          stroke="none"
        />
        <path
          d="m218 785 31 3-1 18-41-2Z"
          fill={C.trouserLight}
          strokeWidth={3}
        />
        <Sneaker x={224} y={825} flip />
        {rich ? (
          <>
            <path
              d="M301 605 341 601 427 655Q445 673 425 690L331 758 300 727 378 665 310 653Z"
              fill={C.trousers}
            />
            <path
              d="m327 617 70 46-76 70 10 15 92-69-6-16-77-51Z"
              fill={C.trouserLight}
              stroke="none"
            />
            <path
              d="m306 725 27 27-13 14-30-30Z"
              fill={C.trouserLight}
              strokeWidth={3}
            />
            <Sneaker x={297} y={765} flip turn={38} />
            <path
              d="m392 663 22 3M283 625l12 15"
              fill="none"
              stroke={C.ink}
              strokeWidth={3}
            />
          </>
        ) : (
          <>
            <path
              d="M300 611 345 603 420 657 428 801 385 808 375 689 305 664Z"
              fill={C.trousers}
            />
            <path
              d="m330 622 64 50 15 124-16 3-13-120-62-33Z"
              fill={C.trouserLight}
              stroke="none"
            />
            <path
              d="m385 786 42-3 1 20-42 6Z"
              fill={C.trouserLight}
              strokeWidth={3}
            />
            <Sneaker x={406} y={828} />
            <path d="m383 672 22-4M240 676l16 6" fill="none" strokeWidth={3} />
          </>
        )}
      </>
    ) : (
      <>
        <g transform={`rotate(${-kick} 274 558)`}>
          <path
            d="M251 538 304 546 295 675 276 803 232 803 245 670Z"
            fill={C.trousers}
          />
          <path
            d="m254 558 15 4-8 113-13 115-12 1 14-122Z"
            fill={C.trouserLight}
            stroke="none"
          />
          <path
            d="m234 786 44 1-2 20h-44Z"
            fill={C.trouserLight}
            strokeWidth={3}
          />
          <Sneaker x={252} y={828} flip />
          <path d="m252 673 19 5" fill="none" strokeWidth={3} />
        </g>
        <g transform={`rotate(${kick * 0.7} 322 555)`}>
          <path
            d="M296 542 345 539 358 668 377 803 332 810 310 679 288 594Z"
            fill={C.trousers}
          />
          <path
            d="m318 558 14-5 10 120 19 116-15 4-20-119Z"
            fill={C.trouserLight}
            stroke="none"
          />
          <path
            d="m330 793 44-7 3 21-44 6Z"
            fill={C.trouserLight}
            strokeWidth={3}
          />
          <Sneaker x={354} y={833} />
          <path d="m324 676 20-5M302 552l5 37" fill="none" strokeWidth={3} />
        </g>
      </>
    )}
  </g>
);

const Eye = ({
  x,
  side,
  pose,
  gaze,
}: {
  x: number;
  side: -1 | 1;
  pose: CharacterPose;
  gaze: number;
}) => {
  const wide = pose === "panicking" || pose === "shocked";
  const tired = pose === "defeated" || pose === "rich";
  const joyful = pose === "celebrating" || pose === "excited";
  return (
    <g transform={`translate(${x} 213)`} data-part="eye">
      {joyful ? (
        <path d="M-13 2Q-2-10 11 0" fill="none" strokeWidth={4} />
      ) : (
        <>
          <path
            d={
              wide
                ? "M-15 0Q-3-21 13-3L14 6Q0 19-14 7Z"
                : tired
                  ? "M-14 0 12 1 10 8Q-2 13-13 6Z"
                  : "M-15 1Q-3-12 12 0L11 7Q-2 14-14 7Z"
            }
            fill={C.white}
            strokeWidth={3.2}
          />
          <ellipse
            cx={gaze * 4 + side}
            cy={wide ? 1 : 3.5}
            rx={wide ? 4 : 5}
            ry={wide ? 6 : tired ? 3.5 : 6.5}
            fill={C.ink}
            stroke="none"
          />
          {!tired && (
            <circle
              cx={gaze * 4 + side - 1.5}
              cy={wide ? -1 : 1}
              r={1.4}
              fill={C.white}
              stroke="none"
            />
          )}
          {tired && <path d="m-13-1 25 1" fill="none" strokeWidth={4} />}
        </>
      )}
    </g>
  );
};

const Mouth = ({ pose }: { pose: CharacterPose }) => {
  if (pose === "shocked" || pose === "panicking") {
    return (
      <g data-part="mouth">
        <path
          d={
            pose === "panicking"
              ? "M286 255Q305 244 324 258L321 277Q301 283 287 271Z"
              : "M296 250Q309 245 316 258L314 276Q303 286 295 274Z"
          }
          fill={C.ink}
          strokeWidth={3.5}
        />
        {pose === "panicking" && (
          <path
            d="M289 255q16-7 31 4l-1 5-29-4Z"
            fill={C.white}
            stroke="none"
          />
        )}
        <path
          d="M298 275q7-8 16-1"
          fill="none"
          stroke={C.skinShade}
          strokeWidth={4}
        />
      </g>
    );
  }
  if (pose === "celebrating" || pose === "excited") {
    return (
      <g data-part="mouth">
        <path
          d="M281 251Q302 263 329 249L324 270Q305 289 287 269Z"
          fill={C.ink}
          strokeWidth={3.5}
        />
        <path
          d="M284 254q20 9 42-1l-3 9q-19 7-36-2Z"
          fill={C.white}
          stroke="none"
        />
        <path
          d="M299 276q8-9 18-3"
          fill="none"
          stroke="#CF826F"
          strokeWidth={5}
        />
      </g>
    );
  }
  return (
    <g data-part="mouth" fill="none">
      <path
        d={
          pose === "defeated"
            ? "M286 266q16-12 34-4"
            : pose === "confused"
              ? "m291 260 13-3 14 4"
              : pose === "reaching"
                ? "M295 259q12-5 22 1"
                : pose === "rich"
                  ? "M286 257q20 15 39-5"
                  : "M289 258q15 11 32-1"
        }
        strokeWidth={3.8}
      />
      <path
        d={pose === "defeated" ? "m299 275 12-1" : "m299 272 13-1"}
        stroke={C.skinShade}
        strokeWidth={2.5}
      />
    </g>
  );
};

/** Original editorial character. All motion is a deterministic function of t. */
export const Character = ({
  pose = "neutral",
  t,
  sunglasses = 0,
  tear = 0,
  look = 0.5,
  width = 600,
}: CharacterProps) => {
  const id = `gajian-character-${useId().replace(/:/g, "")}`;
  const state = stances[pose];
  const seated = pose === "seated" || pose === "defeated" || pose === "rich";
  const happy = pose === "celebrating" || pose === "excited";
  const alarm = pose === "panicking";
  const wave = Math.sin(t * Math.PI * 2);
  const breath = Math.sin(t * 2.3) * (pose === "defeated" ? 0.35 : 1.7);
  const jump =
    pose === "celebrating"
      ? Math.pow((wave + 1) / 2, 2) * 29
      : happy
        ? (wave + 1) * 2
        : 0;
  const tremble = alarm ? Math.sin(t * 29) * 2.2 : 0;
  const gaze = (clamp(look) - 0.5) * 2;
  const glasses = clamp(sunglasses);
  const teardrop = clamp(tear);
  const facePath =
    "M244 177 266 151 315 146 349 160 365 185 361 239 348 270 316 292 293 293 264 277 247 249Z";
  const shirtPath =
    "M266 327 244 336 225 352 237 414 244 478 239 546Q289 568 348 548L344 472 365 354 343 336 323 326Z";
  const wristMotion = happy ? Math.sin(t * 8 - 0.5) * 8 : alarm ? wave * 9 : 0;
  const leftElbow: Point = [
    state.left.elbow[0] + tremble,
    state.left.elbow[1] + (happy ? wave * 4 : 0),
  ];
  const rightElbow: Point = [
    state.right.elbow[0] - tremble,
    state.right.elbow[1] - (happy ? wave * 4 : 0),
  ];
  const leftWrist: Point = [
    state.left.wrist[0] + tremble * 2,
    state.left.wrist[1] + (happy ? Math.sin(t * 7) * 7 : 0),
  ];
  const rightWrist: Point = [
    state.right.wrist[0] - tremble * 2,
    state.right.wrist[1] +
      (happy
        ? Math.sin(t * 7 + 1) * 7
        : pose === "reaching"
          ? Math.sin(t * 5) * 3
          : 0),
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width * 1.5}
      viewBox="0 0 600 900"
      role="img"
      aria-label={`Young Indonesian adult, ${pose} pose`}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <clipPath id={`${id}-face`}>
          <path d={facePath} />
        </clipPath>
        <clipPath id={`${id}-shirt`}>
          <path d={shirtPath} />
        </clipPath>
        <clipPath id={`${id}-hair`}>
          <path d="M241 216 226 194 228 162 241 149 235 130 260 132 283 113 310 119 337 115 366 135 379 164 368 209 354 215 350 180 331 182 309 164 279 183 253 184 253 217Z" />
        </clipPath>
      </defs>
      <g data-part="ground-shadow" fill={C.ink}>
        <ellipse
          cx="302"
          cy="861"
          rx={seated ? 139 : 116 - jump * 0.45}
          ry={seated ? 12 : 11 - jump * 0.1}
          opacity={0.1 - jump * 0.001}
        />
        <ellipse
          cx="302"
          cy="860"
          rx={seated ? 93 : 75 - jump * 0.3}
          ry="5"
          opacity="0.06"
        />
      </g>
      <g
        stroke={C.ink}
        strokeWidth={5}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {seated && (
          <g data-part="seat">
            <path
              d="m227 653-19 192h13l30-184M367 653l29 191h13l-16-191"
              fill={C.trousers}
              strokeWidth={4}
            />
            <path
              d="M213 643q91-19 184 0v20q-91 13-184 0Z"
              fill={C.mintShade}
            />
            <path d="M219 645q88-12 172 0" stroke={C.mint} strokeWidth={4} />
          </g>
        )}
        <g transform={`translate(${tremble} ${-jump})`}>
          <Legs
            seated={seated}
            rich={pose === "rich"}
            kick={pose === "celebrating" ? 3 + (wave + 1) * 3 : 0}
          />
          <g
            transform={`translate(0 ${(seated ? 74 : 0) + breath}) rotate(${state.lean + (happy ? wave * 1.3 : 0)} 300 548)`}
          >
            <Arm
              shoulder={[242, pose === "defeated" ? 371 : 362]}
              elbow={leftElbow}
              wrist={leftWrist}
              hand={state.left.hand}
              sleeveId={`${id}-left-sleeve`}
              wristTurn={-wristMotion}
            />
            <g data-part="torso">
              <path
                d="M277 280 276 328 263 337 295 366 328 335 319 324 320 277Z"
                fill={C.skin}
              />
              <path
                d="m279 289 40-9v35l-24 17-17-13Z"
                fill={C.skinShade}
                stroke="none"
              />
              <path d={shirtPath} fill={C.cream} />
              <g clipPath={`url(#${id}-shirt)`} stroke="none">
                <path
                  d="m332 325 43 19-28 127 14 94-38 3-7-91 19-81-21-36Z"
                  fill={C.creamShade}
                />
                <path d="m245 342 23-3-8 108-7 80-15 9 4-85Z" fill={C.white} />
                <path d="m240 526 44 11 66-4 8 30-128 2Z" fill={C.creamShade} />
              </g>
              <path
                d="m276 324 19 21-15 26-20-34ZM319 323l-24 22 16 26 23-37Z"
                fill={C.white}
                strokeWidth={3.5}
              />
              <path
                d="m296 349 2 172M251 472l12 13M336 491l-11 15M251 538q43 10 85 1"
                fill="none"
                strokeWidth={2.5}
              />
              <path
                d="M312 393h25l-3 35-12 6-12-8Z"
                fill={C.cream}
                strokeWidth={2.5}
              />
              <path d="M314 399h20" stroke={C.creamShade} strokeWidth={3} />
              <path
                d="M249 551q50 14 95-1l-1 13q-47 13-94-1Z"
                fill={C.ink}
                strokeWidth={2.5}
              />
              <path
                d="M289 554h21v14h-21Z"
                fill={C.creamShade}
                strokeWidth={3}
              />
              <path d="M298 557v8h10" fill="none" strokeWidth={2} />
            </g>
            <g
              transform={`rotate(${Math.sin(t * 3 - 0.7) * (happy ? 9 : pose === "defeated" ? 0.3 : 2)} 296 341)`}
              data-part="lanyard"
            >
              <path
                d="m271 336 21 101 10 1 22-103-10 8-17 77-16-76Z"
                fill={C.mint}
                strokeWidth={3}
              />
              <path d="m299 419-2 18" stroke={C.mintShade} strokeWidth={3} />
              <path d="M291 433h12v11h-12Z" fill={C.ink} strokeWidth={2} />
              <path
                d="m280 442 33 1-1 43-33-1Z"
                fill={C.white}
                strokeWidth={3}
              />
              <path d="m280 443 33 1v9l-33-1Z" fill={C.mint} stroke="none" />
              <path d="M287 462h9v12h-9Z" fill={C.mintShade} stroke="none" />
              <path
                d="M301 463h6m-6 6h5m-18 10h18"
                fill="none"
                stroke={C.creamShade}
                strokeWidth={2}
              />
            </g>
            <Arm
              shoulder={[353, pose === "defeated" ? 373 : 360]}
              elbow={rightElbow}
              wrist={rightWrist}
              hand={state.right.hand}
              phone={
                pose === "neutral" || pose === "seated" || pose === "defeated"
              }
              sleeveId={`${id}-right-sleeve`}
              wristTurn={wristMotion}
            />
            <g
              transform={`translate(${gaze * 3} 0) rotate(${state.head + (happy ? Math.sin(t * 6 - 0.4) * 2 : 0)} 300 309) skewX(${gaze * -1.8})`}
              data-part="head"
            >
              <g data-part="ears">
                <path
                  d="M246 210q-22-13-21 9l5 20q8 12 21 5M358 209q22-15 21 7l-5 23q-7 12-19 4"
                  fill={C.skin}
                  strokeWidth={4}
                />
                <path
                  d="m240 219-7-3 2 15 7 3M364 220l7-5-2 17-6 3"
                  fill="none"
                  stroke={C.skinShade}
                  strokeWidth={3}
                />
              </g>
              <path d={facePath} fill={C.skinLight} />
              <g
                clipPath={`url(#${id}-face)`}
                stroke="none"
                data-part="face-shading"
              >
                <path
                  d="m341 153 30 12-4 84-25 33-30 18-28-8 39-23 17-33 2-47-18-18Z"
                  fill={C.skin}
                />
                <path
                  d="m354 229 18-23-5 44-23 27-27 16-16 2 35-29Z"
                  fill={C.skinShade}
                />
                <path d="m252 188 20-8-14 46-8 7Z" fill="#F3C497" />
                <path
                  d="m260 243 14-4 11 10-17 8Z"
                  fill={C.skin}
                  opacity="0.45"
                />
              </g>
              <g
                transform={`translate(${gaze * 6} ${pose === "defeated" ? 4 : 0})`}
                data-part="features"
              >
                <g data-part="eyebrows" fill={C.hair} strokeWidth={1.5}>
                  <path
                    d={
                      pose === "defeated"
                        ? "m258 197 25-10 4 6-27 8Z"
                        : pose === "panicking" || pose === "shocked"
                          ? "m258 187 27-5 2 6-28 5Z"
                          : pose === "confused"
                            ? "m258 186 27 6-2 6-26-6Z"
                            : "m258 193 26-3 3 6-28 3Z"
                    }
                  />
                  <path
                    d={
                      pose === "defeated"
                        ? "m321 188 24 9-1 5-26-8Z"
                        : pose === "panicking" || pose === "shocked"
                          ? "m320 181 25 5-1 6-26-5Z"
                          : pose === "confused"
                            ? "m319 187 26-6 1 6-25 6Z"
                            : "m320 190 25 5-1 6-26-5Z"
                    }
                  />
                </g>
                <Eye x={273} side={-1} pose={pose} gaze={gaze} />
                <Eye x={332} side={1} pose={pose} gaze={gaze} />
                <g data-part="nose">
                  <path
                    d="m307 213-4 23 13 4 4-4"
                    fill="none"
                    strokeWidth={3}
                  />
                  <path d="m307 223 7 11-10 1Z" fill={C.skin} stroke="none" />
                  <path
                    d="m298 242 4 1"
                    fill="none"
                    stroke={C.skinShade}
                    strokeWidth={2}
                  />
                </g>
                <Mouth pose={pose} />
                {pose === "defeated" && (
                  <path
                    d="m263 230 18 2m43 1 16-2"
                    stroke={C.skinShade}
                    strokeWidth={2}
                  />
                )}
              </g>
              <g data-part="hair">
                <path
                  d="M241 216 226 194 228 162 241 149 235 130 260 132 283 113 310 119 337 115 366 135 379 164 368 209 354 215 350 180 331 182 309 164 279 183 253 184 253 217Z"
                  fill={C.hair}
                />
                <g clipPath={`url(#${id}-hair)`} stroke="none">
                  <path
                    d="m233 155 38-18 51-5 28 5-54 7-37 21-24 6Z"
                    fill={C.hairLight}
                  />
                  <path
                    d="m348 133 18 30-13 45 19 2 12-45-14-31Z"
                    fill={C.ink}
                  />
                  <path
                    d="m241 175 25-6 38-18-23 20-30 12-9 21Z"
                    fill={C.ink}
                  />
                </g>
                <path
                  d="m261 149 34-15 32-2M237 182l1 15"
                  fill="none"
                  stroke={C.hairLight}
                  strokeWidth={2.5}
                />
              </g>
              {glasses > 0 && (
                <g
                  transform={`translate(${gaze * 5} ${-116 * (1 - glasses) ** 2}) rotate(${(1 - glasses) * -9} 300 214)`}
                  opacity={Math.min(1, glasses * 5)}
                  data-part="sunglasses"
                >
                  <path
                    d="m247 204-11-4m119 4 12-7"
                    fill="none"
                    strokeWidth={5}
                  />
                  <path
                    d="M248 203 291 205 288 228Q271 240 253 225ZM312 205 355 201 351 225Q333 237 316 227Z"
                    fill={C.ink}
                    strokeWidth={4}
                  />
                  <path d="M291 210q9-7 21 0" fill="none" strokeWidth={5} />
                  <path
                    d="m255 207 25 1-21 13ZM320 208l25-3-21 18Z"
                    fill={C.hairLight}
                    stroke="none"
                  />
                  <path
                    d="m257 208 15 1m50 0 15-2"
                    stroke={C.mint}
                    strokeWidth={2}
                  />
                </g>
              )}
              {teardrop > 0 && (
                <g clipPath={`url(#${id}-face)`} data-part="tear">
                  <g
                    transform={`translate(${339 + gaze * 6} ${225 + teardrop * 64})`}
                    opacity={Math.min(1, teardrop * 8)}
                  >
                    <path
                      d="M0-8Q-2-1-5 4q-5 12 4 13Q9 17 6 7Z"
                      fill="#A9E1DD"
                      strokeWidth={2.5}
                    />
                    <path d="m-1 5-1 6" stroke={C.white} strokeWidth={2} />
                  </g>
                </g>
              )}
              {alarm && (
                <g
                  transform={`translate(377 ${191 + (wave + 1) * 4}) rotate(-12)`}
                  data-part="sweat"
                >
                  <path
                    d="M0-11Q-4-2-7 6q-3 10 6 11Q10 15 7 6Z"
                    fill={C.mint}
                    strokeWidth={3}
                  />
                  <path d="m-2 5-1 5" stroke={C.white} strokeWidth={2} />
                </g>
              )}
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Character;
