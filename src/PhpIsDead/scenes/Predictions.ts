import {C,text,mono,rule,group,frameLabel,hit} from '../design';
import {stampTimes,clamp,spring,hash,smooth} from '../motion.mjs';
export const predictions=(t:number)=>{
  const years=['2005','2010','2015','2020','2026'];
  let active=0;stampTimes.forEach((v,i)=>{if(t>=v)active=i;});
  const at=stampTimes[active],d=Math.max(0,t-at),settle=spring(d,20,12),fly=1+(1-settle)*1.25;
  let s=frameLabel('THE SAME PREDICTION.','ON REPEAT.');
  s+=mono('A VERY UNOFFICIAL TIMELINE',80,335,21,C.white);
  s+=`<path d="M82 435H940" stroke="${C.purple}" stroke-width="3"/>`;
  for(let i=0;i<5;i++){
    const x=100+i*204,seen=t>=stampTimes[i];
    s+=`<circle cx="${x}" cy="435" r="${i===active?10:5}" fill="${seen?C.red:C.charcoal}"/>`;
    s+=mono(years[i],x,491,22,seen?C.white:C.muted,'text-anchor="middle"');
  }
  const year=text(years[active],0,0,245,C.white,'text-anchor="middle"');
  s+=group(year,558,695,fly,-2*Math.exp(-8*d));
  s+=mono('PHP IS',266,852,52,C.white);
  s+=hit(`<rect x="262" y="902" width="666" height="211" fill="${C.red}"/>${text('DEAD.',284,1066,163,C.black)}`,t,at,600,1000);
  for(let i=0;i<active;i++){
    s+=group(`<rect x="-120" y="-45" width="240" height="92" fill="${C.black}" stroke="${C.red}" stroke-width="3"/>${text('DEAD',-100,24,61,C.red)}`,418+i*143,1255+i%2*90,.85,(i%2?1:-1)*(6+i*2),.65);
  }
  const chaos=clamp((t-7.15)/.63);
  for(let i=0;i<38;i++){
    const at=7.18+i*.014;if(t<at)continue;
    const x=65+hash(i+31)*970,y=365+hash(i+231)*1090,sc=.55+hash(i+99)*1.3;
    const shape=`<rect x="-145" y="-61" width="290" height="122" fill="${i%3===0?C.red:C.black}" stroke="${C.red}" stroke-width="4"/>${text('DEAD',-125,39,82,i%3===0?C.black:C.red)}`;
    s+=group(shape,x,y,sc*(1+(1-spring(t-at,23,15))*.8),(hash(i+16)-.5)*45,chaos);
  }
  s+=`<rect x="70" y="1512" width="880" height="92" fill="${C.black}"/>${rule(1515)}${mono('STYLIZED MEME HISTORY. NOT EXACT QUOTES.',80,1562,19)}`;
  // The entire stamp field physically compresses into the next scene's cursor.
  const collapse=smooth((t-7.80)/.20);
  return `<g transform="translate(510 925) scale(${1-collapse*.988} ${1-collapse*.997}) translate(-510 -925)" opacity="${1-collapse*.45}">${s}</g>`;
};
