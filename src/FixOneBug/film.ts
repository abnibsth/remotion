import {C,text,mono,group} from './design';
import {smooth,spring,clamp,mix} from './motion.mjs';
import {editor} from './Editor';
import {city,fracture} from './City';
export const svgAt=(t:number)=>{
 let s='';
 if(t<6.45)s+=editor(t);
 if(t>=6&&t<10.6)s+=fracture(t);
 if(t>=6.3&&t<10){s+=group(text('WAIT. WHAT?',0,0,95),80,340,Math.max(.001,spring(t-6.3)));s+=mono('ILLUSTRATIVE ERRORS. NOT A REAL DIAGNOSIS.',80,1580,17);}
 if(t>=9.8&&t<18.4){
  s+=city(t);
  if(t<15){const a=clamp((t-10)*3)*(1-smooth((t-14.2)/.6));s+=group(text('ONE FIX.',0,0,112),80,380,1,0,a);if(t>11.2)s+=group(text('TEN NEW',0,0,102)+text('PROBLEMS.',0,115,110,C.red),80,520,1,0,clamp((t-11.2)*3)*(1-smooth((t-14.2)/.6)));}
  s+=mono(t<15?'BUILD / ERROR DISTRICT':'A PERFECTLY REASONABLE EXPLANATION.',80,258,20,C.muted,`opacity="${1-smooth((t-17.7)/.5)}"`);
  if(t>=15.9&&t<17.8)s+=mono('SAME CITY. DIFFERENT PERSPECTIVE.',510,1470,20,C.violet,'text-anchor="middle"');
 }
 if(t>=18){
  const q=smooth((t-18)/.35),end=smooth((t-19.65)/.35);
  const terminal=`<rect width="850" height="460" rx="12" fill="${C.charcoal}" stroke="#3B4354" stroke-width="2"/><path d="M0 70H850" stroke="#3B4354"/>${mono('LOCAL TERMINAL',30,44,21)}${t>=18.35?mono('&gt; fix completed',45,191,41,C.white):''}${t>=18.85?mono('&gt; new errors: 10',45,284,41,C.red):''}<rect x="45" y="337" width="24" height="7" fill="${C.white}" opacity="${Math.floor(t*3)%2?1:.1}"/>`;
  s+=group(terminal,mix(85,510,end),mix(690,968,end),q*(1-end),0,1);
  s+=`<circle cx="510" cy="968" r="${mix(0,11,end)}" fill="${C.red}"/>`;
 }
 const margin=`<path d="M80 175H940M80 1640H940" stroke="${C.charcoal}" stroke-width="2"/>${mono('FIX ONE BUG / CREATE TEN MORE',80,1684,16,C.muted)}`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="${C.black}"/>${margin}${s}</svg>`;
};
