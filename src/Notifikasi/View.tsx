import React from 'react';
import {Hook} from './Hook';
import {Coming} from './Coming';
import {Chaos} from './Chaos';
import {Breakdown} from './Breakdown';
import {Silence} from './Silence';
import {Solution} from './Solution';
import {Payoff} from './Payoff';
import {C,Grain,S} from './design';
import {clamp,motionState,normalizeTime} from './motion.mjs';

export const SceneView:React.FC<{t:number;children:React.ReactNode}> = ({t,children}) => {
  const m=motionState(t);
  const frozen=t>=11.95&&t<12.5;
  const shakeX=frozen?0:m.shakeX,shakeY=frozen?0:m.shakeY;
  return <div className="no-stage" data-time={t.toFixed(6)} data-scene={m.index}>
    <div className="no-camera" style={{transform:`translate(${shakeX}px,${shakeY}px) scale(${m.cameraScale})`,filter:t>=10.033&&t<10.1?'invert(1)':undefined}}>{children}</div>
    <Grain t={t} quiet={m.index>=4}/>
    {[2.5,5.5,9.5].map((cut,i)=>{const d=t-cut; const a=S(d+.24,230,30), b=S(d,230,30);return Math.abs(d)<.85?<React.Fragment key={cut}>
      <div style={{position:'absolute',width:1900,height:2700,left:-400,top:-400,background:i===2?C.red:C.yellow,transform:`translateX(${-2200+2300*a+2300*b}px) rotate(-17deg)`}}/>
      <div style={{position:'absolute',width:1900,height:2700,left:-400,top:-400,background:C.navy,transform:`translateX(${-2500+2300*S(d+.20,230,30)+2300*S(d-.04,230,30)}px) rotate(-17deg)`}}/>
    </React.Fragment>:null;})}
    {t>7.3&&t<7.367&&<div style={{position:'absolute',inset:0,background:C.cream,opacity:clamp(1-(t-7.3)*15)*.6}}/>}
  </div>;
};

export const NotifikasiView:React.FC<{t:number}> = ({t}) => {
  const time=normalizeTime(t);
  const {index,local}=motionState(time);
  return <SceneView t={time}>
    {index===0&&<Hook t={local}/>}
    {index===1&&<Coming t={local}/>}
    {index===2&&<Chaos t={local}/>}
    {index===3&&<Breakdown t={local}/>}
    {index===4&&<Silence t={local}/>}
    {index===5&&<Solution t={local}/>}
    {index===6&&<Payoff t={local}/>}
  </SceneView>;
};
