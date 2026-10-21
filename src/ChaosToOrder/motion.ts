import data from './objects.json';
export const objects=data;export type Item=typeof data[number];
export const FPS=60,DURATION=20;
export const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export const phase=(t:number)=>((t%20)+20)%20;
export const E=(t:number,a:number,b:number)=>{const p=clamp((t-a)/(b-a));return p*p*p*(p*(p*6-15)+10);};
export const spring=(x:number)=>{const p=clamp(x);return p>=1?1:1-Math.exp(-9*p)*(Math.cos(8*p)+9/8*Math.sin(8*p));};
export function camera(time:number){const t=phase(time),turn=E(t,10.8,15),back=E(t,18,20);return {yaw:lerp((.08+.48*turn)*(1-E(t,14.25,15)),.08,back),pitch:lerp((-.055-.17*E(t,11,13))*(1-E(t,14.25,15)),-.055,back),zoom:lerp(lerp(1.025,1,E(t,5,10)),1.025,back)};}
export function state(o:Item,time:number){const t=phase(time),w=2*Math.PI*t/20;const chaos=[o.initialPosition[0]+22*Math.sin(w+o.phase),o.initialPosition[1]+19*Math.cos(w+o.phase),o.initialPosition[2]+12*Math.sin(w+o.phase*.7)];const signal=E(t,3+o.delay*.5,6+o.delay*.25)*.15;const align=E(t,6+o.delay,6+o.delay+o.duration);const grid=clamp(signal+align);const reveal=E(t,11,15);const back=E(t,18,20);const arc=Math.sin(grid*Math.PI)*(1-grid)*o.bend;
const pos=chaos.map((v,i)=>{const g=lerp(v,o.organizedPosition[i],grid)+(i===0?arc:i===1?-arc*.5:0);return lerp(lerp(g,o.revealPosition[i],reveal),v,back);});return{x:pos[0],y:pos[1],z:pos[2],rotation:lerp(lerp(o.rotation+8*Math.sin(w+o.phase),0,grid),o.rotation+8*Math.sin(w+o.phase),back),scale:lerp(lerp(o.scale,1,grid),o.scale,back),reveal:reveal*(1-back),grid:grid*(1-reveal)*(1-back)};}
export function project(s:{x:number;y:number;z:number},c:ReturnType<typeof camera>){const x=s.x*Math.cos(c.yaw)+s.z*Math.sin(c.yaw),z=-s.x*Math.sin(c.yaw)+s.z*Math.cos(c.yaw);const y=s.y*Math.cos(c.pitch)-z*Math.sin(c.pitch),zz=s.y*Math.sin(c.pitch)+z*Math.cos(c.pitch);const scale=1500/(1500-zz)*c.zoom;return{x:x*scale,y:y*scale,scale,depth:zz};}
