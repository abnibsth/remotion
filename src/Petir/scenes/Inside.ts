import {C,cloudField,headline,iceShape,line,mt} from '../lib/design';
import {E,particle,lerp} from '../lib/motion';
export function inside(t:number){const meet=E(t,3.6,4.8),separate=E(t,4.8,6.6);const x1=lerp(280,490,meet)-100*separate,y1=870-210*separate;const x2=lerp(740,550,meet)+65*separate,y2=920+130*separate;
 return `${cloudField(t,1)}${Array.from({length:22},(_,i)=>{const kind=i%3?'ice':'graupel',p=particle(i,t,kind);return `<g opacity="${.18+p.z*.3}">${iceShape(p.x,p.y,kind==='ice'?10*p.z:17*p.z,p.rotation,kind==='graupel')}</g>`;}).join('')}${iceShape(x1,y1,57,t*6)}${iceShape(x2,y2,78,-t*4,true)}${line(190,1160,190,650,C.cyan,2,'opacity=".5" marker-end="url(#arrow)"')}${mt(225,1196,'ARUS UDARA NAIK',20)}${mt(x1-100,y1-95,'KRISTAL ES',22,C.white)}${mt(x2-90,y2+125,'GRAUPEL',22,C.white)}${headline(t-3,['PARTIKEL ES','BERTUMBUKAN'],'DI DALAM AWAN BADAI')}`;
}
