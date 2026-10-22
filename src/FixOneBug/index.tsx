import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import {svgAt} from './film';
export const FixOneBug:React.FC=()=>{const f=useCurrentFrame();const{fps}=useVideoConfig();return <AbsoluteFill style={{background:'#090B10'}}><div dangerouslySetInnerHTML={{__html:svgAt(f/fps)}}/><Audio src={staticFile('fix-one-bug/audio/mix.wav')}/></AbsoluteFill>;};
