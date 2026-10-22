import {C,text,mono,group,card} from './design';
import {smooth,mix,spring} from './motion.mjs';
export const editor=(t:number)=>{
 const fixed=t>=3.65,exit=smooth((t-5.9)/.55),zoom=1+.05*smooth(t/3);
 let s=mono('PATCH / 001',85,244,23)+mono('A SMALL CHANGE.',85,311,23,C.violet);
 s+=text('JUST ONE',78,485,115)+(fixed?'':text('SMALL FIX...',78,610,111));
 let panel=`<rect width="880" height="620" rx="15" fill="${C.charcoal}" stroke="#343C48" stroke-width="2"/><path d="M0 76H880" stroke="#343C48" stroke-width="2"/>${mono('checkout.js',35,48,24,C.white)}${mono('LOCAL',745,48,19)}
 ${mono('01',30,150,24)}${mono('const total =',100,150,31,C.violet)}
 ${mono(t>=3.3?'calculateTotal(items ?? []);':'calculateTotal(items);',100,209,30,C.white)}
 ${mono('02',30,302,24)}${mono('render(total);',100,302,31,C.white)}
 <rect x="89" y="172" width="738" height="60" rx="4" fill="${fixed?C.green:C.red}" opacity="${fixed?.06:.09}"/>
 <circle cx="52" cy="198" r="11" fill="${fixed?C.green:C.red}"/>
 ${mono(fixed?'0 issues':'1 issue',34,578,23,fixed?C.green:C.red)}${mono('fictional context',588,578,19)}
 ${group(card(fixed?'RESOLVED':'TOTAL MISMATCH',0,560,140,fixed?C.green:C.red),102,365)}`;
 const cursor=smooth((t-2.9)/.4);
 panel+=`<path d="M${mix(794,615,cursor)} ${mix(483,215,cursor)}l0 38 11-11 10 18 9-5-10-18 15-2Z" fill="${C.white}" stroke="${C.black}" stroke-width="3"/>`;
 s+=group(panel,67,770,zoom);
 if(fixed){const q=spring(t-3.65);s+=group(text('FIXED.',0,0,128,C.green),82,671,Math.max(.01,q));}
 const compress=t>5.8?1-smooth((t-5.8)/.45)*.98:1;
 return `<g opacity="${1-exit}" transform="translate(510 980) scale(${compress}) translate(-510 -980)">${s}</g>`;
};
