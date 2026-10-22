import {C,text,mono,php,group,frameLabel} from '../design';
import {clamp,smooth,spring} from '../motion.mjs';
export const comeback=(t:number)=>{
  const d=t-10,reveal=smooth(d/.8),pull=1.65-.65*smooth(d/2.5);
  let racks='';
  const labels=['REQUEST ROUTING','DATABASE QUERIES','API RESPONSES','QUEUE WORKERS','BACKGROUND JOBS'];
  for(let col=0;col<7;col++)for(let row=0;row<9;row++){
    const id=col*9+row,x=col*144-490,y=row*106-390,lit=clamp((d-.28-col*.09-row*.07)*3),progress=(d*.38+id*.137)%1;
    racks+=`<g opacity="${lit}"><rect x="${x}" y="${y}" width="130" height="88" fill="${C.black}" stroke="${C.purple}" stroke-opacity=".45" stroke-width="2"/><path d="M${x+14} ${y+26}h75M${x+14} ${y+37}h48" stroke="${C.purple}" stroke-width="3" stroke-opacity=".6"/><rect x="${x+14}" y="${y+60}" width="${90*progress}" height="3" fill="${C.lavender}"/><circle cx="${x+111}" cy="${y+24}" r="4" fill="${C.lavender}"/></g>`;
  }
  let s=frameLabel('MEANWHILE, IN PRODUCTION.','NO DRAMA.');
  s+=`<g transform="translate(510 880) scale(${pull})" opacity="${reveal*.62}">${racks}</g>`;
  s+=`<rect x="165" y="665" width="720" height="338" fill="${C.black}" opacity=".93"/>`;
  s+=`<path d="M175 1002H845" stroke="${C.purple}" stroke-width="2" opacity="${reveal}"/>`;
  const emergence=Math.max(.005,spring(d,11,9));
  s+=group(php(-328,95,320),510,866,emergence,0,reveal);
  if(d>1.25){
    const a=spring(d-1.25,18,12);
    s+=group(text('STILL HERE.',0,0,116,C.white,'text-anchor="middle"'),510,1280,a,0,clamp((d-1.25)*6));
  }
  for(let i=0;i<5;i++){
    const a=clamp((d-1.65-i*.13)*4);
    s+=mono(labels[i],80,1385+i*39,19,C.purple,`opacity="${a}"`);
    s+=mono('RUNNING',940,1385+i*39,19,C.lavender,`text-anchor="end" opacity="${a}"`);
  }
  // The same lettering becomes the next scene's extreme close-up.
  if(t>13.65){const q=smooth((t-13.65)/.35);s=`<g transform="translate(510 865) scale(${1+q*.4}) translate(-510 -865)">${s}</g>`;}
  return s;
};
