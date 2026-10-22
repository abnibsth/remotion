export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
export const smooth=v=>{const x=clamp(v);return x*x*(3-2*x);};
export const mix=(a,b,q)=>a+(b-a)*q;
export const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
export const spring=t=>t<=0?0:1-Math.exp(-12*t)*(Math.cos(18*t)+12/18*Math.sin(18*t));
export const labels=['TYPE ERROR','NULL VALUE','TIMEOUT','404','500','BUILD FAILED','DEPENDENCY ERROR','UNDEFINED','CONNECTION LOST','TEST FAILED'];
const glyphs={I:['111','010','010','010','010','010','111'],T:['11111','00100','00100','00100','00100','00100','00100'],W:['10001','10001','10001','10101','10101','11011','10001'],O:['01110','11011','10001','10001','10001','11011','01110'],R:['11110','10001','10001','11110','10100','10010','10001'],K:['10001','10010','10100','11000','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],N:['10001','11001','11001','10101','10011','10011','10001'],M:['10001','11011','10101','10101','10001','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],A:['01110','10001','10001','11111','10001','10001','10001'],C:['01111','10000','10000','10000','10000','10000','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],E:['11111','10000','10000','11110','10000','10000','11111'],'.':['0','0','0','0','0','1','1'],' ':['000','000','000','000','000','000','000']};
const footprints=[];
for(const [lineIndex,line] of ['IT WORKS','ON MY','MACHINE.'].entries()){
 const width=[...line].reduce((n,ch)=>n+glyphs[ch][0].length+1,0)-1;let col=0;
 for(const ch of line){const g=glyphs[ch];g.forEach((row,z)=>[...row].forEach((v,x)=>{if(v==='1')footprints.push({x:(col+x-width/2)*22+11,z:(lineIndex*10+z-13)*24});}));col+=g[0].length+1;}
}
export const objects=footprints.map((p,id)=>{const h=35+hash(id+17)*150;return {id:`error-${String(id).padStart(4,'0')}`,index:id,label:labels[id%10],initial:{x:510,z:900},spawn:id<10?6.30+id*.13:10+(Math.abs(p.x)/420+hash(id)*.5)*1.2,target:{x:190+(id%2)*360,z:455+Math.floor(id%10/2)*195},scale:1,rotation:(hash(id+3)-.5)*12,velocity:'cubic-bezier / damped-spring',city:{x:p.x,z:p.z,h},reveal:{x:p.x,z:p.z}};});
export const cameraAt=t=>{const q=smooth((t-14.4)/1.5),pull=smooth((t-10)/3.7);return {yaw:mix(-.42,0,q),tilt:mix(.78,0,q),scale:mix(mix(1.15,.98,pull)+.07,1,q),centerY:mix(1060,990,q),reveal:q};};
export const project=(x,z,h,c)=>{const a=x*Math.cos(c.yaw)-z*Math.sin(c.yaw),b=x*Math.sin(c.yaw)+z*Math.cos(c.yaw);return {x:510+a*c.scale,y:c.centerY+(b*Math.cos(c.tilt)-h*Math.sin(c.tilt))*c.scale};};
export const poseAt=(o,t)=>{const q=smooth((t-9.6)/2.5),rise=clamp(spring(t-o.spawn));return {x:mix(o.target.x-510,o.city.x,q),z:mix(o.target.z-990,o.city.z,q),h:o.city.h*rise,scale:mix(1,22/270,q),rotation:o.rotation*(1-q)};};
