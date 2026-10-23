import {C,type,mono,group,caption} from './design';
import {poseAt,smooth,clamp,mix,type Key} from './motion.mjs';
export const bold=(t:number)=>{
 const u=t-3,p=poseAt('bold',t),d=Math.max(0,u-1.03),shake=u>=1.03?3*Math.exp(-15*d)*Math.sin(50*d):0;
 let s=caption('01 / BOLD','CONFIDENT.',C.vermilion);
 const floorY=1120+8*Math.exp(-10*d)*Math.sin(25*d)*(u>=1.03?1:0);
 s+=`<path d="M80 ${floorY}Q510 ${floorY+12*Math.exp(-8*d)} 940 ${floorY}" fill="none" stroke="${C.vermilion}" stroke-width="3"/>`;
 s+=group(type('BOLD',0,0,264,'bold','text-anchor="middle"'),p.x+shake,p.y,p.sx,p.sy);
 if(u>=1.03)for(let i=0;i<3;i++){const x=130+i*310,y=1120-22*Math.exp(-4*d)*Math.sin(13*d+i);s+=`<rect x="${x}" y="${y}" width="14" height="7" fill="${C.vermilion}" transform="rotate(${8*Math.exp(-6*d)} ${x} ${y})"/>`;}
 const hand=smooth((u-2.55)/.45);s+=`<path d="M${80} 1120H${mix(80,1200,hand)}" stroke="${C.cobalt}" stroke-width="${3+hand*3}"/>`;
 return group(s,0,0,1,1,0,1-smooth((u-2.8)/.2));
};
export const italic=(t:number)=>{
 const u=t-6,p=poseAt('italic',t),a=smooth(u/.16);let s=caption('02 / ITALIC','UNSTOPPABLE.',C.cobalt);
 s+=`<path d="M-180 1120C210 1130 720 1110 1200 680" fill="none" stroke="${C.cobalt}" stroke-width="3" opacity=".5" stroke-dasharray="${Math.max(1,1500*smooth(u/1.1))} 1900"/>`;
 const speed=u<1?clamp((1-u)*.7):clamp((u-2.25)*3);
 for(let i=3;i>0;i--)s+=group(type('ITALIC',0,0,238,'italic','text-anchor="middle"'),p.x-i*18*speed,p.y+i*4,p.sx*(1+speed*.04),1,p.rotation,.07*speed);
 s+=group(type('ITALIC',0,0,238,'italic','text-anchor="middle"'),p.x,p.y,p.sx,p.sy,p.rotation,a);
 const tail=smooth((u-2.6)/.4);s+=`<path d="M1000 800C${mix(1400,200,tail)} ${mix(400,800,tail)} 850 1200 220 1170" fill="none" stroke="${C.lavender}" stroke-width="${tail*8}" opacity="${tail}"/>`;
 return s;
};
export const serif=(t:number)=>{
 const u=t-9,p=poseAt('serif',t);let s=caption('03 / SERIF','ELEGANT.',C.lavender);
 const bow=1-smooth((u-2.5)/.5);
 s+=`<path d="M80 1115C130 1280 790 1340 925 850C955 740 780 635 680 690" fill="none" stroke="${C.lavender}" stroke-width="4" opacity="${.65*bow}"/>`;
 const gap=12*Math.sin(Math.PI*clamp(u/2.4));
 for(const [i,ch] of [...'SERIF'].entries()){const x=(i-2)*(130+gap);s+=group(type(ch,0,0,270,'serif','text-anchor="middle"'),p.x+x,p.y+Math.sin((i-2)*.5)*24*Math.sin(Math.PI*clamp(u/2.5)),1,1,p.rotation+(i-2)*1.5*Math.sin(Math.PI*clamp(u/2.4)));}
 const grid=smooth((u-2.5)/.5);s+=`<path d="M80 ${mix(1115,1200,grid)}H940" stroke="${C.lavender}" stroke-width="2" opacity="${grid}"/>`;
 return s;
};
export const monospace=(t:number)=>{
 const u=t-12;let s=caption('04 / MONOSPACE','PRECISE.',C.ink),grid='';const expand=smooth(u/.7);
 for(let i=0;i<11;i++){const x=80+i*86;grid+=`<path d="M${x} 685V1240" stroke="${C.line}" stroke-width="1.5"/>`;}
 for(let i=0;i<7;i++)grid+=`<path d="M80 ${685+i*86}H940" stroke="${C.line}" stroke-width="1.5"/>`;
 s+=group(grid,0,0,1,1,0,expand);
 for(const [i,ch] of [...'MONOSPACE'].entries()){
  const at=.15+i*.105,q=Math.floor(clamp((u-at)/.45)*4)/4,x=125+i*86,y=mix(1200+(i%2)*86,1035,q);
  s+=`<rect x="${x-40}" y="978" width="80" height="80" fill="${C.lime}" opacity="${q*.8}"/>`;
  s+=type(ch,x,y,88,'monospace','text-anchor="middle"');
 }
 if(u>1.5)s+=mono('09 GLYPHS / 09 CELLS / ZERO GUESSWORK',80,1360,20,C.muted);
 return s;
};
export const performances:Record<Key,(t:number)=>string>={bold,italic,serif,monospace};
