import React from 'react';
import {Background,C,Desk,Headline,Kicker,Notification,Phone,Worker,svgStyle} from './design';

export const Coming:React.FC<{t:number}> = ({t}) => <>
  <Background t={t}/><Kicker>MASALAH 01 / BARU JUGA DUDUK.</Kicker><div className="no-corner">02 / 07</div>
  <Headline lines={['KOK NGECHAT','TERUS?!']} t={t} start={.35} y={310} size={151}/>
  <svg style={svgStyle} viewBox="0 0 1080 1920">
    <g opacity=".45" stroke={C.cream} strokeWidth="4" fill="none"><path d="M53 720V1200M53 771H206M893 702V1180M893 766H1040"/><circle cx="173" cy="825" r="65"/><path d="M173 778V825L202 838"/></g>
    <Worker x={70} y={650} scale={1.12} t={t} mood={t<.65?'relaxed':'worried'}/>
    <Desk/>
    <Phone x={635} y={1195} scale={.31} rotate={15} t={t+1} stress={9}/>
    <Notification x={70} y={702} t={t} start={.12} rotate={-7} text="Meeting dimulai!"/>
    <Notification x={598} y={921} w={380} t={t} start={.85} rotate={8} text="Bisa revisi?" sub="PROJECT BARU"/>
    <Notification x={78} y={1151} w={390} t={t} start={1.35} rotate={-8} text="Ada pesan baru!"/>
    <Notification x={610} y={658} w={398} t={t} start={2.05} rotate={5} text="Deadline hari ini!" red/>
    <g opacity={t>.65?1:0} transform="translate(766 1170) rotate(12)"><text fill={C.yellow} fontFamily="Anton" fontSize="56" stroke={C.out} strokeWidth="2" paintOrder="stroke">BRRRT!</text><path d="M24 20 41 44 28 64M62 17 79 42 64 66" stroke={C.yellow} strokeWidth="7" fill="none"/></g>
  </svg>
  <div className="no-foot">STATUS: NIATNYA MAU SANTAI.</div>
</>;
