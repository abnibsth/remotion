import React from 'react';
import {P,smooth,mix,spring,pulse} from './motion.mjs';
import {Text} from './Objects';
import {Performer} from './Performer';

export const Finale:React.FC<{t:number}>=({t})=>{
 const dt=t-24,expand=smooth(dt,.4,1.3),wallet=smooth(dt,1.5,2.3),fall=smooth(dt,2.35,2.9),title=smooth(dt,3,3.7),cta=spring(dt-4.15,155,14);
 const x=mix(775,540,expand),y=mix(540,1040,expand),w=mix(300,900,expand),h=mix(360,720,expand),round=mix(12,55,wallet);
 return <g>
  <rect width="1080" height="1920" fill={P.ivory}/>
  <g opacity={1-expand}>
   <Text x={80} y={340} size={78} heavy>GAJIAN</Text><Text x={80} y={430} size={78} heavy>BERIKUTNYA?</Text>
  </g>
  <Performer t={t} rig={{x:mix(430,540,expand),y:mix(1510,1180,fall),scale:mix(1.45,.6,fall),defeat:1-fall,panic:fall,rotation:mix(-5,75,fall),fall:fall*.5,gaze:.7}} opacity={(1-smooth(dt,1.4,1.6))}/>
  <g transform={`translate(${x} ${y}) rotate(${pulse(dt,.65,3)})`}>
   <rect x={-w/2+10} y={-h/2+15} width={w} height={h} rx={round} fill={P.black} opacity=".09"/>
   <rect x={-w/2} y={-h/2} width={w} height={h} rx={round} fill={wallet>.5?P.black:P.lavender}/>
   <g opacity={1-wallet}>
    <rect x={-w/2} y={-h/2} width={w} height={h*.17} rx="8" fill={P.coral}/>
    <Text x={0} y={-h*.38} size={mix(17,36,expand)} anchor="middle">GAJIAN BERIKUTNYA:</Text>
    <g opacity={1-expand}>{Array.from({length:28},(_,i)=><Text key={i} x={-w*.39+i%7*w*.125} y={-h*.15+Math.floor(i/7)*h*.14} size={19}>{i+1}</Text>)}</g>
    <g opacity={expand}><Text x={0} y={-15} size={116} anchor="middle" heavy>MASIH</Text><Text x={0} y={125} size={116} anchor="middle" heavy>LAMA.</Text></g>
    <path d={`M${-w*.27} ${-h/2-10}v40M${w*.27} ${-h/2-10}v40`} stroke={P.black} strokeWidth={mix(10,18,expand)} strokeLinecap="round"/>
   </g>
   <g opacity={wallet}>
    <path d={`M${-w*.42} ${-h*.12}Q0 ${-h*.42} ${w*.42} ${-h*.12}L${w*.38} ${h*.12}Q0 ${-h*.12} ${-w*.38} ${h*.12}Z`} fill={P.ivory}/>
    <path d={`M${-w*.42} ${-h*.12}L${-w*.35} ${-h*.28}Q0 ${-h*.51} ${w*.35} ${-h*.28}L${w*.42} ${-h*.12}`} stroke={P.shade} strokeWidth="4" fill="none"/>
    <Text x={0} y={-h*.10} size={34} anchor="middle" fill={P.black}>KOSONG.</Text>
   </g>
   <g opacity={wallet} transform={`translate(0 ${mix(120,0,smooth(dt,2.6,3))})`}>
    <path d={`M${-w/2} 0Q0 100 ${w/2} 0V${h/2-50}Q${w/2} ${h/2} ${w/2-50} ${h/2}H${-w/2+50}Q${-w/2} ${h/2} ${-w/2} ${h/2-50}Z`} fill={P.black}/>
    <rect x={w*.22} y="60" width={w*.3} height="105" rx="20" fill={P.coral}/><circle cx={w*.36} cy="113" r="12" fill={P.black}/>
    <path d={`M${-w*.43} 80V${h*.38}H${w*.36}`} fill="none" stroke={P.ivory} strokeDasharray="8 10" strokeWidth="3" opacity=".32"/>
   </g>
  </g>
  {dt>=2.3&&dt<3.05&&<g>
   <defs><clipPath id="wallet-entry"><rect x="110" y="150" width="860" height="850"/></clipPath></defs>
   <g clipPath="url(#wallet-entry)"><Performer t={t} rig={{x:540,y:mix(900,1360,fall),scale:mix(1,.35,fall),rotation:fall*100,panic:1,fall:fall*.5}} opacity={1-smooth(dt,2.8,3.05)}/></g>
  </g>}
  <g opacity={title} transform={`translate(0 ${mix(50,0,title)})`}>
   <Text x={80} y={315} size={95} heavy>BARU MASUK,</Text><Text x={80} y={425} size={95} heavy>UDAH PAMIT.</Text>
  </g>
  <g opacity={dt<4.15?0:1} transform={`translate(540 1550) scale(${Math.max(.001,cta)} ${Math.max(.001,1+(1-cta)*.3)}) rotate(${pulse(dt,4.15,-3)})`}>
   <rect x="-440" y="-105" width="880" height="160" rx="80" fill={P.lime}/>
   <Text x={0} y={7} size={95} anchor="middle" heavy primary>RELATE GAK?</Text>
  </g>
 </g>;
};
