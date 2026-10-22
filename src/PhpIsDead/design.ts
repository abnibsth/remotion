import {clamp, spring} from './motion.mjs';
export const C={black:'#08090D',charcoal:'#171922',purple:'#777BB4',lavender:'#A99BFF',white:'#F4F3F8',red:'#FF5263',green:'#8EE3A1',muted:'#777986'};
export const text=(value:string,x:number,y:number,size:number,color:string=C.white,extra='')=>`<text x="${x}" y="${y}" font-family="Archivo Black" font-size="${size}" fill="${color}" letter-spacing="${-size*.045}" ${extra}>${value}</text>`;
export const mono=(value:string,x:number,y:number,size=22,color:string=C.muted,extra='')=>`<text x="${x}" y="${y}" font-family="IBM Plex Mono" font-weight="500" font-size="${size}" letter-spacing="1" fill="${color}" ${extra}>${value}</text>`;
export const rule=(y:number,color:string=C.charcoal)=>`<path d="M80 ${y}H940" stroke="${color}" stroke-width="2"/>`;
export const group=(content:string,x=0,y=0,scale=1,rotate=0,opacity=1)=>`<g opacity="${clamp(opacity)}" transform="translate(${x} ${y}) scale(${Math.max(.0001,scale)}) rotate(${rotate})">${content}</g>`;
export const hit=(content:string,t:number,at:number,cx:number,cy:number,heavy=1)=>{
  if(t<at)return '';
  const d=t-at,s=spring(d,heavy===1?18:15,heavy===1?11:10),scale=1+(1-s)*1.65;
  const squash=1-.075*Math.exp(-14*d)*Math.sin(32*d);
  return `<g transform="translate(${cx} ${cy}) scale(${scale} ${scale*squash}) translate(${-cx} ${-cy})" style="filter:blur(${Math.max(0,.07-d)*36}px)">${content}</g>`;
};
export const php=(x:number,y:number,size:number,color:string=C.lavender)=>text('PHP',x,y,size,color,'font-style="italic"');
export const frameLabel=(left:string,right:string)=>`${mono(left,80,225,20)}${mono(right,940,225,20,C.muted,'text-anchor="end"')}${rule(254)}`;
