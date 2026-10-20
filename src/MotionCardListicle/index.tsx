import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import {svgAt} from './lib/film';

export const MotionCardListicle: React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  return <AbsoluteFill style={{backgroundColor:'#F4F0E7'}}>
    <div style={{width:1080,height:1920}} dangerouslySetInnerHTML={{__html:svgAt(frame/fps)}}/>
    <Audio src={staticFile('motion-card-listicle/audio/soundtrack.wav')} premountFor={fps}/>
  </AbsoluteFill>;
};
