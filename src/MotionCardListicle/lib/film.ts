import {C,shell} from './design';
import {camera,clamp,ease,lerp,progress} from './motion';
import {deck} from '../scenes/Deck';
import {easingCard,easingIris} from '../scenes/Easing';
import {anticipationCard} from '../scenes/Anticipation';
import {squashCard,spine} from '../scenes/Squash';
import {followCard,ribbonWipe} from '../scenes/FollowThrough';
import {timingCard} from '../scenes/Timing';
import {finale} from '../scenes/Finale';
export function svgAt(time:number){
 const t=clamp(time,0,25),cam=camera(t);
 let body='';
 if(t<2.5){const p=ease(progress(t,2.14,2.5));body=`<g opacity="${p}">${easingCard(t-2.5)}</g>${deck(t)}`;}
 else if(t<6.5){body=easingCard(t-2.5);}
 else if(t<10.5){const u=t-6.5;const p=ease(progress(u,0,.32));const q=ease(progress(u,3.35,4));body=`${q>0?`<g transform="rotate(${(1-q)*-12} 540 910) translate(${(1-q)*-1000} 0)">${squashCard(-.1)}</g>`:''}${u<.32?`<rect x="${lerp(0,120,p)}" y="${lerp(0,350,p)}" width="${lerp(1080,840,p)}" height="${lerp(1920,1130,p)}" rx="${18*p}" fill="${C.red}"/>`:''}${anticipationCard(u)}`;}
 else if(t<14.5){const u=t-10.5,q=ease(progress(u,3.65,4));body=`<g transform="translate(540 0) scale(${Math.max(.006,1-q)} 1) translate(-540 0)">${squashCard(u)}</g>${spine(u)}`;}
 else if(t<18.5){body=followCard(t-14.5);}
 else if(t<22.5){const u=t-18.5,p=ease(progress(u,0,.3));body=`<rect x="${lerp(0,120,p)}" y="${lerp(0,350,p)}" width="${lerp(1080,840,p)}" height="${lerp(1920,1130,p)}" rx="${18*p}" fill="${C.ink}"/>${timingCard(u)}`;}
 else body=finale(t-22.5);
 const trans=t>=6&&t<6.5?easingIris(t-2.5):t>=18&&t<18.5?ribbonWipe(t-14.5):'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" font-family="'Space Grotesk',sans-serif" font-weight="700" style="display:block;background:${C.ivory}"><defs><filter id="paperShadow" x="-25%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="19" flood-color="${C.ink}" flood-opacity=".12"/></filter></defs><rect width="1080" height="1920" fill="${C.ivory}"/><g transform="translate(${cam.x} ${cam.y}) translate(540 910) scale(${cam.zoom}) rotate(${cam.rotation}) translate(-540 -910)">${shell(t,body)}</g>${trans}</svg>`;
}
