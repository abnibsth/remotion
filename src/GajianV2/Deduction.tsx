import React from 'react';
import {P,expenses,balanceAt,smooth,mix,rupiah,pulse} from './motion.mjs';
import {Text,Note} from './Objects';
import {Performer} from './Performer';

export const Deduction:React.FC<{t:number}>=({t})=>{
 const enter=smooth(t,12.65,13.35),active=expenses.reduce((a,e,i)=>t>=e.deduct?i:a,-1),event=expenses[active];
 const final=smooth(t,18.1,18.9),fall=event?smooth(t,event.deduct,event.end):0;
 const digits=rupiah(balanceAt(t)).split('');
 const bump=event?pulse(t,event.deduct,14):0;
 const size=mix(114,62,final),step=size*.61,total=(digits.length-1)*step;
 return <g>
  <rect width="1080" height="1920" fill={P.ivory}/>
  <rect x="0" y={mix(1270,0,enter)} width="1080" height="1920" rx={mix(28,0,enter)} fill={P.black}/>
  <path d={`M0 ${mix(1920,0,enter)}H1080V1920H0Z`} fill={P.black}/>
  <g opacity={enter}>
   <Text x={80} y={270} size={35} fill={P.ivory}>YANG PERGI BUKAN CUMA DIA.</Text>
   <g transform={`translate(${mix(420,540,enter)} ${mix(1410,830,enter)}) rotate(${mix(-8,0,enter)})`}>
    <rect x="-455" y="-120" width="910" height="240" rx={mix(18,0,enter)} fill={mix(0,1,enter)>.5?P.lime:P.coral} opacity={1-final}/>
    <g transform={`translate(${bump} 0)`}>
     {digits.map((c,i)=><g key={i} transform={`translate(${(i-(digits.length-1)/2)*step} ${-Math.sin(fall*Math.PI)*Math.sin(i*2)*10*(1-final)}) rotate(${Math.sin(fall*Math.PI)*(i-digits.length/2)*.8*(1-final)})`}>
      <Text x={0} y={size*.35} size={size} anchor="middle" fill={final>.5?P.lime:P.black}>{c}</Text>
     </g>)}
    </g>
    {active>=0&&final<1&&Array.from({length:5},(_,i)=>{
     const dt=t-event.deduct-i*.03,p=smooth(dt,0,.65);if(dt<0||dt>.7)return null;
     return <g key={i} transform={`translate(${total*.4+(i-2)*50+p*300} ${-120+p*p*600}) rotate(${p*110})`} opacity={1-p}><Text x={0} y={0} size={48} fill={P.coral}>{[0,0,0,'.',0][i]}</Text></g>;
    })}
   </g>
   <Performer t={t} rig={{x:mix(620,630,final),y:mix(1750,1560,final),scale:mix(1.35,1.45,final),rotation:mix(-8,5,final)+bump*.1,panic:1-final,defeat:final,reach:1-final,compression:Math.max(0,bump*.02)}}/>
   <g transform={`translate(80 ${mix(390,370,smooth(t,17,18))})`}>
    {event&&<>
     <rect width="900" height="190" rx="16" fill={P.coral}/>
     <Text x={32} y={56} size={active===4?34:39}>{event.label}</Text>
     <Text x={32} y={142} size={70}>−{rupiah(event.amount)}</Text>
    </>}
   </g>
   {active<4&&<g transform="translate(105 1080)">{Array.from({length:5-active},(_,i)=><Note key={i} x={i*32} y={i*14} w={280} h={100} r={-15+i*4} fill={i%2?P.lavender:P.lime}/>)}</g>}
   <Text x={80} y={1630} size={30} fill={P.ivory} opacity={0}>SALDO: PERGI SATU-SATU.</Text>
  </g>
 </g>;
};
