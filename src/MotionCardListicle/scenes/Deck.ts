import {C,card,dot,mono,text} from '../lib/design';
import {clamp,ease,lerp,progress,spring,stagger} from '../lib/motion';
export function deck(t:number){
  const build=ease(progress(t,.16,.72));
  const width=lerp(20,840,ease(progress(t,.08,.4)));
  const height=lerp(20,1130,build);
  const pull=1-.045*ease(progress(t,.4,1.4));
  const exit=ease(progress(t,2.14,2.5));
  const backs=[C.ink,C.pale,C.lime,C.red].map((c,i)=>{const p=clamp(stagger(t,3-i,.46,.13));const y=(3-i)*-30*(1-exit);const angle=(i-1.5)*3*(1-exit);return `<g transform="translate(${(i-1.5)*18*(1-exit)} ${y}) rotate(${angle} 540 910)" opacity="${p}">${card(c,'',`transform="translate(0 ${(1-p)*140})"`)}</g>`;}).join('');
  const titleP=clamp(spring(t-.7));
  const title=`<g opacity="${titleP}" transform="translate(0 ${(1-titleP)*90})">${mono(176,424,'FIVE NOTES ON BETTER MOVEMENT',18,C.ivory)}${text(166,693,'5',300,C.ivory,'letter-spacing="-18"')}${text(178,811,'MOTION',104,C.ivory,'letter-spacing="-5"')}${text(178,916,'PRINCIPLES',94,C.ivory,'letter-spacing="-5"')}<path d="M180 980H900" stroke="${C.ivory}" stroke-width="2" opacity=".45"/>${text(178,1065,'THAT CHANGE',52,C.ivory,'letter-spacing="-2"')}${text(178,1124,'EVERYTHING',64,C.ivory,'letter-spacing="-2"')}${mono(180,1397,'01 — 05 / AN ANIMATED FIELD GUIDE',19,C.ivory)}${dot(871,568,27,C.lime)}<path d="M856 568h30m-13-13 13 13-13 13" fill="none" stroke="${C.ink}" stroke-width="3"/></g>`;
  const opening=`<g transform="translate(540 910) scale(${pull}) translate(-540 -910)">${t>.45?backs:''}<g transform="translate(${exit*-40} ${exit*-80}) rotate(${-exit*5} 540 910) scale(${1-exit*.03})" opacity="${1-exit}"><rect x="${540-width/2}" y="${910-height/2}" width="${width}" height="${height}" rx="${lerp(10,18,build)}" fill="${C.ink}" stroke="${C.ink}" stroke-width="2" filter="url(#paperShadow)"/>${title}</g></g>`;
  return opening;
}
