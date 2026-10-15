import React from 'react';
import {Background,C,Headline,Kicker,Notification,Phone,Worker,svgStyle} from './design';
import {clamp} from './motion.mjs';

export const Breakdown:React.FC<{t:number}> = ({t}) => {
  const freeze=Math.min(t,2.45);
  const shock=clamp((t-.55)/.85);
  return <>
    <Background t={freeze} kind="yellow" burst/><Kicker light>MASALAH 03 / OTAK IKUT GETAR.</Kicker><div className="no-corner" style={{color:C.out}}>04 / 07</div>
    <Headline lines={['UDAH,','CUKUP!']} t={t} start={.15} y={300} size={214} color={C.cream} heavy/>
    <svg style={svgStyle} viewBox="0 0 1080 1920">
      <circle cx="711" cy="1370" r={60+shock*1250} stroke={C.cream} fill="none" strokeWidth={20*(1-shock)} opacity={1-shock}/>
      <Worker x={-31} y={738} scale={1.34} t={Math.floor(freeze*8)/8} mood="breakdown"/>
      {[0,1,2,3,4,5].map(i=>{const a=i*6.283/6+freeze*.68; return <Notification key={i} x={330+Math.cos(a)*410} y={1100+Math.sin(a)*370} w={390} t={t} start={i*.08} rotate={Math.sin(a)*18} scale={.8} text={['Ada pesan baru!','Deadline hari ini!','Tugas belum selesai!','99+ notifikasi','Meeting dimulai!','Balas dong...'][i]} red={i%2===0}/>;})}
      <Phone x={664} y={1300} scale={.42} t={freeze+2} rotate={10} stress={22}/>
      <path d="M214 1032 168 998 182 1073M852 1040 904 1000 886 1083" fill="none" stroke={C.redDark} strokeWidth="12"/>
    </svg>
    <div className="no-foot" style={{color:C.out}}>TOLONG. INI BUKAN LOMBA BALAS CHAT.</div>
  </>;
};
