import {C,dot,mono,text} from '../lib/design';
import {clamp,ease,lerp,progress,spring,stagger} from '../lib/motion';
export function finale(t:number){
 const p=ease(progress(t,0,.55));
 const cards=[{n:'01',name:'EASING',c:C.ivory},{n:'02',name:'ANTICIPATION',c:C.red},{n:'03',name:'SQUASH & STRETCH',c:C.lime},{n:'04',name:'FOLLOW-THROUGH',c:C.pale},{n:'05',name:'TIMING',c:C.ink}];
 const deck=cards.map((c,i)=>{const s=clamp(stagger(t,i,.08,.14));const x=lerp(540,194+i*42,s),y=lerp(1020,925+i*69,s);const w=lerp(40,690,s),h=lerp(40,400,s);const ink=i===4?C.ivory:C.ink;return `<g transform="rotate(${lerp(0,(i-2)*-3,s)} ${x+w/2} ${y+h/2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${lerp(20,13,s)}" fill="${c.c}" stroke="${C.ink}" stroke-width="2" filter="url(#paperShadow)"/><g opacity="${s}">${text(x+31,y+67,c.n,48,ink,'letter-spacing="-3"')}${mono(x+w-30,y+56,c.name,16,ink,'text-anchor="end"')}${dot(x+w-53,y+h-52,18,ink)}</g></g>`;}).join('');
 const titleP=clamp(spring(t-.52));
 return `<rect x="${lerp(120,540,p)}" y="350" width="${840*(1-p)}" height="1130" rx="18" fill="${C.ink}" opacity="${1-p}"/><g transform="translate(0 ${(1-titleP)*70})" opacity="${titleP}">${mono(110,351,'THE TAKEAWAY',21)}${text(104,468,'GOOD MOTION',94,C.ink,'letter-spacing="-5"')}${text(104,569,'IS',94,C.ink,'letter-spacing="-5"')}${text(104,670,'INTENTIONAL.',94,C.blue,'letter-spacing="-5"')}${mono(110,755,'5 PRINCIPLES. ENDLESS POSSIBILITIES.',20)}</g>${deck}`;
}
