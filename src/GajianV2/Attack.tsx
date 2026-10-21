import React from 'react';
import {P,expenses,smooth,spring,mix,boardAt,bodyAt,pulse} from './motion.mjs';
import {Text,Note,PaperTrail} from './Objects';
import {Performer} from './Performer';

export const Attack:React.FC<{t:number}>=({t})=>{
 const collision=smooth(t,7,7.2),impact=pulse(t,7.1,25),arrive=spring(t-7.02,110,20);
 const b=boardAt(7),body=bodyAt(7);
 const hits=expenses.slice(0,4).filter(e=>t>=e.hit).length;
 const stage=smooth(t,7.3,8),end=smooth(t,12.4,13.3);
 const remaining=[10,7,5,3,2][hits];
 const tumble=smooth(t,7.1,7.72),recover=smooth(t,7.8,8.4);
 const turn=mix(0,-38,tumble)*(1-recover);
 const recoil=expenses.slice(0,4).reduce((v,e)=>v+pulse(t,e.hit,9),0);
 return <g>
  <rect width="1080" height="1920" fill={P.ivory}/>
  <g opacity={1-stage}><PaperTrail t={t}/><Text x={80} y={360} size={108} heavy>BERASA</Text><Text x={80} y={480} size={117} heavy>SULTAN.</Text></g>
  <g transform={`translate(${impact} 0)`}>
   <g opacity={1-end}>
    {Array.from({length:10},(_,i)=>{
     const removed=i>=remaining,hitTime=expenses[Math.max(0,hits-1)]?.hit??99,dt=Math.max(0,t-hitTime);
     const toss=removed?smooth(dt,0,.55):0;
     const x=mix(b.x,410,stage)+(removed?toss*(i%2?1000:-900):i*8);
     const y=mix(b.y,1410,stage)+i*8+(removed?toss*600:0);
     return <Note key={i} x={x} y={y} w={mix(800,690,stage)} h={mix(210,170,stage)} r={mix(b.r,-8,stage)+(removed?toss*(i%2?70:-85):0)} opacity={removed?1-toss:1} fill={i%2?P.lime:'#A4CC5E'}/>;
    })}
   </g>
   <Performer t={t} rig={{x:mix(body.x,840,stage)-tumble*175*(1-recover),y:mix(body.y,1390,stage)-Math.sin(tumble*Math.PI)*130+hits*12,scale:1.35,rotation:turn+hits%2*3+recoil,panic:collision,surf:1-stage,reach:stage*.5,compression:pulse(t,7.1,.5)}} opacity={1-end}/>
   <g transform={`translate(${mix(1300,130,arrive)} ${mix(510,360,stage)}) rotate(${mix(-9,0,stage)})`} opacity={1-end}>
    <rect width="900" height="230" rx={mix(0,20,stage)} fill={P.coral}/>
    <Text x={40} y={156} size={139} heavy>TAGIHAN!</Text>
   </g>
   {expenses.slice(0,4).map((e,i)=>{
    const dt=t-e.hit;if(dt<0)return null;
    const p=spring(dt,210,24),hit=pulse(t,e.hit,18),finished=t>(expenses[i+1]?.hit??99),exit=finished?smooth(t,(expenses[i+1]?.hit??99),(expenses[i+1]?.hit??99)+.4):0;
    const x=mix(1120,80,p),y=660+i*145;
    return <g key={e.label} transform={`translate(${x+hit} ${y}) rotate(${-2+(1-p)*12})`} opacity={1-end}>
     <rect x="10" y="10" width="630" height="125" rx="14" fill={P.black} opacity=".08"/>
     <rect width="630" height="125" rx="14" fill={exit?P.ivory:P.coral} stroke={P.black} strokeWidth={exit?2:0}/>
     <Text x={25} y={43} size={25}>{e.label}</Text>
     <Text x={605} y={92} size={49} anchor="end">−Rp{e.amount.toLocaleString('id-ID')}</Text>
     <path d="M27 70H78M52 45V96" stroke={P.black} strokeWidth="4" transform={`rotate(${exit*45} 52 70)`}/>
    </g>;
   })}
  </g>
  <g opacity={stage*(1-end)}><Text x={80} y={1570} size={34}>BARU SENANG SEBENTAR.</Text></g>
 </g>;
};
