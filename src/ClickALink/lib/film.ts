import {C,chrome,line,networkTexture} from './design';
import {E,camera,clamp,lerp,sceneAt} from './motion';
import {clickScene} from '../scenes/Click';
import {urlScene} from '../scenes/Url';
import {dnsScene} from '../scenes/Dns';
import {connectionScene} from '../scenes/Connection';
import {requestScene} from '../scenes/Request';
import {responseScene} from '../scenes/Response';
import {renderScene} from '../scenes/Render';
import {finaleScene} from '../scenes/Finale';
const scenes=[clickScene,urlScene,dnsScene,connectionScene,requestScene,responseScene,renderScene,finaleScene];
export function svgAt(time:number){const t=clamp(time,0,29.999999),scene=sceneAt(t),index=[0,3,6,10,14,18,22,27].indexOf(scene.start);const local=t-scene.start,cam=camera(t);let body=scenes[index](local);
 // A continuous cyan seam compresses and reveals the next educational space.
 const boundaries=[3,6,10,14,18,22,27];let transition='';
 for(const at of boundaries){if(t>=at-.18&&t<at+.18){const q=E(t,at-.18,at+.18);const width=1920*Math.sin(q*Math.PI);transition=`<rect x="${960-width/2}" y="${lerp(590,510,q)}" width="${width}" height="${4+46*Math.sin(q*Math.PI)}" rx="2" fill="${C.cyan}" opacity="${.9*Math.sin(q*Math.PI)}"/>`;}}
 body=`<g transform="translate(${cam.x} ${cam.y}) translate(960 540) scale(${cam.zoom}) rotate(${cam.rotation}) translate(-960 -540)">${body}</g>`;
 body=chrome(t,body);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" font-family="'Space Grotesk',sans-serif" font-weight="700" style="display:block;background:${C.navy}"><defs><marker id="arrowCyan" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10Z" fill="${C.cyan}"/></marker></defs><rect width="1920" height="1080" fill="${C.navy}"/>${networkTexture()}${line(104,934,1816,934,C.blue,1,'opacity=".07"')}${body}${transition}</svg>`;
}
