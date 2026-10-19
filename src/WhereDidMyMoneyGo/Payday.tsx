import React from 'react';
import {C, Label, mono, sans} from './design';
import {mix, progress, spring} from './motion.mjs';

export const Payday:React.FC<{t:number}> = ({t})=>{
 const unfold=progress(t,2.15,3.55), track=progress(t,4.05,5);
 const show=1-progress(t,4.1,4.65);
 const rise=16*spring(t-.12);
 const numberSize=mix(146,66,unfold);
 return <g opacity={show}>
   <g opacity={1-progress(t,2.12,2.5)}>
    <Label x={960} y={295} anchor="middle" size={24} opacity={progress(t,.15,.55)}>THE BEST NOTIFICATION OF THE MONTH.</Label>
    <text x={960} y={800} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={69} opacity={progress(t,1.05,1.5)}>For a moment, it’s all yours.</text>
    <path d="M897 853H1023" stroke={C.red} strokeWidth={5} strokeDasharray="126" strokeDashoffset={126*(1-progress(t,1.4,1.9))}/>
   </g>
   <g transform={`translate(960 ${mix(548-rise,490,unfold)})`}>
    <svg x={-650} y={-170} width={1300} height={200} overflow="hidden">
     <text data-type="hero" x={650} y={170+180*(1-spring(t+.06,17,.95))} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={numberSize} letterSpacing={-6+4*unfold}>Rp5.000.000</text>
    </svg>
   </g>
   <g transform={`translate(${960-212+100*(1-progress(t,.28,.7))} ${mix(592,535,unfold)})`} opacity={progress(t,.28,.55)}>
    <rect width={424} height={57} fill={C.green}/>
    <circle cx={31} cy={28} r={6} fill={C.ink}/>
    <text x={58} y={37} fontFamily={mono} fontSize={25}>SALARY RECEIVED</text>
   </g>
   <g opacity={progress(t,2.95,3.25)}>
    <text x={960} y={300} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={72}>PAYDAY</text>
    <Label x={960} y={346} anchor="middle" size={20}>TRANSACTION 000 / INCOMING</Label>
    <path d="M704 380H1216" stroke={C.ink} strokeDasharray="8 8"/>
    <Label x={960} y={420} anchor="middle" size={23}>AVAILABLE BALANCE</Label>
   </g>
   {Array.from({length:7},(_,i)=>{
    const p=progress(t,2.95+i*.13,3.18+i*.13);
    return <g key={i} opacity={p*(1-track)}>
      <path d={`M708 ${635+i*37}H${708+mix(0,i%2?290:340,p)}`} stroke={C.ink} strokeWidth={i===0?3:2} opacity={i===0?.8:.3}/>
      <path d={`M1130 ${635+i*37}H${1130+82*p}`} stroke={C.ink} strokeWidth={2} opacity={.4}/>
    </g>;
   })}
   <Label x={960} y={943} anchor="middle" size={17} opacity={progress(t,3.65,3.9)}>KEEP THIS RECEIPT.</Label>
  </g>;
};
