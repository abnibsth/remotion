import {C,group} from './design';
import {smooth} from './motion.mjs';
import {opening} from './Opening';
import {bold,italic,serif,monospace} from './Performances';
import {assembly} from './Assembly';
export const svgAt=(time:number)=>{
 const t=Math.max(0,Math.min(20,time));let s='';
 if(t<3)s+=opening(t);
 if(t>=2.8&&t<6.15)s+=group(bold(t),0,0,1,1,0,smooth((t-2.8)/.2)*(1-smooth((t-5.95)/.2)));
 if(t>=5.95&&t<9.2)s+=group(italic(t),0,0,1,1,0,smooth((t-5.95)/.2)*(1-smooth((t-9)/.2)));
 if(t>=9&&t<12.2)s+=group(serif(t),0,0,1,1,0,smooth((t-9)/.2)*(1-smooth((t-12)/.2)));
 if(t>=12&&t<15.3)s+=group(monospace(t),0,0,1,1,0,smooth((t-12)/.2)*(1-smooth((t-15)/.3)));
 if(t>=15&&t<19.65)s+=group(assembly(t),0,0,1,1,0,smooth((t-15)/.25)*(1-smooth((t-19.2)/.45)));
 if(t>=19.2)s+=group(opening(20),0,0,1,1,0,smooth((t-19.2)/.45));
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="${C.ivory}"/>${s}</svg>`;
};
