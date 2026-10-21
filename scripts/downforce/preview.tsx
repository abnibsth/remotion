import React from 'react';import {createRoot} from 'react-dom/client';import {Player,PlayerRef} from '@remotion/player';import {DownforceVisual} from '../../src/Downforce';
const ref=React.createRef<PlayerRef>();function Preview(){return <Player ref={ref} component={Visual} durationInFrames={1800} compositionWidth={1080} compositionHeight={1920} fps={60} controls={false} style={{width:1080,height:1920}}/>;}function Visual(){return <TimeVisual/>;}
import {useCurrentFrame,useVideoConfig} from 'remotion';function TimeVisual(){const f=useCurrentFrame();const{fps}=useVideoConfig();return <DownforceVisual t={f/fps}/>;}
declare global{interface Window{seek:(t:number)=>Promise<void>;ready:Promise<void>}}
createRoot(document.getElementById('root')!).render(<Preview/>);window.seek=async(t:number)=>{ref.current?.seekTo(Math.round(t*60));await new Promise(r=>setTimeout(r,180));};window.ready=document.fonts.ready.then(()=>new Promise<void>(r=>setTimeout(r,1800)));
