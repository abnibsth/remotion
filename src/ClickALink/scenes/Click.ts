import {C,appear,browser,dot,line,mt,tx} from '../lib/design';
import {E,S,lerp} from '../lib/motion';
export function clickScene(t:number){
 const click=E(t,.7,.79),ripple=E(t,.72,1.25),out=E(t,2.45,3);
 const px=lerp(1310,1120,E(t,.08,.65)),py=lerp(790,615,E(t,.08,.65));
 const ui=browser(745,260,990,570,`${mt(807,402,'THE OPEN WEB',20,C.cyan)}${tx(801,483,'A new perspective.',51)}${tx(805,536,'One link is all it takes.',25,C.slate,'font-weight="500"')}${line(805,640,1429,640,C.cyan,2)}${tx(805,614,'EXPLORE THE WEB →',38,C.cyan)}${line(806,735,1170,735,C.slate,10,'opacity=".2"')}${line(806,766,1365,766,C.slate,10,'opacity=".12"')}`,'https://example.com');
 const title=appear(tx(103,361,'ONE',112,C.white,'letter-spacing="-5"')+tx(103,472,'CLICK.',112,C.white,'letter-spacing="-5"'),t,.8)+appear(tx(109,578,'A WHOLE',48,C.cyan,'letter-spacing="-2"')+tx(109,634,'JOURNEY.',48,C.cyan,'letter-spacing="-2"'),t,1.23);
 return `<g opacity="${1-out}">${mt(105,192,'01 / FOLLOW THE REQUEST',21,C.cyan)}${ui}${title}<g transform="translate(${px} ${py}) scale(${1-click*.13})"><path d="M0 0L0 54 14 40 26 64 38 58 25 35 46 33Z" fill="${C.white}" stroke="${C.navy}" stroke-width="3"/></g>${dot(1120,615,lerp(8,105,ripple),'none',`stroke="${C.cyan}" stroke-width="${3*(1-ripple)}" opacity="${click*(1-ripple)}"`)}</g>${line(lerp(805,350,out),lerp(640,600,out),lerp(1429,1570,out),lerp(640,600,out),C.cyan,3,`opacity="${S(t,2.35)}"`)}`;
}
