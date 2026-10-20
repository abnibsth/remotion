import {C,appear,badge,endpoint,heading,lock,message,mt,rect,route} from '../lib/design';
import {E,S,requestProgress,routePoint} from '../lib/motion';
export function requestScene(t:number){const p=requestProgress(t+14),q=routePoint(p),arrival=S(t,2.65);
 return `${heading(t,5,'THE HTTP REQUEST','Ask the destination for a resource.')}${route(1,true)}${endpoint(380,650,'browser','BROWSER')}${endpoint(1540,650,'server','WEB SERVICE')}${lock(960,495,1)}<g opacity="${1-E(t,2.68,2.95)}">${message(q.x,q.y,'GET /page',C.blue)}</g>${appear(badge(105,865,'HTTP REQUEST'),t,.1)}${mt(1816,890,'SIMPLIFIED HTTP/2 REQUEST',20,C.slate,'text-anchor="end"')}${appear(mt(1540,830,'REQUEST RECEIVED',22,C.cyan,'text-anchor="middle"'),t,2.65)}${rect(1484,582,112*arrival,4,C.amber,2)}${appear(mt(105,410,'Browser → destination service',25,C.slate),t,.35)}${appear(mt(105,455,'A CDN or proxy may be the endpoint.',21,C.slate),t,.6)}`;
}
