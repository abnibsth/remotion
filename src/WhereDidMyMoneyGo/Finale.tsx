import React from 'react';
import {C, Label, sans, Reveal} from './design';
import {mix, progress} from './motion.mjs';

export const Finale:React.FC<{t:number}>=({t})=>{
 const receipt=progress(t,16.1,16.45)*(1-progress(t,16.55,16.95));
 const fold=progress(t,16.45,17.05)*(1-progress(t,17.05,17.6));
 return <g>
  <g opacity={receipt}>
   <Label x={960} y={507} size={27} anchor="middle">FINAL BALANCE</Label>
   <text x={960} y={600} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={71}>Rp12.500</text>
   <path d="M715 635H1205" stroke={C.ink} strokeDasharray="5 7"/>
  </g>
  <g opacity={fold} transform="translate(960 565)">
   <path d={`M-135 -135L${mix(135,-135,progress(t,16.45,16.8))} -135L135 135Z`} fill={C.ink} opacity={.14}/>
   <path d="M-135 -135L135 135M-135 135L135 -135" stroke={C.ink} strokeWidth={1} opacity={.4}/>
  </g>
  <g opacity={progress(t,17.3,17.65)}>
   <Label x={195} y={255} size={24}>THE MONTHLY DISAPPEARING ACT.</Label>
   <Label x={1725} y={255} size={24} anchor="end">001 / RECEIPT</Label>
  </g>
  <Reveal t={t} start={17.32} x={183} y={307} w={1570} h={162} duration={.45}><text x={0} y={141} fontFamily={sans} fontWeight={700} fontSize={166} letterSpacing={-8}>WHERE DID</text></Reveal>
  <Reveal t={t} start={17.45} x={183} y={470} w={1570} h={162} duration={.45}><text x={0} y={141} fontFamily={sans} fontWeight={700} fontSize={166} letterSpacing={-8}>MY MONEY GO?</text></Reveal>
  <g opacity={progress(t,17.8,18.1)}>
   <path d="M195 691H1725" stroke={C.ink} strokeWidth={2}/>
   <Label x={195} y={755} size={31}>PAYDAY: 100%</Label>
   <rect x={1120} y={715} width={605} height={60} fill={C.ink}/>
   <Label x={1422} y={756} size={31} fill={C.paper} anchor="middle">REMAINING: 0.25%</Label>
  </g>
  <Reveal t={t} start={18.15} x={195} y={809} w={1530} h={89} duration={.3}><text x={0} y={62} fontFamily={sans} fontWeight={700} fontSize={65}>IT ADDS UP.</text><Label x={1530} y={60} size={20} anchor="end">MONEY DOESN’T DISAPPEAR. IT BECOMES EXPENSES.</Label></Reveal>
 </g>;
};
