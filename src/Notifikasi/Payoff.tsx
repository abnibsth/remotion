import React from 'react';
import {Background,C,Headline,Kicker,Moon,Phone,S,Worker,svgStyle} from './design';

export const Payoff:React.FC<{t:number}> = ({t}) => <>
  <Background t={t}/><Kicker>OFF DULU. HIDUP DULU.</Kicker><div className="no-corner">07 / 07</div>
  <Headline lines={['AKHIRNYA','DAMAI.']} t={t} start={.05} y={312} size={183}/>
  <div className="no-sub" data-primary="true" style={{top:755,fontSize:44,width:850,opacity:Math.max(0,Math.min(1,(t-.4)*3))}}>Kadang, yang kita butuh<br/>cuma hening.</div>
  <svg style={svgStyle} viewBox="0 0 1080 1920">
    <circle cx="539" cy="1190" r="307" fill={C.navy2} stroke="#423B70" strokeWidth="2"/>
    <Worker x={174} y={886} scale={.87} t={t*.7} mood="relaxed"/>
    <Phone x={715} y={1230} scale={.33} rotate={10} t={3} mode="settings" active/>
    <g transform={`translate(753 ${1048+Math.sin(t*2)*5}) scale(${S(t-.2,170,27)})`}><Moon size={100}/></g>
    <path d="M192 1371Q213 1355 231 1370M177 1403Q209 1380 242 1400" stroke={C.cream} strokeWidth="4" opacity=".25" fill="none"/>
  </svg>
  <div className="no-paper-label" style={{top:1498,left:88,transform:'rotate(-3deg)',background:C.yellow,boxShadow:`7px 8px 0 ${C.redDark}`}}>NOTIFIKASI BOLEH RAMAI. KEPALA JANGAN.</div>
  <div className="no-foot">NOTIFIKASI OVERLOAD! / SELESAI.</div>
</>;
