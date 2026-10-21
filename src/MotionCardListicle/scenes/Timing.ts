import {C,card,dot,footer,header,mono,rail} from '../lib/design';
import {ease,lerp,progress,timingProgress} from '../lib/motion';
export function timingCard(t:number){
 const converge=ease(progress(t,3.2,3.85));
 const rows=[{label:'FAST',d:.45,y:940,c:C.red},{label:'BALANCED',d:1.1,y:1100,c:C.lime},{label:'SLOW',d:2,y:1260,c:C.pale}];
 const content=`${header(5,['TIMING'],'Every frame matters.',C.ink,C.ivory)}${rows.map(r=>{const p=timingProgress(t-.65,r.d);return `<g opacity="${1-converge}">${rail(r.y,r.label,C.ivory)}${mono(904,r.y-48,Math.round(r.d*60)+' FR',19,C.ivory,'text-anchor="end"')}</g>${dot(lerp(lerp(226,854,p),540,converge),lerp(r.y,1020,converge),lerp(32,20,converge),converge>.9?C.ivory:r.c)}`;}).join('')}<g opacity="${1-converge}">${footer('SAME ACTION.','THREE EMOTIONS.',C.ivory)}${mono(904,815,'FRAME '+String(Math.min(120,Math.max(0,Math.floor((t-.65)*60)))).padStart(3,'0'),17,C.ivory,'text-anchor="end"')}</g>`;
 return card(C.ink,content);
}
