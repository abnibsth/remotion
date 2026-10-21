export const FPS=60,DURATION=30;
export const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export const E=(t:number,a:number,b:number)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
export type V3=[number,number,number];
const shots:{t:number;pos:V3;target:V3;fov:number}[]=[
{t:0,pos:[-6.5,1.8,5.8],target:[-.3,.7,0],fov:38},
{t:2.7,pos:[-5.2,1.1,4.5],target:[-.5,.65,0],fov:36},
{t:5,pos:[-5.9,2.8,6],target:[0,.7,0],fov:39},
{t:7,pos:[2.5,2.7,5],target:[1.5,1.05,0],fov:36},
{t:9.3,pos:[3.8,2.1,3.2],target:[2.05,1.35,0],fov:34},
{t:12,pos:[4.2,1.8,2.9],target:[2.0,1.35,0],fov:35},
{t:14,pos:[-1.8,1.7,4.2],target:[0,.15,0],fov:38},
{t:17,pos:[1.8,1.9,4.2],target:[.7,.2,0],fov:38},
{t:19,pos:[3.0,1.3,3.5],target:[1.6,.45,.65],fov:36},
{t:22,pos:[2.9,.95,3],target:[1.65,.5,.8],fov:36},
{t:25,pos:[-5,2.1,5.8],target:[0,.6,0],fov:38},
{t:27,pos:[-6.4,2.4,6.4],target:[0,.65,0],fov:38},
{t:30,pos:[-6.6,2.5,6.6],target:[0,.65,0],fov:38}];
export function camera(t:number){let i=shots.findIndex((s,j)=>j<shots.length-1&&t>=s.t&&t<shots[j+1].t);if(i<0)i=t<=0?0:shots.length-2;const a=shots[i],b=shots[i+1],p=E(t,a.t,b.t);const target=a.target.map((v,j)=>lerp(v,b.target[j],p)) as V3;const raw=a.pos.map((v,j)=>lerp(v,b.pos[j],p)) as V3;const wide=1.9-.4*E(t,6.7,8)+.3*E(t,12,14)-.15*E(t,18,20)+.25*E(t,24,26);return{pos:raw.map((v,j)=>target[j]+(v-target[j])*wide) as V3,target,fov:lerp(a.fov,b.fov,p)};}
export const stage=(t:number)=>t<3?'hook':t<7?'airflow':t<13?'wing':t<19?'floor':t<25?'grip':'track';
export function flowPoint(p:number,i:number,type:'upper'|'under'|'wing'){const x=lerp(-4,4,p);if(type==='under')return{x,y:.095+.07*Math.sin(p*Math.PI)+.18*E(p,.63,.95),z:-.65+(i%5)*.3};if(type==='wing'){return{x:lerp(.9,3.5,p),y:i%2?1.43-.19*Math.sin(p*Math.PI):1.69+.14*Math.sin(p*Math.PI),z:-.95+Math.floor(i/2)*.36};}return{x,y:i<5?1.85+Math.sin(p*Math.PI)*.42+(i%3)*.18:.78+(i%2)*.15,z:i<5?-.8+i*.4:(i%2?1:-1)*(1.35+.14*Math.sin(p*Math.PI))};}
export const flowOpacity=(t:number)=>E(t,3,4)*(1-E(t,24.4,25.4));
export const bodyOpacity=(t:number)=>1-.88*E(t,12.3,13.8)+.88*E(t,18.3,19.5)-.6*E(t,19.6,20.7)+.6*E(t,24.1,25.1);
