import {C,group,card} from './design';
import {objects,cameraAt,project,smooth,clamp,spring,mix,type Camera} from './motion.mjs';
const points=(p:{x:number;y:number}[])=>p.map(v=>`${v.x.toFixed(2)},${v.y.toFixed(2)}`).join(' ');
const roof=(x:number,z:number,h:number,c:Camera)=>[project(x-10,z-11,h,c),project(x+10,z-11,h,c),project(x+10,z+11,h,c),project(x-10,z+11,h,c)];
export const city=(t:number)=>{
 const c=cameraAt(t),develop=smooth((t-9.65)/2.6);let s='';
 const active=objects.filter(o=>t>=o.spawn).sort((a,b)=>a.city.z-b.city.z);
 for(const o of active){
  const rise=clamp(spring(t-o.spawn)),h=o.city.h*rise,p=roof(o.city.x,o.city.z,h,c),base=roof(o.city.x,o.city.z,0,c);
  const isAccent=o.index%9===0,top=c.reveal>.01?`rgb(${Math.round(mix(isAccent?255:65,242,c.reveal))},${Math.round(mix(isAccent?77:73,242,c.reveal))},${Math.round(mix(isAccent?94:92,239,c.reveal))})`:(isAccent?C.red:'#41495C');
  s+=`<g data-object="${o.id}"><polygon points="${points([p[1],p[2],base[2],base[1]])}" fill="#181E2B" stroke="#333B4E" stroke-width=".7"/><polygon points="${points([p[2],p[3],base[3],base[2]])}" fill="${isAccent?'#6B2636':'#283044'}" stroke="#40465B" stroke-width=".7"/>`;
  for(let level=25;level<h-7;level+=27){const q=roof(o.city.x,o.city.z,level,c);s+=`<path d="M${q[2].x} ${q[2].y}L${q[3].x} ${q[3].y}" stroke="${isAccent?C.red:C.violet}" stroke-opacity=".55" stroke-width="2"/>`;}
  s+=`<polygon points="${points(p)}" fill="${top}" stroke="${c.reveal>.7?C.white:'#7A8295'}" stroke-width=".55"/>`;
  if(c.reveal<.8){const center=project(o.city.x,o.city.z,h,c);s+=`<circle cx="${center.x}" cy="${center.y}" r="${o.index%11===0?2.6:1}" fill="${C.red}"/>`;}
  s+='</g>';
 }
 // Fixed links between existing neighboring rooftop panels make UI skybridges.
 if(c.reveal<1){for(let i=14;i<active.length;i+=47){const a=active[i],b=active[Math.min(i+3,active.length-1)],p=project(a.city.x,a.city.z,a.city.h*.65,c),q=project(b.city.x,b.city.z,b.city.h*.65,c);s+=`<path d="M${p.x} ${p.y}L${q.x} ${q.y}" stroke="${C.violet}" stroke-width="4" opacity="${.5*(1-c.reveal)}"/>`;}}
 const collapse=smooth((t-17.85)/.55);
 const scale=(1-collapse)*develop;
 return group(s,510*collapse,990*collapse,Math.max(.0001,scale),0,clamp((t-9.8)*3));
};
export const fracture=(t:number)=>{
 let s='';const handoff=smooth((t-9.65)/.9);
 if(t<6.3){const q=smooth((t-6)/.3);return `<path d="M${510-q*90} 880l45 45-32 22 58 56" fill="none" stroke="${C.red}" stroke-width="${2+q*3}"/>`;}
 for(const o of objects.slice(0,10)){
  if(t<o.spawn)continue;const d=t-o.spawn,p=spring(d),cityP=project(o.city.x,o.city.z,o.city.h,cameraAt(t));
  const x=mix(510-155,o.target.x,p),y=mix(895,o.target.z,p),curve=Math.sin(clamp(d/.65)*Math.PI)*70*(o.index%2?1:-1);
  s+=group(card(o.label,o.index),mix(x+curve,cityP.x-10,handoff),mix(y,cityP.y-11,handoff),mix(.20+.8*p,22/310,handoff),o.rotation*(1-handoff),1-handoff);
 }
 return s;
};
