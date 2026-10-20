import {C,card,dot,footer,header,mono} from '../lib/design';
import {ease,followX,lerp,progress,ribbonLag} from '../lib/motion';
export function followCard(t:number){
 const unfold=ease(progress(t,0,.38)),x=followX(t),lag=ribbonLag(t);
 const points=Array.from({length:32},(_,i)=>{const q=i/31;const delay=.35*q;const px=followX(Math.max(0,t-delay))-q*210-65;const wave=Math.sin(q*Math.PI*1.5)*ribbonLag(Math.max(0,t-delay))*.7;return `${i?'L':'M'}${px.toFixed(2)} ${(1090+wave+q*lag*.42).toFixed(2)}`;}).join(' ');
 const content=`${header(4,['FOLLOW-','THROUGH'],'Let motion continue.',C.pale)}<path d="M210 1187H870" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".2"/><path d="${points}" fill="none" stroke="${C.blue}" stroke-width="30" stroke-linecap="butt"/><rect x="${x-65}" y="1030" width="130" height="120" rx="8" fill="${C.ink}"/>${dot(x+27,1056,6,C.pale)}${mono(904,947,t<1.5?'PARENT / MOVING':'PARENT / STOPPED',18,C.ink,'text-anchor="end"')}${mono(176,1273,t<1.5?'RIBBON / FOLLOWING':'RIBBON / STILL SETTLING',18,C.blue)}${footer('THE OBJECT STOPS.','THE MOTION DOESN’T.')}`;
 return `<g transform="translate(540 0) scale(${Math.max(.006,unfold)} 1) translate(-540 0)">${card(C.pale,content)}</g>`;
}
export function ribbonWipe(t:number){const p=ease(progress(t,3.5,4));return p>0?`<path d="M-140 1830Q${lerp(-500,750,p)} ${lerp(1560,0,p)} 1220 ${lerp(1540,0,p)}" fill="none" stroke="${C.ink}" stroke-width="${lerp(30,2600,p)}"/>`:'';}
