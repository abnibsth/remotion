import {C} from './design';
import {E,camera,clamp,mix} from './motion';
import {heavy} from '../scenes/Heavy';
import {light} from '../scenes/Light';
import {fast} from '../scenes/Fast';
import {slow} from '../scenes/Slow';
import {elastic} from '../scenes/Elastic';
import {finale} from '../scenes/Finale';
export function svgAt(time:number){const t=clamp(time,0,19.999999),cam=camera(t);let bg:string=C.ivory,body='';
 if(t<5){body=heavy(t);if(t>4.6)body+=`<g opacity="${E(t,4.6,5)}">${light(t)}</g>`;if(t>4.7){bg=mix(C.ivory,C.blue,E(t,4.7,5.45));}}
 else if(t<8){bg=mix(C.ivory,C.blue,E(t,4.7,5.45));body=light(t);}
 else if(t<11){bg=mix(C.blue,C.orange,E(t,8,8.16));body=fast(t);if(t>10.25){bg=mix(C.orange,C.ivory,E(t,10.25,11));body+=`<g opacity="${E(t,10.25,11)}">${slow(t)}</g>`;}}
 else if(t<14){body=slow(t);if(t>13.8){const handoff=E(t,13.8,14);body=`<g opacity="${1-handoff}">${body}</g><g opacity="${handoff}">${elastic(t)}</g>`;}}
 else if(t<17){bg=mix(C.ivory,C.lime,E(t,14,14.35));body=elastic(t);}
 else{bg=mix(C.lime,C.ivory,E(t,17,17.4));body=finale(t);}
 const world=`<g transform="translate(${cam.x} ${cam.y}) translate(530 950) scale(${cam.zoom}) translate(-530 -950)">${body}</g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" font-family="'Space Grotesk',sans-serif" font-weight="700" style="display:block;background:${bg}"><rect width="1080" height="1920" fill="${bg}"/>${world}</svg>`;
}
