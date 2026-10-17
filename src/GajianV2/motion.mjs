// V1's tested closed-form spring is retained; art direction and choreography are new.
export {spring,clamp,mix,smooth,hash,rupiah} from '../Gajian/motion.mjs';
import {spring,clamp,mix,smooth} from '../Gajian/motion.mjs';
export const P={ivory:'#F4F0E8',coral:'#FF6148',black:'#181818',lime:'#B9E56E',lavender:'#A99AE8',skin:'#C7825C',skinLight:'#E7AB82',shade:'#D9D3C7'};
export const expenses=[
 {label:'KOS',amount:1500000,hit:8,deduct:13.4,end:14},
 {label:'MAKAN',amount:1200000,hit:9.25,deduct:14.35,end:14.95},
 {label:'CICILAN',amount:1000000,hit:10.5,deduct:15.3,end:15.9},
 {label:'TRANSPORT',amount:500000,hit:11.75,deduct:16.25,end:16.85},
 {label:'KEBUTUHAN LAIN',amount:787500,hit:17.3,deduct:17.3,end:18.7},
];
export const sceneAt=t=>t<3?0:t<7?1:t<13?2:t<19?3:t<24?4:5;
export function balanceAt(t){return Math.round(expenses.reduce((b,e)=>b-e.amount*smooth(t,e.deduct,e.end),5000000));}
export function boardAt(t){
 const morph=smooth(t,2.65,3.65),surf=Math.max(0,t-3.65);
 return {x:540+Math.sin(surf*1.9)*115*morph,y:mix(1250,1320,morph)+Math.sin(surf*2.8)*45*morph,r:mix(-4,-10,morph)+Math.sin(surf*2)*8*morph,w:mix(930,800,morph),h:mix(240,210,morph),morph};
}
export function bodyAt(t){
 const b=boardAt(t),jump=clamp((t-.7)/.8),landing=t<.7?0:t<1.5?Math.sin(jump*Math.PI)*240:0;
 const crouch=t>=1.5?Math.exp(-(t-1.5)*9)*Math.sin((t-1.5)*18)*26:0;
 const push=smooth(t,2.1,2.5);
 return {x:b.x-30+push*55,y:b.y-35-landing*.4+crouch,r:b.r*.35+Math.sin(Math.max(0,t-3)*2.5)*3,scale:1.35-(1-smooth(t,0,.5))*.08,land:spring(t-1.5,230,17),jump};
}
export const easeOut=t=>1-Math.pow(1-clamp(t),3);
export const pulse=(t,at,amplitude=1)=>t<at?0:amplitude*Math.sin((t-at)*22)*Math.exp(-(t-at)*8);
