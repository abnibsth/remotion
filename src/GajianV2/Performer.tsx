import React from 'react';
import {P,mix,smooth,pulse} from './motion.mjs';

type Point=[number,number];
export type Rig={x?:number;y?:number;scale?:number;rotation?:number;surf?:number;panic?:number;defeat?:number;reach?:number;celebrate?:number;gaze?:number;compression?:number;fall?:number};
const limb=(a:Point,b:Point,c:Point)=>`M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`;
const Hand:React.FC<{p:Point;turn?:number;open?:boolean}>=({p,turn=0,open=false})=><g transform={`translate(${p.join(' ')}) rotate(${turn})`}><path d={open?'M-13 10L-21-7Q-23-15-17-14L-9-2-12-24Q-11-32-6-27L0-8 1-31Q4-37 8-30L12-9 17-24Q23-28 24-20L22 3Q21 18 9 22L-5 20Z':'M-16-5Q-22-18-14-22L-3-11 13-17Q23-18 23-7L21 13Q19 22 7 23H-5Z'} fill={P.skinLight}/><path d="M-9 8L4 15L14 6" stroke={P.skin} strokeWidth="3" fill="none"/></g>;

export const Performer:React.FC<{t:number;rig?:Rig;opacity?:number}>=({t,rig={},opacity=1})=>{
 const {x=540,y=1300,scale=1.3,rotation=0,surf=0,panic=0,defeat=0,reach=0,celebrate=0,gaze=0,compression=0,fall=0}=rig;
 const breath=Math.sin(t*2.4)*(defeat>.5?1:2.5),wave=Math.sin(t*4),counter=Math.sin(t*4-.6);
 const shoulders:Point[]=[[-73,-340],[69,-344]];
 const leftE:Point=[mix(-101,-147,surf)-panic*48+defeat*50,-253-surf*64-celebrate*147+panic*55+defeat*25];
 const leftH:Point=[mix(-110,-204,surf)-panic*29+defeat*58+wave*surf*8,-177-surf*120-celebrate*230+panic*10-defeat*8];
 const rightE:Point=[113+surf*35+panic*42-reach*20-defeat*30,-264-surf*70-celebrate*130-reach*110+defeat*35];
 const rightH:Point=[116+surf*104+panic*40-reach*48-defeat*48+counter*surf*10,-192-surf*85-celebrate*235-reach*410+defeat*5];
 const hipY=-216+compression*20+defeat*20;
 const kneeL:Point=[-57-surf*35,-118+surf*37],kneeR:Point=[61+surf*29,-113+surf*48];
 const ankleL:Point=[-64-surf*56,-22],ankleR:Point=[66+surf*43,-17];
 const headTurn=rotation*.12+gaze*5+panic*10+defeat*14+wave*celebrate*3;
 const topShift=breath+compression*25;
 return <g data-character="editorial-performer" opacity={opacity} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale} ${scale*(1-compression*.06)})`}>
  <g transform={`rotate(${fall*70} 0 -240)`}>
   <path d={limb([-38,hipY],kneeL,ankleL)} stroke={P.black} strokeWidth="53" fill="none" strokeLinecap="round"/>
   <path d={limb([36,hipY],kneeR,ankleR)} stroke="#333232" strokeWidth="54" fill="none" strokeLinecap="round"/>
   <path d={limb([-43,hipY+15],[-52-surf*30,-122],[-63-surf*53,-40])} stroke="#484747" strokeWidth="5" fill="none"/>
   <g transform={`translate(${ankleL.join(' ')}) rotate(${-surf*8})`}><path d="M-29-13H20L32 5L48 13Q55 18 48 28H-39L-41 16Z" fill={P.ivory}/><path d="M-39 24H49" stroke={P.black} strokeWidth="5"/><path d="M12 2L27 9M7 9L21 15" stroke={P.lavender} strokeWidth="5"/></g>
   <g transform={`translate(${ankleR.join(' ')}) rotate(${surf*8})`}><path d="M-24-13H23L36 5L55 15Q60 22 54 28H-34L-36 13Z" fill={P.ivory}/><path d="M-33 24H55" stroke={P.black} strokeWidth="5"/><path d="M15 2L31 10M10 9L24 16" stroke={P.coral} strokeWidth="5"/></g>
   <g transform={`translate(${defeat*10} ${topShift}) rotate(${-surf*7+defeat*9} 0 -225)`}>
    <path d={limb(shoulders[0],leftE,leftH)} stroke={P.skin} strokeWidth="32" fill="none" strokeLinecap="round"/>
    <path d={limb(shoulders[1],rightE,rightH)} stroke={P.skinLight} strokeWidth="33" fill="none" strokeLinecap="round"/>
    <Hand p={leftH} turn={-surf*65-celebrate*25} open={surf>.2||panic>.2||reach>.2}/>
    <Hand p={rightH} turn={surf*60+celebrate*45} open={panic>.2||reach>.2||celebrate>.5}/>
    <path d="M-61-368Q-94-357-100-319L-75-295-62-309-63-219Q-4-193 67-216L67-311 84-294 111-324Q97-363 62-371L24-382-26-382Z" fill={P.lavender}/>
    <path d="M45-368L65-360 65-217 37-210Z" fill="#8B7CC5"/>
    <path d="M-67-308L-62-340M69-310L64-340M-8-355V-226" stroke={P.black} strokeWidth="3" fill="none" opacity=".6"/>
    <path d="M-30-407H28V-369L0-350-31-373Z" fill={P.skin}/>
    <path d="M-29-376L-2-353-22-334-43-368M27-376L-2-353 16-331 43-368" fill={P.ivory}/>
    <path d="M-5-350L-7-264" stroke={P.black} strokeWidth="3"/>
    <path d="M23-315H49V-281Q36-270 23-281Z" fill="none" stroke={P.black} strokeWidth="3"/>
    <path d="M-19-354L-33-253L-7-240 6-343" stroke={P.black} strokeWidth="6" fill="none" transform={`rotate(${wave*3-surf*10} -10 -350)`}/>
    <g transform={`translate(-30 -254) rotate(${wave*3-surf*10})`}><rect width="37" height="47" rx="4" fill={P.ivory}/><rect x="8" y="9" width="10" height="12" fill={P.coral}/><path d="M8 30H28M8 36H23" stroke={P.black} strokeWidth="2"/></g>
    <g transform={`translate(${gaze*6} ${-defeat*3}) rotate(${headTurn} 0 -402)`}>
     <path d="M-57-468Q-72-493-75-451Q-73-427-53-434M55-470Q70-490 72-450Q70-428 52-433" fill={P.skin}/>
     <path d="M-55-506Q-23-538 28-518L58-494 54-437Q36-400 5-393L-37-408-59-446Z" fill={P.skinLight}/>
     <path d="M30-516L58-494 54-437 26-405 5-393 2-413 31-440Z" fill={P.skin}/>
     <path d="M-61-456L-69-489-62-521-41-537-22-552 6-541 35-548 60-523 70-492 55-459 43-468 43-497 14-488-16-501-43-493-48-459Z" fill={P.black}/>
     <path d="M-52-514L-29-532 5-522 37-529 50-515 14-509-20-519Z" fill="#363535"/>
     <g transform={`translate(${gaze*7} 0)`}>
      <path d={`M-42 ${-473+defeat*4}Q-26 ${-484+panic*10+defeat*10} -13 -474M13 -477Q28 ${-488+panic*12+defeat*13} 43 -471`} fill="none" stroke={P.black} strokeWidth="7" strokeLinecap="round"/>
      {celebrate>.6?<><path d="M-39-456Q-27-471-16-456M15-456Q28-469 39-453" fill="none" stroke={P.black} strokeWidth="5" strokeLinecap="round"/></>:<>
       <ellipse cx="-27" cy="-454" rx={10+panic*2} ry={10+panic*6-defeat*4} fill={P.ivory}/><ellipse cx="28" cy="-453" rx={10+panic*2} ry={10+panic*6-defeat*4} fill={P.ivory}/>
       <ellipse cx={-26+gaze*4} cy="-453" rx="4" ry={6-defeat*2} fill={P.black}/><ellipse cx={28+gaze*4} cy="-452" rx="4" ry={6-defeat*2} fill={P.black}/>
      </>}
      <path d="M0-459L-7-437 4-434" fill="none" stroke={P.black} strokeWidth="3" strokeLinecap="round"/>
      {panic>.4?<ellipse cx="4" cy="-418" rx="11" ry="14" fill={P.black}/>:celebrate>.4||surf>.4?<><path d="M-19-426Q2-416 28-428Q20-397 1-401Q-13-404-19-426Z" fill={P.black}/><path d="M-14-425Q3-420 22-426L16-417-8-416Z" fill={P.ivory}/></>:<path d={`M-17 ${-417-defeat*4}Q3 ${-419-defeat*15} 23 -416`} fill="none" stroke={P.black} strokeWidth="4" strokeLinecap="round"/>}
     </g>
     {panic>.3&&<path d="M70-470Q52-445 63-437Q79-432 70-470" fill={P.ivory}/>}
    </g>
   </g>
  </g>
 </g>;
};

export const prototypeRig=(t:number):Pick<Rig,'surf'|'celebrate'|'compression'>=>({surf:smooth(t,2.65,3.8),celebrate:1-smooth(t,2.3,3.3),compression:pulse(t,1.5,.7)});
