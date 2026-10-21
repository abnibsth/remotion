import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/space-grotesk/latin-300.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import {svgAt} from './lib/film';
export const WordsHaveWeight:React.FC=()=>{const frame=useCurrentFrame();const {fps}=useVideoConfig();return <AbsoluteFill style={{backgroundColor:'#F3EFE7'}}><div style={{width:1080,height:1920}} dangerouslySetInnerHTML={{__html:svgAt(frame/fps)}}/><Audio src={staticFile('words-have-weight/audio/soundtrack.wav')} premountFor={fps}/></AbsoluteFill>;};
