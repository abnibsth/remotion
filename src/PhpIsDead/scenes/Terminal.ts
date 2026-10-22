import {C,text,mono,rule,hit} from '../design';
import {clamp,smooth} from '../motion.mjs';
export const terminal=(t:number)=>{
  const d=t-18,cmd='$ php -v'.slice(0,Math.floor(clamp((d-.10)/.5)*8));
  let s=mono('BACKEND / STILL ON DUTY',80,350,22,C.purple)+rule(390);
  s+=mono(cmd,90,670,57,C.white);
  if(d<.85)s+=`<rect x="${90+cmd.length*35}" y="625" width="27" height="50" fill="${C.lavender}" opacity="${Math.floor(d*4)%2===0?1:.1}"/>`;
  if(d>=.85){
    s+=hit(`${text('STILL',79,945,212,C.green)}${text('ALIVE.',76,1175,208,C.green)}`,t,18.85,510,1010);
    s+=mono('DEAD SINCE FOREVER.',86,1390,28,C.white);
    s+=mono('FICTIONAL MEME RESPONSE.',86,1480,20);
    s+=mono('NOT ACTUAL php -v OUTPUT.',86,1514,20);
  }
  const reset=smooth((d-1.78)/.20);
  return `${s}<rect width="1080" height="1920" fill="${C.purple}" opacity="${Math.sin(reset*Math.PI)*.8}"/><rect width="1080" height="1920" fill="${C.black}" opacity="${reset}"/>`;
};
