export const FPS=30;
export const FRAMES=900;
export const C={navy:'#17152F',navy2:'#29234F',yellow:'#FFD326',red:'#FF453A',cream:'#FFF3DA',mint:'#42D6A4',ink:'#171222'};
export const expenses=[
  {label:'KOS',amount:1500000,attack:9,deduct:14.35,end:14.95},
  {label:'MAKAN',amount:1200000,attack:10.1,deduct:15.25,end:15.85},
  {label:'CICILAN',amount:1000000,attack:11.2,deduct:16.15,end:16.75},
  {label:'TRANSPORT',amount:500000,attack:12.4,deduct:17.05,end:17.75},
  {label:'KEBUTUHAN LAIN',amount:787500,attack:18.25,deduct:18.25,end:19.4},
];
export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
export const mix=(a,b,p)=>a+(b-a)*p;
export const smooth=(t,a,b)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
export function spring(t,k=160,d=18){
  if(t<=0)return 0;
  const w=Math.sqrt(k),z=d/(2*w);
  if(z<1){const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z*w/wd*Math.sin(wd*t));}
  if(Math.abs(z-1)<1e-6)return 1-Math.exp(-w*t)*(1+w*t);
  const r1=-w*(z-Math.sqrt(z*z-1)),r2=-w*(z+Math.sqrt(z*z-1));
  return 1-(r2*Math.exp(r1*t)-r1*Math.exp(r2*t))/(r2-r1);
}
export const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453123;return x-Math.floor(x);};
export const rupiah=n=>'Rp'+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
export const sceneAt=t=>t<4?0:t<8?1:t<14?2:t<20?3:t<25?4:5;
export function balanceAt(t){let b=5000000;for(const e of expenses)b-=e.amount*smooth(t,e.deduct,e.end);return Math.round(b);}
export function shake(t,start,strength=16){const dt=t-start;if(dt<0||dt>.5)return [0,0];const env=Math.exp(-dt*10)*strength;return [Math.sin(dt*103)*env,Math.cos(dt*87)*env];}
