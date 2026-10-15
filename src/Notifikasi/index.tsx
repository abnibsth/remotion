import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill,Series,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Hook} from './Hook';
import {Coming} from './Coming';
import {Chaos} from './Chaos';
import {Breakdown} from './Breakdown';
import {Silence} from './Silence';
import {Solution} from './Solution';
import {Payoff} from './Payoff';
import {SceneView} from './View';
import {normalizeTime} from './motion.mjs';

function Frame({start,children}: {start:number;children:(t:number)=>React.ReactNode}) {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  return <SceneView t={normalizeTime(start+f/fps)}>{children(normalizeTime(f/fps))}</SceneView>;
}
export const HookScene=()=> <Frame start={0}>{t=><Hook t={t}/>}</Frame>;
export const ComingScene=()=> <Frame start={2.5}>{t=><Coming t={t}/>}</Frame>;
export const ChaosScene=()=> <Frame start={5.5}>{t=><Chaos t={t}/>}</Frame>;
export const BreakdownScene=()=> <Frame start={9.5}>{t=><Breakdown t={t}/>}</Frame>;
export const SilenceScene=()=> <Frame start={12.5}>{t=><Silence t={t}/>}</Frame>;
export const SolutionScene=()=> <Frame start={15.5}>{t=><Solution t={t}/>}</Frame>;
export const PayoffScene=()=> <Frame start={18}>{t=><Payoff t={t}/>}</Frame>;
export const NotifikasiOverload:React.FC=()=> {
  const {fps}=useVideoConfig();
  return <AbsoluteFill>
    <Series>
      <Series.Sequence name="01 — The hook" durationInFrames={2.5*fps} premountFor={fps}><HookScene/></Series.Sequence>
      <Series.Sequence name="02 — It keeps coming" durationInFrames={3*fps} premountFor={fps}><ComingScene/></Series.Sequence>
      <Series.Sequence name="03 — Total chaos" durationInFrames={4*fps} premountFor={fps}><ChaosScene/></Series.Sequence>
      <Series.Sequence name="04 — The breakdown" durationInFrames={3*fps} premountFor={fps}><BreakdownScene/></Series.Sequence>
      <Series.Sequence name="05 — Silence" durationInFrames={3*fps} premountFor={fps}><SilenceScene/></Series.Sequence>
      <Series.Sequence name="06 — Do not disturb" durationInFrames={2.5*fps} premountFor={fps}><SolutionScene/></Series.Sequence>
      <Series.Sequence name="07 — Final payoff" durationInFrames={2*fps} premountFor={fps}><PayoffScene/></Series.Sequence>
    </Series>
    <Audio src={staticFile('notifikasi/audio/mix.wav')} premountFor={fps}/>
  </AbsoluteFill>;
};
