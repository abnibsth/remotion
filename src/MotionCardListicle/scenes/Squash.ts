import {C,card,footer,header,mono} from '../lib/design';
import {ballState,ease,lerp,progress} from '../lib/motion';
export function squashCard(t:number){
 const b=ballState(t),morph=ease(progress(t,3.4,4));
 const height=lerp(102*b.sy,1000,morph),width=lerp(102*b.sx,6,morph), y=lerp(1000+263*progress(b.y,650,1110),1435,morph);
 const content=`${header(3,['SQUASH &','STRETCH'],'Give shapes weight.',C.lime)}${mono(904,916,'VOLUME ≈ CONSTANT',17,C.ink,'text-anchor="end"')}<path d="M208 1263H872" stroke="${C.ink}" stroke-width="3"/><ellipse cx="540" cy="1279" rx="${lerp(26,84,progress(b.y,650,1110))}" ry="9" fill="${C.ink}" opacity="${.07+.08*progress(b.y,650,1110)}"/><ellipse cx="540" cy="${y-height/2}" rx="${width/2}" ry="${height/2}" fill="${C.ink}"/>${footer('WEIGHT IN THE FALL.','LIFE IN THE BOUNCE.')}`;
 return card(C.lime,content);
}
export function spine(t:number){const p=ease(progress(t,3.55,4));return p>0?`<rect x="537" y="${lerp(1100,370,p)}" width="6" height="${lerp(100,1090,p)}" rx="3" fill="${C.ink}"/>`:'';}
