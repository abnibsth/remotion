import outlines from './outlines.json';
import {S} from './motion';
export const C={ivory:'#F3EFE7',ink:'#171717',blue:'#315BFF',orange:'#F36A45',lime:'#DCEB8B'};
export const tx=(x:number,y:number,s:string,size=32,fill:string=C.ink,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>`;
export const mt=(x:number,y:number,s:string,size=22,fill:string=C.ink,extra='')=>tx(x,y,s,size,fill,`font-family="'IBM Plex Mono',monospace" font-weight="500" letter-spacing="1.2" ${extra}`);
export const line=(x:number,y:number,x2:number,y2:number,fill:string=C.ink,w=2,extra='')=>`<path d="M${x} ${y}L${x2} ${y2}" fill="none" stroke="${fill}" stroke-width="${w}" ${extra}/>`;
export const dot=(x:number,y:number,r:number,fill:string=C.ink,extra='')=>`<circle cx="${x}" cy="${y}" r="${Math.max(0,r)}" fill="${fill}" ${extra}/>`;
export const appear=(s:string,t:number,a:number,dy=35)=>`<g opacity="${S(t,a)}" transform="translate(0 ${(1-S(t,a))*dy})">${s}</g>`;
export type Word=keyof typeof outlines;
export function word(word:Word,x:number,baseline:number,width:number,fill:string=C.ink,extra=''){const o=outlines[word],scale=width/o.width;return `<g data-word="${word}" transform="translate(${x} ${baseline}) scale(${scale} ${-scale})" ${extra}>${o.glyphs.map(g=>`<path d="${g.path}" transform="translate(${g.x} 0)" fill="${fill}"/>`).join('')}</g>`;}
export function glyphWord(word:Word,x:number,baseline:number,width:number,fill:string,fn:(i:number)=>{dx:number;dy:number;sx:number;sy:number;rotation:number}){const o=outlines[word],scale=width/o.width;return `<g data-word="${word}">${o.glyphs.map((g,i)=>{const s=fn(i);return `<g transform="translate(${x+g.x*scale+s.dx} ${baseline+s.dy}) rotate(${s.rotation}) scale(${scale*s.sx} ${-scale*s.sy})"><path d="${g.path}" fill="${fill}"/></g>`;}).join('')}</g>`;}
export function chrome(content:string,t:number,ink:string=C.ink){const label=t<5?'01 / MASS':t<8?'02 / BUOYANCY':t<11?'03 / VELOCITY':t<14?'04 / TIME':t<17?'05 / TENSION':'A TYPOGRAPHIC EXPERIMENT';return `${mt(96,167,'WORDS HAVE WEIGHT',23,ink)}${mt(930,167,'VOL. 01',20,ink,'text-anchor="end"')}${line(96,203,930,203,ink,1,'opacity=".3"')}${content}${mt(96,1497,label,21,ink)}${mt(930,1497,'60 FPS',19,ink,'text-anchor="end"')}${line(96,1533,930,1533,ink,1,'opacity=".3"')}`;}
