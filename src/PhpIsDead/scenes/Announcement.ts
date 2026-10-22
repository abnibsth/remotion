import {C,text,mono,rule,hit,frameLabel} from '../design';
import {motion,smooth} from '../motion.mjs';
export const announcement=(t:number)=>{
  if(t<.10)return '';
  const m=motion(t),exit=smooth((t-2.72)/.28);
  return `<g transform="translate(${m.shakeX} ${m.shakeY})">${frameLabel('A DEVELOPER TRAGEDY','VOL. ∞')}
  <g transform="translate(0 ${-exit*260}) scale(${1-exit*.16})" opacity="${1-exit}">
  ${mono('THE INTERNET HAS SPOKEN.',84,435,25,C.white)}
  ${hit(text('PHP',67,795,378),t,.12,500,650)}
  ${hit(text('IS',80,1006,196),t,1,220,915)}
  ${hit(text('DEAD.',72,1272,250,C.red),t,1.58,500,1150,2)}
  ${t>1.58?`<path d="M88 1312H922" stroke="${C.red}" stroke-width="${3+12*Math.exp(-10*(t-1.58))}"/>`:''}
  ${mono('(AGAIN)',86,1413,34,C.white)}
  ${mono('AN EXTREMELY SERIOUS MOTION PICTURE',86,1470,18)}
  </g>${rule(1540)}${mono('NO LANGUAGE DIES THIS DRAMATICALLY.',80,1585,16)}
  </g>`;
};
