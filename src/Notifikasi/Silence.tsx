import React from 'react';
import {Background,C,Desk,Headline,Kicker,Phone,Worker,svgStyle} from './design';

export const Silence:React.FC<{t:number}> = ({t}) => <>
  <Background t={t} kind="cream"/>
  <Kicker light>SEBENTAR. TARIK NAPAS.</Kicker><div className="no-corner" style={{color:C.out}}>05 / 07</div>
  <Headline lines={['TENANG...']} t={t} start={.3} y={343} size={190} color={C.navy} extrude={false}/>
  <div className="no-sub" data-primary="true" style={{top:577,color:C.navy,fontSize:44,width:820,opacity:Math.min(1,Math.max(0,(t-.9)*2))}}>Nggak semuanya harus<br/>dijawab sekarang.</div>
  <div className="no-silence-ring"/>
  <svg style={svgStyle} viewBox="0 0 1080 1920">
    <Worker x={93} y={760} scale={1.02} t={t*.6} mood="relaxed" reach={t>1.6}/>
    <Desk light/>
    <Phone x={590} y={1272} scale={.32} rotate={-3} t={0} mode="settings"/>
  </svg>
  <div className="no-foot" style={{color:C.out}}>JEDA KECIL. BEDA BESAR.</div>
</>;
