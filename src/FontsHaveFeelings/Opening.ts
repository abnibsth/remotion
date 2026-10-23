import {type,mono,rule,group} from './design';
import {openingPose,smooth,type Key} from './motion.mjs';
export const specimens=(t:number)=>{
 let s='';for(const key of ['bold','italic','serif','monospace'] as Key[]){const p=openingPose(key,t);s+=group(type(key.toUpperCase(),0,0,p.size,key),p.x+p.dx,p.y,1,1,p.rotation);}
 return s;
};
export const opening=(t:number)=>{
 const q=t>=18?20-t:t,zoom=1+.012*Math.sin(Math.PI*Math.min(3,q)/3);
 const title=type('WHAT IF FONTS',80,490,88)+type('HAD FEELINGS?',80,590,86);
 const s=`${mono('TYPE / IN MOTION',80,248,21)}${mono('FOUR VOICES. NO WORDS SPOKEN.',80,330,18)}${rule(370)}${title}${specimens(t)}${rule(1575)}${mono('AN EXERCISE IN EXPRESSION.',80,1620,18)}`;
 const exit=t<3?1-smooth((t-2.65)/.35):1;
 return group(s,510*(1-zoom),960*(1-zoom),zoom,zoom,0,exit);
};
