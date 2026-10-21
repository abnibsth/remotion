import React from 'react';
import {Background,C,Headline,Kicker,Notification,Phone,Worker,svgStyle,S} from './design';
import {clamp} from './motion.mjs';

const cards=[
  {x:60,y:698,r:-8,text:'Meeting dimulai!'}, {x:704,y:876,r:9,text:'Ada pesan baru!'},
  {x:42,y:1135,r:-12,text:'Tugas belum selesai!'}, {x:611,y:1205,r:8,text:'Deadline hari ini!'},
  {x:42,y:1410,r:-5,text:'Bisa revisi sekarang?'}, {x:545,y:1497,r:6,text:'99+ notifikasi'},
  {x:-160,y:877,r:-17,text:'Meeting dimulai!'}, {x:820,y:1015,r:15,text:'Ada pesan baru!'},
  {x:-205,y:1253,r:-10,text:'Deadline hari ini!'}, {x:792,y:1400,r:11,text:'Tugas belum selesai!'},
];
export const Chaos:React.FC<{t:number}> = ({t}) => <>
  <Background t={t} burst/><Kicker>MASALAH 02 / SEMUA MINTA CEPAT.</Kicker><div className="no-corner">03 / 07</div>
  <Headline lines={t<1.8?['99+','NOTIFIKASI.']:['OVERLOAD!!!']} t={t} start={t<1.8?.05:1.8} y={t<1.8?300:348} size={t<1.8?157:163} heavy/>
  <svg style={svgStyle} viewBox="0 0 1080 1920">
    <g opacity=".22" transform="translate(540 1040)">{Array.from({length:12},(_,i)=><rect key={i} x={-370+(i%3)*280} y={-340+Math.floor(i/3)*230} width="280" height="85" rx="12" fill={C.cream} stroke={C.red} strokeWidth="6" transform={`rotate(${(i%2?1:-1)*(10+t*2)})`}/>)}</g>
    <Worker x={5} y={t<1.8?690:620} scale={1.3+(t>1.8?.025:0)} t={Math.floor(t*8)/8} mood="panic"/>
    <Phone x={702} y={1250} scale={.4} rotate={-9} t={t+2} stress={17}/>
    {cards.map((c,i)=><Notification key={i} x={c.x+Math.sin(t*2+i)*8} y={c.y+Math.cos(t*2+i)*6} w={i===2?460:420} t={t} start={i<2?i*.18:.42+(i-2)*.24} text={c.text} rotate={c.r} scale={i>5?.8:1} red={i%3===0}/>)}
    <g transform={`translate(826 643) rotate(11) scale(${S(t-.7,300,11)})`} opacity={t>.7?1:0}><path d="m0-70 21 31 34-13 1 38 35 17-27 26 10 36-38-1-20 30-23-30-36 2 7-36-26-25 36-17 1-37 33 12Z" fill={C.red} stroke={C.out} strokeWidth="6"/><text x="0" y="19" textAnchor="middle" fill={C.cream} fontFamily="Anton" fontSize="54">!</text></g>
    <rect width="1080" height="1920" fill={C.red} opacity={t>1.8?clamp(1-(t-1.8)*10)*.27:0} style={{mixBlendMode:'multiply'}}/>
  </svg>
  {t>=2.25 && <div className="no-paper-label" style={{left:92,top:590,transform:'rotate(-4deg)'}}>OTAK: SEDANG MENGHUBUNGKAN ULANG...</div>}
  <div className="no-foot">KAPASITAS SOSIAL: 0%</div>
</>;
