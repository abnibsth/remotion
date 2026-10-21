import {
  AC,
  Badge,
  Burst,
  C,
  Character,
  Kicker,
  Pop,
  Remote,
  Room,
  Sans,
  Sh,
  Snow,
  Stamp,
  Type,
} from "./art";
import { clamp, spring } from "./motion";
export const Reveal = ({ t }: { t: number }) => (
  <>
    <Burst t={t} />
    <Kicker>KENALAN SAMA PENYELAMAT SUHU.</Kicker>
    <Pop t={t} delay={0.1} x={520} y={760} k={90} d={16}>
      <Badge x={0} y={0} t={t} />
    </Pop>
    <Pop t={t} delay={0.3} x={520} y={1155} k={90} d={16}>
      <Type x={0} y={0} size={179} anchor="middle" fill={C.yellow} extrude>
        SEJUK SIGAP
      </Type>
    </Pop>
    <Pop t={t} delay={0.7} x={520} y={1308}>
      <rect
        x="-310"
        y="-63"
        width="620"
        height="94"
        rx="47"
        fill={C.out}
        transform="translate(7 11)"
      />
      <rect x="-310" y="-63" width="620" height="94" rx="47" fill={C.cream} />
      <Sans x={0} y={0} size={38} anchor="middle" fill={C.navy}>
        Servis AC Panggilan
      </Sans>
    </Pop>
    <Sans x={520} y={1444} size={29} anchor="middle">
      Datang tepat waktu. Harga pasti. Dingin lagi.
    </Sans>
  </>
);
const Icon = ({ x, y, kind = 0 }: { x: number; y: number; kind?: number }) => (
  <g
    transform={`translate(${x} ${y})`}
    stroke={C.navy}
    strokeWidth="6"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {kind === 0 ? (
      <>
        <rect x="-43" y="-34" width="86" height="50" rx="9" />
        <path d="M-24 30v20M0 30v27M24 30v20" />
      </>
    ) : kind === 1 ? (
      <>
        <path d="M0-45Q-44 4-29 24Q0 65 29 24Q44 4 0-45Z" />
        <path d="M-10 9q-7 15 7 19" />
      </>
    ) : kind === 2 ? (
      <>
        <path d="M-44-23Q0-58 44-23M-28-4Q0-26 28-4M-12 15Q0 6 12 15" />
        <circle cy="36" r="4" fill={C.navy} />
      </>
    ) : (
      <>
        <path d="M-38-31L38 31M-38 31L38-31" />
        <circle r="45" />
      </>
    )}
  </g>
);
export const UI = ({ t }: { t: number }) => {
  const step = t < 1.3 ? 0 : t < 2.6 ? 1 : 2;
  const u = t - [0, 1.3, 2.6][step];
  const remote = spring(t - 3.35, 170, 28);
  return (
    <>
      <Kicker>GAMPANG. NGGAK PAKE DRAMA.</Kicker>
      <text
        x="72"
        y="405"
        fontFamily="Anton"
        fontSize="190"
        fill="none"
        stroke={C.yellow}
        strokeWidth="3"
      >
        0{step + 1}
      </text>
      <Type x={260} y={315} size={step === 2 ? 72 : 78} fill={C.yellow} extrude>
        {["PILIH MASALAH", "HARGA PASTI,", "MONTIR TIBA"][step]}
      </Type>
      <Type x={260} y={407} size={step === 2 ? 72 : 78}>
        {["AC KAMU.", "NO DRAMA.", "TEPAT WAKTU."][step]}
      </Type>
      <g
        style={{
          transformOrigin: "530px 970px",
          transform: `perspective(1800px) rotateY(${Math.sin(t * 1.2) * 6}deg) rotateX(${3 + Math.sin(t) * 2}deg)`,
        }}
      >
        <rect
          x="230"
          y="517"
          width="615"
          height="942"
          rx="78"
          fill={C.yellow}
        />
        <rect
          x="205"
          y="493"
          width="615"
          height="942"
          rx="78"
          fill={C.out}
          stroke="#524C79"
          strokeWidth="5"
        />
        <rect x="225" y="515" width="575" height="896" rx="61" fill={C.cream} />
        <rect x="400" y="533" width="225" height="43" rx="22" fill={C.out} />
        <Sans x={269} y={557} size={18} fill={C.navy}>
          09:41
        </Sans>
        <Sans x={268} y={640} size={25} fill={C.navy}>
          SEJUK SIGAP
        </Sans>
        <circle cx="742" cy="630" r="18" fill={C.yellow} />
        <path
          d="M736 630l4 5 10-12"
          fill="none"
          stroke={C.navy}
          strokeWidth="4"
        />
        {step === 0 && (
          <g opacity={clamp(spring(u, 170, 28))}>
            <Type x={268} y={723} size={52} fill={C.navy}>
              AC-NYA KENAPA?
            </Type>
            <Sans x={268} y={764} size={21} fill={C.navy3}>
              Pilih yang paling terasa.
            </Sans>
            {["Tidak dingin", "Bocor", "Berisik", "Mati total"].map(
              (text, i) => {
                const x = 269 + (i % 2) * 254,
                  y = 804 + Math.floor(i / 2) * 204;
                const selected = i === 3 && u > 0.55;
                return (
                  <g
                    key={text}
                    transform={`translate(0 ${30 * (1 - spring(u - i * 0.07, 300, 24))})`}
                  >
                    <rect
                      x={x}
                      y={y}
                      width="231"
                      height="180"
                      rx="22"
                      fill={selected ? C.yellow : "#E7DEC9"}
                      stroke={selected ? C.navy : "#CCC2B1"}
                      strokeWidth={selected ? 5 : 2}
                    />
                    <Icon x={x + 115} y={y + 70} kind={i} />
                    <Sans
                      x={x + 115}
                      y={y + 147}
                      size={24}
                      anchor="middle"
                      fill={C.navy}
                    >
                      {text}
                    </Sans>
                  </g>
                );
              },
            )}
          </g>
        )}
        {step === 1 && (
          <g opacity={clamp(spring(u, 170, 28))}>
            <Type x={268} y={723} size={52} fill={C.navy}>
              JELAS DARI AWAL.
            </Type>
            <rect
              x="267"
              y="780"
              width="493"
              height="338"
              rx="23"
              fill="white"
              stroke="#D4CCBA"
              strokeWidth="2"
            />
            <Sans x={295} y={831} size={22} fill={C.navy3}>
              RINCIAN SERVIS
            </Sans>
            <Sans x={295} y={889} size={27} fill={C.navy}>
              Servis AC
            </Sans>
            <Sans x={730} y={889} size={27} anchor="end" fill={C.navy}>
              Rp150.000
            </Sans>
            <Sans x={295} y={939} size={24} fill={C.navy}>
              Cek kerusakan
            </Sans>
            <Sans x={730} y={939} size={24} anchor="end" fill={C.navy}>
              Gratis
            </Sans>
            <path
              d="M295 976H730"
              stroke="#D4CCBA"
              strokeDasharray="8 8"
              strokeWidth="3"
            />
            <Sans x={295} y={1038} size={26} fill={C.navy}>
              TOTAL PASTI
            </Sans>
            <Type x={730} y={1086} size={62} anchor="end" fill={C.navy}>
              Rp150.000
            </Type>
          </g>
        )}
        {step === 2 && (
          <g opacity={clamp(spring(u, 170, 28))}>
            <Type x={268} y={723} size={52} fill={C.navy}>
              OTW. BUKAN WACANA.
            </Type>
            <rect
              x="266"
              y="770"
              width="494"
              height="377"
              rx="22"
              fill="#D7DDCF"
            />
            <g clipPath="url(#map-clip)">
              <defs>
                <clipPath id="map-clip">
                  <rect x="266" y="770" width="494" height="377" rx="22" />
                </clipPath>
              </defs>
              <g stroke={C.cream} strokeWidth="30" fill="none">
                <path d="M230 848H800M230 1018H800M350 730v470M590 730v470M750 730L520 1200" />
              </g>
              <path
                d="M348 1059V847H589V947"
                stroke={C.navy3}
                strokeWidth="15"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M348 1059V847H589V947"
                stroke={C.yellow}
                strokeWidth="6"
                strokeDasharray="13 12"
                strokeDashoffset={-u * 60}
                fill="none"
              />
              <g
                transform={`translate(${348 + clamp(u / 1.1) * 241} ${1059 - clamp(u / 0.6) * 212 + clamp((u - 0.7) / 0.5) * 100})`}
              >
                <circle r="30" fill={C.navy} />
                <path d="M-15 0h30M0-15v30" stroke={C.yellow} strokeWidth="6" />
              </g>
              <path
                d="M590 920q-40 0-40 30q0 24 40 58q40-34 40-58q0-30-40-30"
                fill={C.yellow}
                stroke={C.navy}
                strokeWidth="5"
              />
              <circle cx="590" cy="949" r="11" fill={C.navy} />
            </g>
            <rect
              x="285"
              y="1065"
              width="454"
              height="65"
              rx="22"
              fill={C.navy}
            />
            <Sans x={512} y={1108} size={28} anchor="middle" fill={C.yellow}>
              ETA 15 menit
            </Sans>
            <Sans x={512} y={1190} size={22} anchor="middle" fill={C.navy}>
              Montir terjadwal. Kamu tinggal santai.
            </Sans>
          </g>
        )}
        <g
          transform={`translate(0 ${step === 1 ? 8 * Math.sin(clamp((u - 0.55) * 4) * Math.PI) : 0})`}
        >
          <rect
            x="269"
            y="1243"
            width="490"
            height="84"
            rx="21"
            fill={C.navy}
          />
          <rect
            x="269"
            y="1232"
            width="490"
            height="84"
            rx="21"
            fill={C.yellow}
          />
          <Sans x={514} y={1287} size={29} anchor="middle" fill={C.navy}>
            {["LANJUT →", "PESAN MONTIR →", "MONTIR MENUJU LOKASI"][step]}
          </Sans>
        </g>
        <path
          d={`M${210 + t * 105} 518h60l330 896h-60Z`}
          fill="white"
          opacity=".1"
          clipPath="url(#screen-clip)"
        />
        <defs>
          <clipPath id="screen-clip">
            <rect x="225" y="515" width="575" height="896" rx="61" />
          </clipPath>
        </defs>
      </g>
      <g transform="translate(435 1490)">
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={i * 62}
            width={i === step ? 44 : 20}
            height="10"
            rx="5"
            fill={i === step ? C.yellow : C.navy3}
          />
        ))}
      </g>
      <g
        opacity={remote}
        transform={`translate(${840 - remote * 70} ${1570 - remote * 130})`}
      >
        <Remote x={0} y={0} s={1.05} />
      </g>
    </>
  );
};
export const Gag = ({ t }: { t: number }) => {
  const hit = t >= 0.75;
  return (
    <>
      <Room t={t} cold={hit} door />
      <Kicker>TEPAT WAKTU. TEPAT DINGIN.</Kicker>
      <Type y={350} size={126} fill={C.yellow} extrude>
        {hit ? "DINGINNYA..." : "TING TONG."}
      </Type>
      <Type y={480} size={126} extrude>
        {hit ? "SAMPAI KE HATI." : "EH, UDAH SAMPAI?"}
      </Type>
      <g transform="translate(795 1010)">
        <Sh
          id="gag-door"
          fill={C.navy3}
          shade={C.navy}
          shape={<rect x="-170" y="-190" width="350" height="650" rx="8" />}
        />
        <path d="M-160-180H170V450H-160Z" fill={C.navy} />
        <g
          transform={`translate(-160 -180) scale(${1 - 0.76 * spring(t - 0.12, 90, 16)} 1)`}
        >
          <rect
            width="330"
            height="630"
            fill={C.navy3}
            stroke={C.out}
            strokeWidth="9"
          />
          <circle cx="280" cy="320" r="12" fill={C.yellow} />
        </g>
      </g>
      <Character x={795} y={1195} s={0.63} t={t} tech mood="calm" />
      <AC x={133} y={590} cold={hit} t={t} />
      {hit && (
        <g>
          <rect
            x="0"
            y="750"
            width="1080"
            height="850"
            fill="url(#halftone)"
            opacity=".5"
          />
          <g stroke={C.ice} strokeWidth="4" opacity=".6">
            {Array.from({ length: 24 }, (_, i) => (
              <path
                key={i}
                d="M0-900V-500"
                transform={`translate(500 1120) rotate(${i * 15})`}
              />
            ))}
          </g>
          <path
            d="M70 850L177 867 140 744 269 815 305 710 381 793 493 732 482 842 613 812 562 910 685 958 574 1009 595 1120 473 1074 399 1181 338 1088 210 1140 223 1033 99 1041 149 942Z"
            fill={C.yellow}
            stroke={C.out}
            strokeWidth="8"
          />
        </g>
      )}
      <Character
        x={450}
        y={1245}
        s={1.15}
        t={t}
        mood={hit ? "cold" : "waiting"}
      />
      {hit && (
        <g transform="translate(700 817) rotate(7)">
          <path
            d="M-190-42L-145-74-72-59-30-91 19-61 117-76 115-40 167-10 126 24 134 61 42 49-11 78-52 48-149 64-137 23-192 8-166-17Z"
            fill={C.yellow}
            stroke={C.out}
            strokeWidth="7"
          />
          <Type x={-15} y={23} size={66} anchor="middle" fill={C.navy}>
            NGIIING!
          </Type>
        </g>
      )}
      {hit && (
        <g fill="none" stroke={C.ice} strokeLinecap="round">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M-80 ${760 + i * 135}Q250 ${650 + i * 135} 590 ${810 + i * 135}T1200 ${700 + i * 135}`}
              strokeWidth={13 - i * 2}
              opacity=".5"
              transform={`translate(${((t * 200) % 150) - 75} 0)`}
            />
          ))}
        </g>
      )}
      {hit && (
        <g>
          <Snow x={173} y={1180} s={0.65} />
          <Snow x={895} y={888} s={0.8} />
          <Snow x={782} y={1460} s={0.75} />
        </g>
      )}
      <Stamp t={t - 2.25} text="DINGIN!" x={520} y={1430} size={96} />
    </>
  );
};
export const End = ({ t }: { t: number }) => (
  <>
    <Burst t={t} />
    <Kicker>SEJUK SIGAP · SERVIS AC PANGGILAN</Kicker>
    <Badge x={520} y={568} t={t} s={0.67} />
    <Pop t={t} delay={0} x={520} y={943} k={170} d={27}>
      <Type x={0} y={0} size={163} anchor="middle" extrude>
        AC MATI?
      </Type>
    </Pop>
    <Pop t={t} delay={0.1} x={520} y={1113} k={170} d={27}>
      <Type x={0} y={0} size={161} anchor="middle" fill={C.yellow} extrude>
        SEJUK SIGAP.
      </Type>
    </Pop>
    <g
      transform={`translate(520 1278) scale(${1 + 0.018 * Math.sin(t * Math.PI * 4)})`}
    >
      <rect
        x="-369"
        y="-65"
        width="738"
        height="116"
        rx="24"
        fill={C.out}
        transform="translate(0 13)"
      />
      <rect x="-369" y="-65" width="738" height="116" rx="24" fill={C.yellow} />
      <Sans x={0} y={10} size={43} anchor="middle" fill={C.navy}>
        UNDUH SEKARANG ↗
      </Sans>
    </g>
    <Sans x={520} y={1420} size={31} anchor="middle">
      Gratis cek kerusakan.
    </Sans>
    <Sans x={520} y={1480} size={22} anchor="middle" fill="#B5B1D4">
      Datang tepat waktu. Harga pasti. Dingin lagi.
    </Sans>
  </>
);
