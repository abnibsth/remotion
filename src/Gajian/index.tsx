import React from 'react';
import {AbsoluteFill,Series,useCurrentFrame,useVideoConfig,staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {SalaryScene} from './SalaryScene';
import {SultanScene} from './SultanScene';
import {RealityScene} from './RealityScene';
import {BalanceScene} from './BalanceScene';
import {SilenceScene} from './SilenceScene';
import {WaitingScene} from './WaitingScene';
import {C,smooth} from './motion.mjs';
export {SalaryScene,SultanScene,RealityScene,BalanceScene,SilenceScene,WaitingScene};

export const GajianVisual:React.FC=()=>{
 const {fps}=useVideoConfig();const t=useCurrentFrame()/fps;
 return <AbsoluteFill style={{background:C.navy}}>
  <Series>
   <Series.Sequence name="01 — Gajian masuk" durationInFrames={4*fps} premountFor={fps}><SalaryScene/></Series.Sequence>
   <Series.Sequence name="02 — Sultan sehari" durationInFrames={4*fps} premountFor={fps}><SultanScene/></Series.Sequence>
   <Series.Sequence name="03 — Realita menyerang" durationInFrames={6*fps} premountFor={fps}><RealityScene/></Series.Sequence>
   <Series.Sequence name="04 — Uang menghilang" durationInFrames={6*fps} premountFor={fps}><BalanceScene/></Series.Sequence>
   <Series.Sequence name="05 — Hening" durationInFrames={5*fps} premountFor={fps}><SilenceScene/></Series.Sequence>
   <Series.Sequence name="06 — Menunggu gajian" durationInFrames={5*fps} premountFor={fps}><WaitingScene/></Series.Sequence>
  </Series>
  {[{at:4,color:C.yellow},{at:8,color:C.red},{at:14,color:C.yellow},{at:25,color:C.navy}].map(({at,color})=>{
   const dt=t-at;if(Math.abs(dt)>.22)return null;
   const x=dt<0?-1250+1250*smooth(t,at-.22,at):1250*smooth(t,at,at+.22);
   return <div key={at} style={{position:'absolute',left:x-190,top:-120,width:1500,height:2180,background:color,transform:'rotate(-12deg)',borderRight:`30px solid ${C.ink}`,pointerEvents:'none'}}/>;
  })}
 </AbsoluteFill>;
};
export const Gajian:React.FC=()=>{
 const {fps}=useVideoConfig();return <><GajianVisual/><Audio src={staticFile('gajian/audio/mix-normalized.wav')} premountFor={fps}/></>;
};
