export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
export const mix=(a,b,p)=>a+(b-a)*p;
export const frameTime=f=>f/60;
export const SCENES=[
 {start:0,end:4,name:'Cerita'}, {start:4,end:8,name:'LUMORA'},
 {start:8,end:13,name:'Discovery'}, {start:13,end:18,name:'Profil'},
 {start:18,end:23,name:'Asisten AI'}, {start:23,end:27,name:'Peluang'},
 {start:27,end:30,name:'Tumbuh bersama'},
];
export const sceneAt=t=>SCENES.find(s=>t>=s.start&&t<s.end)??SCENES[t<0?0:6];
// Analytical solution to m*x'' + c*x' + k*(x-1)=0, x(0)=x'(0)=0.
export function spring(t,k=170,d=28,m=1){
 if(t<=0)return 0;
 const w=Math.sqrt(k/m),z=d/(2*Math.sqrt(k*m));
 if(Math.abs(z-1)<1e-5)return 1-(1+w*t)*Math.exp(-w*t);
 if(z<1){const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z*w/wd*Math.sin(wd*t));}
 const q=Math.sqrt(z*z-1),r1=-w*(z-q),r2=-w*(z+q);
 return 1+(r2*Math.exp(r1*t)-r1*Math.exp(r2*t))/(r1-r2);
}
export const ease=t=>clamp(spring(t,100,20));
export const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
export const presets={text:[170,28],browser:[90,19],card:[240,25],camera:[45,14],small:[360,30]};
export const S=(t,type='text')=>spring(t,...presets[type]);
