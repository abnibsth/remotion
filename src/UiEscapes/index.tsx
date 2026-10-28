import React,{useLayoutEffect,useRef,useState} from 'react';
import {AbsoluteFill,continueRender,delayRender,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import {createFilm,Film} from './engine';

const Picture:React.FC<{offset?:number}>=({offset=0})=>{
 const host=useRef<HTMLDivElement>(null),film=useRef<Film|null>(null),frame=useCurrentFrame(),{fps}=useVideoConfig();
 const latestTime=useRef(frame/fps+offset);latestTime.current=frame/fps+offset;
 const [handle]=useState(()=>delayRender('Load UI Escapes fonts and WebGL scene'));
 useLayoutEffect(()=>{let cancelled=false;Promise.all([document.fonts.load('600 80px "Space Grotesk"'),document.fonts.load('400 24px "IBM Plex Mono"'),document.fonts.load('500 24px "IBM Plex Mono"')]).then(()=>{if(cancelled)return;film.current=createFilm(host.current!);film.current.seek(latestTime.current);continueRender(handle);});return()=>{cancelled=true;film.current?.dispose();film.current=null;};},[handle]);
 useLayoutEffect(()=>{film.current?.seek(frame/fps+offset);},[frame,fps,offset]);
 return <AbsoluteFill style={{background:'#F5F1E9'}}><div ref={host} style={{position:'absolute',inset:0}}/></AbsoluteFill>;
};
export const UiEscapes:React.FC=()=>{const{fps}=useVideoConfig();return <AbsoluteFill><Picture/><Audio src={staticFile('ui-escapes/audio/mix.wav')} premountFor={fps}/></AbsoluteFill>;};
export const UiNormal=()=> <Picture/>;
export const UiFolder=()=> <Picture offset={3}/>;
export const UiBrowser=()=> <Picture offset={7}/>;
export const UiNotifications=()=> <Picture offset={11}/>;
export const UiPortal=()=> <Picture offset={16}/>;
export const UiEnding=()=> <Picture offset={21}/>;
