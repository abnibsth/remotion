export const FPS=60;
export const DURATION=30;
export const SCENES=[{name:'THE CLICK',start:0,end:3},{name:'THE URL',start:3,end:6},{name:'DNS LOOKUP',start:6,end:10},{name:'SECURE CONNECTION',start:10,end:14},{name:'HTTP REQUEST',start:14,end:18},{name:'HTTP RESPONSE',start:18,end:22},{name:'BROWSER RENDERING',start:22,end:27},{name:'THE WHOLE JOURNEY',start:27,end:30}] as const;
export const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export const progress=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
export const ease=(x:number)=>{const p=clamp(x);return p<.5?4*p*p*p:1-(-2*p+2)**3/2;};
export const E=(t:number,a:number,b:number)=>ease(progress(t,a,b));
export function spring(t:number,k=170,d=26){if(t<=0)return 0;const a=d/2,w=Math.sqrt(Math.max(.001,k-a*a));return 1-Math.exp(-a*t)*(Math.cos(w*t)+a/w*Math.sin(w*t));}
export const S=(t:number,a:number)=>clamp(spring(t-a));
export const sceneAt=(t:number)=>SCENES.find(s=>t>=s.start&&t<s.end)||SCENES[7];
export const ROUTE=[{x:380,y:650},{x:650,y:650},{x:790,y:545},{x:1110,y:545},{x:1270,y:650},{x:1540,y:650}];
export const ROUTE_PATH='M380 650H650L790 545H1110L1270 650H1540';
const lengths=ROUTE.slice(1).map((p,i)=>Math.hypot(p.x-ROUTE[i].x,p.y-ROUTE[i].y));
const total=lengths.reduce((a,b)=>a+b,0);
export function routePoint(p:number){let distance=clamp(p)*total;for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){const q=clamp(distance/lengths[i]);return {x:lerp(ROUTE[i].x,ROUTE[i+1].x,q),y:lerp(ROUTE[i].y,ROUTE[i+1].y,q)};}distance-=lengths[i];}return ROUTE[5];}
export const requestProgress=(t:number)=>E(t,14.8,16.65);
export const responseProgress=(t:number)=>E(t,18.85,20.35);
export const channelSecure=(t:number)=>t>=12.35;
export const pageState=(t:number)=>({parse:E(t,22,22.7),style:E(t,22.65,23.3),layout:E(t,23.2,23.8),paint:E(t,23.65,24.5),composite:E(t,24.3,25.1),image:E(t,24.8,26.1),ready:S(t,25.4)});
export function camera(t:number){return {x:t<3?-6*E(t,.6,2.7):t>=14&&t<18?-18*Math.sin(progress(t,14,18)*Math.PI):t>=18&&t<22?15*Math.sin(progress(t,18,22)*Math.PI):0,y:0,zoom:t<3?1+.018*E(t,.6,2.6):t>=27?lerp(1.035,1,E(t,27,28.2)):1,rotation:0,depth:1800,perspective:1800,targetX:t<3?1170:960,targetY:600};}
