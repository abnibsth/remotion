import React from 'react';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import {progress} from './motion.mjs';

export const C={paper:'#F5F1E8',ink:'#191919',red:'#F05A42',green:'#B7DF79',gray:'#A7A49E'};
export const sans='"Space Grotesk", sans-serif';
export const mono='"IBM Plex Mono", monospace';
export const Label:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string;anchor?:'start'|'middle'|'end';opacity?:number}> = ({x,y,children,size=24,fill=C.ink,anchor='start',opacity=1})=><text data-type="label" x={x} y={y} fontFamily={mono} fontSize={size} fill={fill} textAnchor={anchor} opacity={opacity}>{children}</text>;
export const Reveal:React.FC<{t:number;start:number;x:number;y:number;w:number;h:number;children:React.ReactNode;duration?:number}> = ({t,start,x,y,w,h,children,duration=.45})=>{
 const p=progress(t,start,start+duration);
 return <svg x={x} y={y} width={w} height={h} overflow="hidden" opacity={t<start?0:1}><g transform={`translate(0 ${h*(1-p)})`}>{children}</g></svg>;
};
export const EdgeNotes:React.FC<{t:number}> = ({t})=> <g opacity={1-progress(t,12.5,13)+progress(t,17.7,18.1)}>
 <path d="M96 111H1824 M96 969H1824" stroke={C.ink} strokeWidth={1} opacity={.25}/>
 <Label x={96} y={84} size={20}>A STUDY IN EVERYDAY EXPENSES</Label>
 <Label x={1824} y={84} size={20} anchor="end">FINANCIAL FIELD NOTES / 001</Label>
 <Label x={96} y={1013} size={18}>ONE PAYDAY. FIVE TRANSACTIONS.</Label>
 <Label x={1824} y={1013} size={18} anchor="end">IDR · FICTIONAL FIGURES</Label>
 </g>;
