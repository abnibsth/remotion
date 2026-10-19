import React from 'react';
import {C, Label, mono, sans, Reveal} from './design';
import {balanceAt, EVENTS, formatIDR, mix, progress} from './motion.mjs';
import {DrainCards} from './Expenses';

export const Balance:React.FC<{t:number}>=({t})=>{
 const enter=progress(t,4.55,5), drain=progress(t,8.85,9.45), collapse=progress(t,12.5,13), returnPaper=progress(t,16,16.4);
 const balance=balanceAt(t), size=mix(mix(62,164,drain),36,collapse);
 const y=mix(mix(873,550,drain),620,collapse);
 const active=EVENTS.deductions.findIndex(s=>t>=s&&t<s+.55);
 const roll=active<0?0:Math.sin(progress(t,EVENTS.deductions[active],EVENTS.deductions[active]+.55)*Math.PI*8)*5*(active>=3?1:.35);
 return <g opacity={enter}>
  <DrainCards t={t}/>
  <g opacity={(1-collapse)*(1-returnPaper)}>
   <Label x={250} y={834} size={19} opacity={1-drain}>STILL YOURS</Label>
   <Label x={960} y={353} size={25} anchor="middle" opacity={drain}>AVAILABLE BALANCE</Label>
   <path d="M480 593H1440" stroke={C.ink} strokeWidth={1} opacity={drain*.3}/>
  </g>
  <g opacity={1-returnPaper}>
   <svg x={100} y={y-size*1.24} width={1720} height={size*1.6} overflow="hidden">
    <text data-balance={balance} data-type="balance" x={860} y={size*1.24+roll} textAnchor="middle" fontFamily={collapse>.5?mono:sans} fontWeight={collapse>.5?400:700} fontSize={size} letterSpacing={-5*drain*(1-collapse)}>{formatIDR(balance)}</text>
   </svg>
  </g>
  <g opacity={1-progress(t,15.85,16.25)}>
   <Reveal t={t} start={14.05} x={360} y={287} w={1200} h={130} duration={.22}><text x={600} y={108} textAnchor="middle" fontFamily={sans} fontSize={122} fontWeight={700}>WAIT...</text></Reveal>
   <Reveal t={t} start={14.7} x={240} y={416} w={1440} h={143} duration={.22}><text x={720} y={120} textAnchor="middle" fontFamily={sans} fontSize={138} fontWeight={700} letterSpacing={-5}>THAT’S IT?</text></Reveal>
  </g>
 </g>;
};
