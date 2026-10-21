import {camera,E,objects,phase,project,state,lerp} from './motion';
const C={ivory:'#F4F0E8',ink:'#171717',blue:'#315BFF'};
const text=(x:number,y:number,s:string,size:number,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${C.ink}" ${extra}>${s}</text>`;
export function svgAt(time:number){const t=phase(time),cam=camera(t);const rows=objects.map(o=>({o,s:state(o,t)})).map(v=>({...v,q:project(v.s,cam)})).sort((a,b)=>a.q.depth-b.q.depth);const dots=rows.map(({o,s,q})=>{const x=520+q.x,y=920+q.y,sz=lerp(21,22,s.reveal)*s.scale*q.scale,fill=o.color;let shape='';
if(o.type==='circle')shape=`<circle r="${sz*.46}" fill="${fill}"/>`;
else if(o.type==='line')shape=`<rect x="${-sz*.6}" y="${-sz*.17}" width="${sz*1.2}" height="${sz*.34}" fill="${fill}"/>`;
else if(o.type==='letter')shape=`<text x="0" y="${sz*.36}" font-size="${sz*1.15}" text-anchor="middle" fill="${fill}">${'ORDER'[o.id%5]}</text>`;
else if(o.type==='marker')shape=`<path d="M${-sz*.45} 0H${sz*.45}M0 ${-sz*.45}V${sz*.45}" stroke="${fill}" stroke-width="${sz*.28}"/>`;
else shape=`<rect x="${-sz*.45}" y="${-sz*.45}" width="${sz*.9}" height="${sz*.9}" rx="1" fill="${fill}"/>`;
return `<g data-id="${o.id}" transform="translate(${x.toFixed(4)} ${y.toFixed(4)}) rotate(${s.rotation.toFixed(4)})">${shape}</g>`;}).join('');
const gridOpacity=E(t,3.7,6)*.12*(1-E(t,11,12.5));const grid=`<g opacity="${gridOpacity}">${Array.from({length:17},(_,i)=>`<path d="M${160+i*45} 550V1290" stroke="${C.ink}" stroke-width="1"/>`).join('')}${Array.from({length:16},(_,i)=>`<path d="M160 ${598+i*46}H880" stroke="${C.ink}" stroke-width="1"/>`).join('')}</g>`;
const signal=E(t,3,3.25)*(1-E(t,5.8,6.2)),signalY=lerp(490,1350,E(t,3,5.8));const intro=E(t,0,.45)*(1-E(t,2.65,3));const find=E(t,3.2,3.6)*(1-E(t,5.8,6.2));const outro=E(t,15,15.45)*(1-E(t,17.8,18.25));
return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" font-family="'Space Grotesk',sans-serif" font-weight="700" style="display:block;background:${C.ivory}"><rect width="1080" height="1920" fill="${C.ivory}"/>${grid}${dots}<g opacity="${signal}"><path d="M100 ${signalY}H940" stroke="${C.blue}" stroke-width="3"/></g><g opacity="${intro}">${text(95,330,'CAN CHAOS',79,'letter-spacing="-4"')}${text(95,414,'BECOME PERFECT?',79,'letter-spacing="-4"')}</g><g opacity="${find}">${text(95,354,'FIND THE',79,'letter-spacing="-4"')}${text(95,439,'PATTERN.',79,'letter-spacing="-4"')}</g><g opacity="${outro}">${text(520,1210,'ORDER WAS ALWAYS THERE.',28,'font-family="\'IBM Plex Mono\'" font-weight="500" text-anchor="middle"')}</g></svg>`;
}
