import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, EdgeNotes} from './design';
import {cameraAt, mix, progress, surfaceAt} from './motion.mjs';
import {Payday} from './Payday';
import {Expenses} from './Expenses';
import {Balance} from './Balance';
import {Finale} from './Finale';

export const MoneyFilm:React.FC<{time:number}>=({time:t})=>{
 const cam=cameraAt(t), paper=surfaceAt(t);
 const red=Math.round(mix(245,240,paper.red)), green=Math.round(mix(241,90,paper.red)), blue=Math.round(mix(232,66,paper.red));
 return <div style={{width:1920,height:1080,background:C.paper,color:C.ink,overflow:'hidden'}}>
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{display:'block'}}>
   <defs>
    <pattern id="paper-grain" width={7} height={11} patternUnits="userSpaceOnUse"><circle cx={1} cy={2} r={.45} fill={C.ink} opacity={.14}/><circle cx={5} cy={8} r={.35} fill={C.ink} opacity={.1}/></pattern>
   </defs>
   <rect width={1920} height={1080} fill={C.paper}/>
   <EdgeNotes t={t}/>
   <g style={{transformOrigin:'960px 540px',transform:`perspective(2200px) rotateX(${cam.perspective}deg)`}}>
   <g transform={`translate(960 540) scale(${cam.zoom}) rotate(${cam.rotation}) translate(${-960-cam.x} ${-540-cam.y})`}>
    <g transform={`translate(${paper.x} ${paper.y})`} opacity={paper.opacity}>
     <path d={paper.path} fill={C.ink} opacity={.07} transform="translate(8 12)"/>
     <path data-surface="receipt" d={paper.path} fill={`rgb(${red},${green},${blue})`} stroke={C.ink} strokeWidth={2} strokeDasharray={t<2.15?'4000':'none'} strokeDashoffset={t<2.15?4000*(1-progress(t,.7,1.6)):0}/>
    </g>
    <Payday t={t}/>
    <Expenses t={t}/>
    <Balance t={t}/>
    <Finale t={t}/>
   </g>
   </g>
   <rect width={1920} height={1080} fill="url(#paper-grain)" pointerEvents="none"/>
  </svg>
 </div>;
};
export const WhereDidMyMoneyGo:React.FC<{narrated?:boolean}>=({narrated=false})=>{
 const frame=useCurrentFrame(), {fps}=useVideoConfig();
 return <AbsoluteFill><MoneyFilm time={frame/fps}/><Audio src={staticFile(narrated?'money/audio/soundtrack-narrated.wav':'money/audio/soundtrack.wav')}/></AbsoluteFill>;
};
