import {profiles,type Key} from './motion.mjs';
export const C={ivory:'#F5F1E8',ink:'#181818',vermilion:'#F16A50',cobalt:'#365CFF',lavender:'#A995E8',lime:'#D8E99A',muted:'#858278',line:'#D9D4C9'};
export const group=(s:string,x=0,y=0,sx=1,sy=sx,r=0,a=1)=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${Math.max(.0001,sx)} ${Math.max(.0001,sy)})" opacity="${Math.max(0,Math.min(1,a))}">${s}</g>`;
export const type=(s:string,x:number,y:number,size:number,key:Key='bold',extra='')=>{const p=profiles[key];return `<text data-key="true" x="${x}" y="${y}" font-family="${p.typeface}" font-size="${size}" font-weight="${key==='bold'?400:key==='italic'?800:key==='serif'?500:500}" font-style="${key==='italic'?'italic':'normal'}" fill="${p.color}" letter-spacing="${key==='monospace'?0:-size*.04}" ${extra}>${s}</text>`;};
export const mono=(s:string,x:number,y:number,size=21,color:string=C.muted,extra='')=>`<text x="${x}" y="${y}" font-family="IBM Plex Mono" font-weight="500" font-size="${size}" fill="${color}" ${extra}>${s}</text>`;
export const rule=(y:number,color:string=C.line)=>`<path d="M80 ${y}H940" stroke="${color}" stroke-width="2"/>`;
export const caption=(num:string,word:string,color:string)=>`${mono(num,80,270,22,color)}${mono('A STUDY IN PERSONALITY',940,270,18,C.muted,'text-anchor="end"')}${rule(305)}${mono(word,80,1480,29,C.ink)}`;
