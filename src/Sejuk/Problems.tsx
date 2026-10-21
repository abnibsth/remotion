import {
  AC,
  Bubble,
  C,
  Character,
  Dust,
  Kicker,
  Pop,
  Remote,
  Rise,
  Room,
  Sans,
  Sh,
  Stamp,
  Tape,
  Type,
} from "./art";
import { clamp, spring } from "./motion";
export const Hook = ({ t }: { t: number }) => (
  <>
    <Room t={t} />
    <Kicker>SIANG BOLONG. AC BENGONG.</Kicker>
    <Rise t={t} y={240}>
      <Type x={26} y={133} size={145} fill={C.yellow} extrude>
        AC MATI,
      </Type>
    </Rise>
    <Rise t={t} delay={0.18} y={390}>
      <Type x={26} y={132} size={145} extrude>
        HATI PANAS
      </Type>
    </Rise>
    <AC x={230} y={655} />
    <Character x={505} y={1110} s={1.08} t={t} />
    <Remote x={715} y={1100} t={t} />
    <g transform="translate(878 840)">
      <Sh
        id="thermometer"
        fill={C.cream}
        shade="#AAA6BE"
        shape={<path d="M-29 0Q0-28 29 0V240A57 57 0 1 1-29 240Z" />}
      />
      <path
        d={`M0 278V${230 - clamp(t / 1.7) * 210}`}
        stroke={C.red}
        strokeWidth="27"
        strokeLinecap="round"
      />
      <circle cy="278" r="36" fill={C.red} />
    </g>
    <Pop t={t} delay={0.7} x={182} y={913}>
      <Type x={0} y={0} size={42} fill={C.yellow} rotate={-12}>
        KLIK. KLIK. KLIK.
      </Type>
    </Pop>
    <Tape x={205} y={1420} w={610} t={t - 0.55}>
      PANASNYA PERSONAL.
    </Tape>
    <g opacity=".17" stroke={C.gold} strokeWidth="9" fill="none">
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${240 + i * 170} 1000q-38-50 0-90t0-90`}
          transform={`translate(0 ${-((t * 50) % 90)})`}
        />
      ))}
    </g>
  </>
);
export const Wait = ({ t }: { t: number }) => (
  <>
    <Room t={t} />
    <Kicker>MASALAH 01</Kicker>
    <Type y={347} size={112} fill={C.yellow} extrude>
      JANJI SEBENTAR
    </Type>
    <Type y={470} size={125} extrude>
      LAGI. LAGI. LAGI.
    </Type>
    <g transform="translate(778 765)">
      <circle r="114" fill={C.out} transform="translate(8 12)" />
      <circle r="114" fill={C.cream} stroke={C.out} strokeWidth="7" />
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d="M0-88v14"
          transform={`rotate(${i * 30})`}
          stroke={C.navy}
          strokeWidth="6"
        />
      ))}
      <path
        d="M0 0v-72"
        stroke={C.navy}
        strokeWidth="9"
        strokeLinecap="round"
        transform={`rotate(${t * 600})`}
      />
      <path
        d="M0 0v-46"
        stroke={C.red}
        strokeWidth="12"
        strokeLinecap="round"
        transform={`rotate(${t * 70})`}
      />
    </g>
    <g transform="translate(0 -25)">
      <Character x={475} y={1160} s={1.1} t={t} raisin={clamp((t - 1) / 2)} />
    </g>
    <Bubble x={95} y={618} w={570} t={t - 0.1}>
      Sebentar lagi, Kak.
    </Bubble>
    <Bubble x={137} y={805} w={530} t={t - 1.3} size={36}>
      Sebentar lagi, Kak.
    </Bubble>
    <Bubble x={191} y={981} w={505} t={t - 2.5} size={34}>
      Sebentar lagi, Kak.
    </Bubble>
    <Tape x={490} y={1328} w={350} t={t - 2.85}>
      3 JAM
    </Tape>
    <g>
      <rect x="163" y="1416" width="689" height="73" rx="12" fill={C.navy} />
      <Sans x={507} y={1465} size={27} anchor="middle">
        NUNGGU SAMPAI JADI KISMIS.
      </Sans>
    </g>
  </>
);
export const Price = ({ t }: { t: number }) => (
  <>
    <Kicker>MASALAH 02</Kicker>
    <Type y={360} size={144} fill={C.yellow} extrude>
      HARGA GAIB.
    </Type>
    <Sans y={431} size={31}>
      AWALNYA SEGITU. UJUNGNYA SEGUNUNG.
    </Sans>
    <g transform={`translate(510 907) rotate(${-5 + Math.sin(t * 3) * 1.1})`}>
      <path
        d="M-330-355H330V379L301 359 271 379 241 359 211 379 181 359 151 379 121 359 91 379 61 359 31 379 1 359-29 379-59 359-89 379-119 359-149 379-179 359-209 379-239 359-269 379-299 359-330 379Z"
        fill={C.out}
        transform="translate(13 20)"
      />
      <path
        d="M-330-355H330V379L301 359 271 379 241 359 211 379 181 359 151 379 121 359 91 379 61 359 31 379 1 359-29 379-59 359-89 379-119 359-149 379-179 359-209 379-239 359-269 379-299 359-330 379Z"
        fill={C.cream}
      />
      <Sans x={-270} y={-283} size={27} fill={C.navy} spacing={5}>
        NOTA SERVIS AC
      </Sans>
      <path
        d="M-270-241H270M-270 115H270"
        stroke={C.navy}
        strokeWidth="3"
        strokeDasharray="10 9"
      />
      <Type
        x={0}
        y={-111}
        size={83}
        anchor="middle"
        fill={t > 1 ? C.navy3 : C.navy}
      >
        Rp150.000
      </Type>
      {t > 1 && <path d="M-251-165L247-121" stroke={C.red} strokeWidth="13" />}
      <Pop t={t} delay={1.125} x={0} y={14}>
        <Type x={0} y={0} size={96} anchor="middle" fill={C.red}>
          Rp350.000
        </Type>
      </Pop>
      <Sans x={-267} y={188} size={27} fill={C.navy}>
        BIAYA TAMBAHAN
      </Sans>
      <Type x={264} y={195} size={61} anchor="end" fill={C.navy}>
        ???
      </Type>
      <g stroke={C.navy} strokeWidth="5" opacity=".5">
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d={`M${-230 + i * 20} 263v45`} />
        ))}
      </g>
    </g>
    <Bubble x={160} y={1120} w={685} t={t - 1.8} size={37}>
      Itu belum sama freon.
    </Bubble>
    <Stamp t={t - 2.5} text="NGGAK JELAS" y={1410} />
  </>
);
export const Ghost = ({ t }: { t: number }) => (
  <>
    <Room t={t} door />
    <Kicker>MASALAH 03</Kicker>
    <Type y={350} size={135} fill={C.yellow} extrude>
      MONTIR ILANG.
    </Type>
    <Sans y={425} size={32}>
      YANG DATANG CUMA HARAPAN.
    </Sans>
    <g transform="translate(681 1055)">
      <Sh
        id="door-frame"
        fill={C.navy3}
        shade={C.navy}
        shape={<rect x="-120" y="-335" width="335" height="745" rx="10" />}
      />
      <rect
        x="-95"
        y="-310"
        width="285"
        height="695"
        fill={C.navy2}
        stroke={C.out}
        strokeWidth="7"
      />
      <circle cx="145" cy="47" r="13" fill={C.yellow} />
      <path
        d="M-85 397H190L-300 490-530 470Z"
        fill={C.yellow}
        opacity=".12"
        style={{ mixBlendMode: "screen" }}
      />
    </g>
    <Character x={345} y={1175} s={0.91} t={t} mood="waiting" />
    <Pop t={t} delay={0.05} x={105} y={516}>
      <rect
        width="715"
        height="120"
        rx="24"
        fill={C.navy3}
        stroke={C.out}
        strokeWidth="6"
      />
      <Sans x={35} y={55} size={24} fill={C.yellow}>
        MONTIR
      </Sans>
      <Sans x={35} y={95} size={35}>
        Sudah di jalan
      </Sans>
    </Pop>
    <Pop t={t} delay={0.875} x={114} y={672}>
      <rect
        width="260"
        height="225"
        rx="25"
        fill="#817994"
        stroke={C.out}
        strokeWidth="6"
      />
      <path
        d="M45 176V70L91 105Q130 81 165 103L209 68V176Q134 230 45 176"
        fill={C.cream}
        stroke={C.out}
        strokeWidth="6"
      />
      <path
        d="M82 151l24 7M161 156l23-7M126 177l10 8 10-8"
        fill="none"
        stroke={C.out}
        strokeWidth="8"
      />
      <Sans x={130} y={256} size={24} anchor="middle" fill="#B5B1C8">
        ✓✓ dibaca
      </Sans>
    </Pop>
    <Dust t={t} />
    <Tape x={152} y={1400} w={685} t={t - 1.6}>
      BALASANNYA: HENING.
    </Tape>
  </>
);
export const Calm = ({ t }: { t: number }) => (
  <>
    <rect width="1080" height="1920" fill={C.cream} />
    <Kicker dark>SUDAH. TARIK NAPAS.</Kicker>
    <g transform={`translate(0 ${16 * (1 - spring(t, 90, 18))})`}>
      <Type x={510} y={585} size={237} anchor="middle" fill={C.navy}>
        Tenang.
      </Type>
      <path
        d="M144 642Q478 666 851 635"
        fill="none"
        stroke={C.yellow}
        strokeWidth="22"
      />
    </g>
    <g transform={`translate(0 ${-7 * Math.sin(clamp(t / 1.5) * Math.PI)})`}>
      <Character x={510} y={1227} s={1.25} t={0} mood="calm" />
    </g>
    <Sans x={510} y={720} size={30} anchor="middle" fill={C.navy}>
      ADA YANG GERCEP. BENERAN.
    </Sans>
  </>
);
