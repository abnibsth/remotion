import React from 'react';
import {Background,C,Headline,Kicker,Moon,Notification,Phone,S,svgStyle} from './design';
import {clamp} from './motion.mjs';

export const Solution:React.FC<{t:number}> = ({t}) => {
  const active=t>=.85;
  const clear=clamp(S(t-.85,170,27));
  return <>
    <Background t={t} kind="cream"/>
    <div style={{position:'absolute',inset:0,clipPath:`circle(${active?clear*2100:0}px at 650px 1270px)`}}><Background t={t}/></div>
    <Kicker light={!active}>SATU SENTUHAN. AMBIL KENDALI.</Kicker><div className="no-corner" style={{color:active?C.cream:C.out}}>06 / 07</div>
    <Headline lines={active?['AKTIF.']:['MODE JANGAN','GANGGU']} t={t} start={active?.85:0} y={320} size={active?225:136} color={active?C.yellow:C.navy} extrude={active}/>
    <svg style={svgStyle} viewBox="0 0 1080 1920">
      <g opacity={1-clear} transform={`translate(0 ${clear*220}) scale(${1-clear*.4})`}>
        <Notification x={58} y={886} w={400} t={2} text="Meeting dimulai!" rotate={-9}/>
        <Notification x={595} y={1140} w={400} t={2} text="Ada pesan baru!" rotate={8}/>
      </g>
      {active&&<g opacity={clamp(clear*.7)}><circle cx="557" cy="1130" r={280+clear*140} fill="none" stroke={C.yellow} strokeWidth="2"/><circle cx="557" cy="1130" r={300+clear*180} fill="none" stroke={C.yellow} strokeWidth="1" opacity=".4"/></g>}
      <Phone x={315} y={715} scale={1.07} rotate={-3+t*1.2} t={t} mode="settings" active={active}/>
      <g transform={`translate(${820-clamp(S(t-.35,170,27))*190+clamp(S(t-1.08,170,27))*320} ${1410-clamp(S(t-.35,170,27))*115+clamp(S(t-1.08,170,27))*180}) rotate(-25)`} opacity={t<1.6?1:0} stroke={C.out} strokeWidth="6" strokeLinejoin="round">
        <path d="M12 179 9 20Q9-12 31-14 53-14 56 15L58 80 80 72Q98 69 106 84 133 77 145 96 172 96 177 118L172 206 49 236Z" fill={C.skin}/><path d="M139 117 141 173M106 104 108 161M78 100 80 152" strokeWidth="3"/>
      </g>
      {active && <g transform={`translate(817 730) scale(${S(t-.95,300,18)})`}><Moon size={95}/></g>}
    </svg>
    <div className="no-sub" data-primary="true" style={{top:580,color:active?C.cream:C.out,opacity:active?clear:0,fontSize:42,width:830}}>Dunia tetap jalan.<br/>Kamu boleh pelan.</div>
    <div className="no-foot" style={{color:active?C.cream:C.out}}>MODE JANGAN GANGGU / ON</div>
  </>;
};
