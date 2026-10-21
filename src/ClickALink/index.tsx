import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import {svgAt} from './lib/film';
export const ClickALink: React.FC=()=>{const frame=useCurrentFrame();const {fps}=useVideoConfig();return <AbsoluteFill style={{backgroundColor:'#0B1220'}}><div style={{width:1920,height:1080}} dangerouslySetInnerHTML={{__html:svgAt(frame/fps)}}/><Audio src={staticFile('click-a-link/audio/soundtrack.wav')} premountFor={fps}/></AbsoluteFill>;};
