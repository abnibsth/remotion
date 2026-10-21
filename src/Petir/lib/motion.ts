export const FPS=60,DURATION=30;
export const clamp=(x:number,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
export const progress=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
export const ease=(q:number)=>{const p=clamp(q);return p*p*(3-2*p);};
export const E=(t:number,a:number,b:number)=>ease(progress(t,a,b));
export const hash=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
export const spring=(t:number)=>t<=0?0:1-Math.exp(-13*t)*(Math.cos(t)+13*Math.sin(t));
export const S=(t:number,a:number)=>clamp(spring(t-a));
export type Point={x:number;y:number};
export function channel():Point[]{return Array.from({length:31},(_,i)=>({x:i>=28?525:540+(hash(i+17)-.5)*115+Math.sin(i*.55)*42,y:650+i*25}));}
export const leaderY=(t:number)=>lerp(650,1350,Math.floor(progress(t,20.35,23.25)*24)/24);
export const streamerY=(t:number)=>lerp(1400,1350,E(t,23.05,23.45));
export const strokeProgress=(t:number)=>E(t,23.45,23.85);
export const returnY=(t:number)=>lerp(1400,650,strokeProgress(t));
export const flash=(t:number)=>t<3?.3*Math.exp(-Math.max(0,t-.35)*3.1)*E(t,.32,.36):.34*E(t,23.45,23.55)*(1-E(t,23.7,24.35));
export function particle(i:number,t:number,kind:'ice'|'graupel'){const dt=t-3;const speed=kind==='ice'?38:12;return {x:140+hash(i*7+2)*760+Math.sin(dt*1.1+i)*30,y:430+hash(i*5+3)*650-dt*speed,z:.55+hash(i+9)*.8,rotation:t*10+i*29};}
export function camera(t:number){const enter=E(t,2.2,4.1),exit=E(t,7,9),strike=E(t,19.4,20.5);return {x:Math.sin(t*.22)*8,y:t<8?-35*enter:0,zoom:t<8?1+.045*enter-.045*exit:1+.025*Math.sin(progress(t,8,20)*Math.PI)*(1-strike),depth:1800};}
export const CAPTIONS=[
{text:'Pernah kepikiran,\nkenapa petir bisa muncul?',startMs:350,endMs:2850,timestampMs:null,confidence:null},
{text:'Di dalam awan badai,\npartikel es saling bertabrakan.',startMs:3250,endMs:7650,timestampMs:null,confidence:null},
{text:'Tumbukan ini membantu\nmemisahkan muatan listrik.',startMs:8250,endMs:13600,timestampMs:null,confidence:null},
{text:'Saat medan listrik cukup kuat,\nudara mulai terionisasi.',startMs:14300,endMs:19600,timestampMs:null,confidence:null},
{text:'Terbentuklah jalur listrik,\nlalu muncul kilatan petir!',startMs:20200,endMs:25600,timestampMs:null,confidence:null},
{text:'Udara memanas sangat cepat.\nItulah yang menghasilkan guntur.',startMs:26000,endMs:29900,timestampMs:null,confidence:null}];
