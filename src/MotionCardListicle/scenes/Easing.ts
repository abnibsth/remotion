import {C,card,dot,footer,header,mono,rail} from '../lib/design';
import {clamp,ease,lerp,progress,spring} from '../lib/motion';
export function easingCard(t:number){
 const enter=clamp(spring(t+.32));
 const cycle=clamp((t-.65)/1.15);const back=progress(t,2.05,3.1);
 const linear=back>0?1-back:cycle, eased=ease(linear);
 const x1=lerp(226,854,linear),x2=lerp(226,854,eased);
 const content=`${header(1,['EASING'],'Movement needs rhythm.',C.ivory)}${rail(970,'LINEAR')}${rail(1190,'EASED',C.blue)}${dot(x1,970,38,C.ink)}${dot(x2,1190,38,C.blue)}${mono(904,920,'CONSTANT SPEED',17,C.ink,'text-anchor="end"')}${mono(904,1140,'SLOW → FAST → SLOW',17,C.blue,'text-anchor="end"')}${footer('SAME DISTANCE.','DIFFERENT FEEL.')}`;
 return card(C.ivory,content,`transform="translate(${(1-enter)*150} ${(1-enter)*170}) rotate(${(1-enter)*6} 540 910)"`);
}
export const easingIris=(t:number)=>{const p=ease(progress(t,3.5,4));return p>0?dot(226,1190,lerp(38,1750,p),C.red):'';};
