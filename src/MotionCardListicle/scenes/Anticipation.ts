import {C,card,dot,footer,header,mono} from '../lib/design';
import {arrowX,blurAmount,clamp,ease,progress} from '../lib/motion';
export function anticipationCard(t:number){
 const x=arrowX(t), compression=1-.17*ease(progress(t,.7,1.35))+.17*ease(progress(t,1.35,1.6));
 const pull=progress(t,.7,1.35), launch=progress(t,1.35,1.85), out=ease(progress(t,3.35,4));
 const moving=blurAmount(arrowX,t);
 const body=`${header(2,['ANTICIPATION'],'Prepare before the action.',C.red)}<path d="M225 1110H860" stroke="${C.ink}" stroke-width="2" opacity=".25"/>${dot(325,1110,8,C.ink)}<path d="M325 950v-30m0 0H${x}" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".35"/><g opacity="${.15*clamp(launch)*clamp(1-launch)*4}" transform="translate(${x-moving*8} 1110) scale(${compression} ${1/compression})"><path d="M-100-45H0V-92L110 0 0 92V45H-100Z" fill="${C.ink}"/></g><g transform="translate(${x} 1110) scale(${compression} ${1/compression})"><path d="M-100-45H0V-92L110 0 0 92V45H-100Z" fill="${C.ink}"/></g>${mono(176,880,'← LOAD',22,C.ink,`opacity="${pull}"`)}${mono(904,880,'RELEASE →',22,C.ink,`text-anchor="end" opacity="${launch}"`)}${footer('A LITTLE BACK.','A LOT FORWARD.')}`;
 return card(C.red,body,`transform="translate(${out*1190} ${-out*90}) rotate(${out*12} 540 910)"`);
}
