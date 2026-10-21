import React from 'react';
import {P,bodyAt,boardAt,smooth,mix,spring,pulse} from './motion.mjs';
import {Performer,prototypeRig} from './Performer';
import {Text,Phone,SalaryPlatform,PaperTrail} from './Objects';

export const Opening:React.FC<{t:number}>=({t})=>{
 const board=boardAt(t),body=bodyAt(t),morph=board.morph;
 const follow=smooth(t,3.1,6.8),titleExit=smooth(t,2.7,3.25);
 const expand=spring(t-1.95,100,15),arrival=smooth(t,.35,.8);
 const titlePush=smooth(t,1.9,2.25)*(1-smooth(t,2.6,3.3));
 const anticipate=smooth(t,6.45,6.9);
 return <g>
  <rect width="1080" height="1920" fill={P.ivory}/>
  <path d={`M${-700-follow*380} 1570Q400 1130 1720 1530`} fill="none" stroke={P.lavender} strokeWidth="140" opacity={morph*.24}/>
  <PaperTrail t={t} opacity={morph}/>
  <g transform={`translate(${-follow*35+anticipate*22} ${-follow*24})`}>
   <Phone t={t} opacity={(1-smooth(t,2.55,3.35))*.98}/>
   <g opacity={1-titleExit}>
    <Text x={78} y={260} size={125} heavy transform={`translate(${mix(-20,0,expand)} 0) scale(${1+expand*.05} 1)`}>GAJIAN</Text>
    <Text x={78} y={395} size={125} heavy transform={`translate(0 ${-pulse(t,2.1,18)})`}>MASUK!</Text>
    <Text x={82} y={447} size={27}>TANGGAL FAVORIT SEMUA ORANG.</Text>
   </g>
   <g opacity={morph} transform={`translate(${(1-morph)*300} 0)`}>
    <Text x={80} y={360} size={108} heavy>BERASA</Text>
    <Text x={80} y={480} size={117} heavy>SULTAN.</Text>
    <path d="M82 520H593" stroke={P.coral} strokeWidth="10" transform={`scale(${morph} 1)`}/>
    <Text x={84} y={590} size={29}>Saldo tebal. Gaya ikut tebal.</Text>
   </g>
   <ellipse cx={board.x} cy={board.y+115} rx={360} ry={27} fill={P.black} opacity={.07}/>
   <SalaryPlatform t={t} {...board}/>
   <Performer t={t} rig={{...body,...prototypeRig(t),x:mix(900,body.x,arrival)+titlePush*12,y:body.y+titlePush*12,scale:body.scale,rotation:body.r+titlePush*4,compression:pulse(t,1.5,.8)+anticipate*.5,gaze:anticipate}}/>
  </g>
  {t<.9&&<g opacity={1-smooth(t,.55,.9)}><Text x={80} y={1510} size={30}>+ Rp5.000.000</Text><Text x={80} y={1550} size={22}>SATU NOTIFIKASI. SERIBU RENCANA.</Text></g>}
 </g>;
};
