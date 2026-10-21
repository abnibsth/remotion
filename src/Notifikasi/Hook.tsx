import React from 'react';
import {Background,C,Headline,Kicker,Notification,Phone,S,svgStyle} from './design';

export const Hook: React.FC<{t:number}> = ({t}) => <>
  <Background t={t}/>
  <Kicker>SEBUAH HARI YANG BIASA.</Kicker>
  <div className="no-corner">01 / 07</div>
  {t<1.08 ? <Headline lines={['TING!']} t={t} start={.08} y={295} size={255} heavy/> : <Headline lines={['SATU','NOTIFIKASI...']} t={t} start={1.08} y={300} size={145}/>}
  <svg viewBox="0 0 1080 1920" style={svgStyle}>
    <ellipse cx="570" cy="1510" rx="340" ry="65" fill={C.out} opacity=".7"/>
    <g transform={`translate(540 1120) scale(${1+t*.055}) translate(-540 -1120)`}>
      <Phone x={330} y={752} scale={1.12} rotate={-13+t*2} t={t} stress={t>.3?2:0}/>
      <Notification x={118} y={905} w={470} t={t} start={.3} text="Ada pesan baru!" rotate={-7}/>
      <Notification x={481} y={1100} w={425} t={t} start={1.3} text="Meeting dimulai!" rotate={5}/>
      <Notification x={90} y={1317} w={490} t={t} start={1.55} text="Deadline hari ini!" rotate={-5} red/>
      <g opacity={t>=1.8?1:0} transform={`translate(775 850) scale(${S(t-1.8,300,11)})`}><circle r="73" fill={C.red} stroke={C.out} strokeWidth="7"/><text textAnchor="middle" y="20" fill={C.cream} fontFamily="Anton" fontSize="58">+3</text></g>
    </g>
    <path d="M196 798 165 762M231 784 218 738M813 1378 852 1403" stroke={C.yellow} strokeWidth="8" strokeLinecap="round"/>
  </svg>
  <div className="no-foot">NOTIFIKASI OVERLOAD! / A SHORT COMIC</div>
</>;
