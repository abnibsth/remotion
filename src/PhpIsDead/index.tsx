import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import {svgAt} from './film';

const Picture:React.FC<{offset:number;scene:number}>=({offset,scene})=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  return <AbsoluteFill style={{background:'#08090D'}}><div dangerouslySetInnerHTML={{__html:svgAt(frame/fps+offset,scene)}}/></AbsoluteFill>;
};
export const PhpAnnouncement=()=> <Picture offset={0} scene={0}/>;
export const PhpPredictions=()=> <Picture offset={3} scene={1}/>;
export const PhpSilence=()=> <Picture offset={8} scene={2}/>;
export const PhpComeback=()=> <Picture offset={10} scene={3}/>;
export const PhpPunchline=()=> <Picture offset={14} scene={4}/>;
export const PhpTerminal=()=> <Picture offset={18} scene={5}/>;
export const PhpIsDead:React.FC=()=>{
  const {fps}=useVideoConfig();
  return <AbsoluteFill style={{background:'#08090D'}}>
    <Sequence name="01 — The announcement" durationInFrames={3*fps} premountFor={fps}><PhpAnnouncement/></Sequence>
    <Sequence name="02 — Again and again" from={3*fps} durationInFrames={5*fps} premountFor={fps}><PhpPredictions/></Sequence>
    <Sequence name="03 — The silence" from={8*fps} durationInFrames={2*fps} premountFor={fps}><PhpSilence/></Sequence>
    <Sequence name="04 — PHP enters" from={10*fps} durationInFrames={4*fps} premountFor={fps}><PhpComeback/></Sequence>
    <Sequence name="05 — The punchline" from={14*fps} durationInFrames={4*fps} premountFor={fps}><PhpPunchline/></Sequence>
    <Sequence name="06 — Still alive" from={18*fps} durationInFrames={2*fps} premountFor={fps}><PhpTerminal/></Sequence>
    <Audio src={staticFile('php-is-dead/audio/mix.wav')} premountFor={fps}/>
  </AbsoluteFill>;
};
