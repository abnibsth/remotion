import React from 'react';
import {useCurrentFrame,useVideoConfig,staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {Opening} from './Opening';
import {Attack} from './Attack';
import {Deduction} from './Deduction';
import {Silence} from './Silence';
import {Finale} from './Finale';
import {P} from './motion.mjs';
import {Texture} from './Objects';

export const V2Visual:React.FC<{time?:number}>=({time})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const t=time??frame/fps;
 return <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{display:'block',background:P.ivory}}>
  {t<7?<Opening t={t}/>:t<13?<Attack t={t}/>:t<19?<Deduction t={t}/>:t<24?<Silence t={t}/>:<Finale t={t}/>}
  <Texture/>
 </svg>;
};
export const GajianV2:React.FC=()=>{const {fps}=useVideoConfig();return <><V2Visual/><Audio src={staticFile('gajian-v2/audio/mix-normalized.wav')} premountFor={fps}/></>;};
export const GajianV2Prototype=V2Visual;
