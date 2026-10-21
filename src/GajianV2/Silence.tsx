import React from 'react';
import {P,smooth,mix} from './motion.mjs';
import {Text} from './Objects';
import {Performer} from './Performer';

export const Silence:React.FC<{t:number}>=({t})=>{
 const dt=t-19,push=1+dt*.006;
 return <g>
  <rect width="1080" height="1920" fill={P.ivory}/>
  <g transform={`translate(${540*(1-push)} ${970*(1-push)}) scale(${push})`}>
   <Text x={540} y={850} size={62} anchor="middle" primary>Rp12.500</Text>
   <path d="M546 1232H815V1270H546M570 1270V1540M793 1270V1540" stroke={P.black} strokeWidth="8" fill={P.lavender}/>
   <Performer t={19} rig={{x:650,y:1530,scale:1.18,defeat:1,gaze:mix(-.7,.1,smooth(dt,.5,1.7)),rotation:4}}/>
   <g opacity={smooth(dt,1.2,1.6)}><Text x={80} y={380} size={144} heavy>LAH...</Text></g>
   <g transform={`translate(0 ${mix(30,0,smooth(dt,2.5,3.1))})`} opacity={smooth(dt,2.5,3.1)}>
    <Text x={80} y={520} size={91} heavy>DUIT GUE</Text><Text x={80} y={625} size={91} heavy>MANA?</Text>
   </g>
  </g>
 </g>;
};
