export const FPS=60,DURATION=20;
export const BEATS=[{name:'HOOK',start:0,end:2},{name:'HEAVY',start:2,end:5},{name:'LIGHT',start:5,end:8},{name:'FAST',start:8,end:11},{name:'SLOW',start:11,end:14},{name:'ELASTIC',start:14,end:17},{name:'FINAL',start:17,end:20}];
export const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export const p=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
export const ease=(x:number)=>{const q=clamp(x);return q<.5?4*q*q*q:1-(-2*q+2)**3/2;};
export const E=(t:number,a:number,b:number)=>ease(p(t,a,b));
export const out=(x:number)=>1-(1-clamp(x))**4;
export function spring(t:number,k=170,d=26){if(t<=0)return 0;const a=d/2,w=Math.sqrt(Math.max(.001,k-a*a));return 1-Math.exp(-a*t)*(Math.cos(w*t)+a/w*Math.sin(w*t));}
export const S=(t:number,a:number)=>clamp(spring(t-a));
export const osc=(t:number,a:number,d=5,w=14)=>t<0?0:a*Math.exp(-d*t)*Math.sin(w*t);
export function heavyState(t:number){const fall=p(t,.12,.72);const hit=Math.max(0,t-.72);const compress=t>=.72?-.2*Math.exp(-8*hit)*Math.cos(19*hit):0;return {y:t<.72?lerp(-330,1130,fall*fall):1130+osc(hit,24,7,17),sy:1+compress,sx:1/(1+compress),floor:t<.72?0:70*Math.exp(-.65*hit)+osc(hit,35,5,15),impact:t>=.72?Math.exp(-7*hit):0};}
export function lightState(t:number,i=0){const local=Math.max(0,t-5);return {y:lerp(1080,730,out(p(t,4.7,7.8)))+Math.sin(local*1.65+i*.45)*11,x:Math.sin(local*1.2+i*.55)*5,rotation:Math.sin(local*1.5+i*.6)*1.3};}
export function fastX(t:number){if(t<8.85){const q=p(t,8,8.85);return lerp(-590,1450,q*q*q);}if(t<9.5)return lerp(1450,550,out(p(t,8.85,9.5)));if(t<10.25)return 550+osc(t-9.5,35,5,14);return lerp(550,650,out(p(t,10.25,11)));}
export const fastVelocity=(t:number)=>(fastX(t+.001)-fastX(t-.001))/.002;
export const slowX=(t:number)=>lerp(610,510,out(p(t,11,14)));
export function elasticState(t:number){let stretch=1;if(t>=14&&t<15.15)stretch=1+.65*E(t,14.2,15.15);else if(t>=15.15)stretch=1+.65*Math.exp(-5*(t-15.15))*Math.cos(15*(t-15.15));return {stretch,sy:1/stretch,collapse:E(t,16.5,17)};}
export function camera(t:number){if(t<5)return {x:0,y:t<.72?-18*p(t,.12,.72)**2:osc(t-.72,12,9,25),zoom:1};if(t<8)return {x:0,y:-10*Math.sin(p(t,5,8)*Math.PI),zoom:1};if(t<11)return {x:clamp((550-fastX(t))*.08,-35,35),y:0,zoom:1};if(t<14)return {x:4*Math.sin((t-11)*.5),y:0,zoom:1};return {x:t<17?-10*(elasticState(t).stretch-1):0,y:0,zoom:t>=17?lerp(1.018,1,E(t,17,18.3)):1};}
export const mix=(a:string,b:string,q:number)=>{const n=(s:string,i:number)=>parseInt(s.slice(i,i+2),16);return '#'+[1,3,5].map(i=>Math.round(lerp(n(a,i),n(b,i),clamp(q))).toString(16).padStart(2,'0')).join('');};
