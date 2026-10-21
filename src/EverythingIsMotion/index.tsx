import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/space-grotesk/latin-700.css';
import {svgAt} from './lib/film';

export const EverythingIsMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{backgroundColor:'#111216'}}>
    <div style={{width:1920,height:1080}} dangerouslySetInnerHTML={{__html:svgAt(frame/fps)}}/>
    <Audio src={staticFile('everything-is-motion/audio/soundscape.wav')} premountFor={fps}/>
  </AbsoluteFill>;
};
