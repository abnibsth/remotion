export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const mix=(a,b,u)=>a+(b-a)*u;
export const ease=(t,a,b)=>{const u=clamp((t-a)/(b-a));return u*u*u*(10+u*(-15+6*u));};
export const lerp3=(a,b,u)=>a.map((v,i)=>mix(v,b[i],u));
export const spring=(t,k=150,d=19)=>{if(t<=0)return 0;const w=Math.sqrt(Math.max(.001,k-d*d/4));return 1-Math.exp(-d*t/2)*(Math.cos(w*t)+d/(2*w)*Math.sin(w*t));};
export const screenToWorld=(x,y)=>[-3.05+x/1600*6.1,5.61-y/1000*3.82,.135];
export const PORTAL=screenToWorld(1350,870);
export const CARD_TIMES=[11.2,11.68,12.15,12.58,13,13.42,13.82,14.18,14.5,14.86,15.18];
export const LABELS=['NEW MESSAGE','UPDATE READY','STORAGE FULL','SYNC COMPLETE','NEW MESSAGE','99+ NOTIFICATIONS','UPDATE READY','SYNC COMPLETE','NEW MESSAGE','STORAGE FULL','99+ NOTIFICATIONS'];
export const OBJECTS={
 folder:{origin:screenToWorld(290,500),size:[1.12,.9],screen:[290,500],material:'cobalt'},
 browser:{origin:screenToWorld(1000,490),size:[3.22,2.25],screen:[1000,490],material:'soft-white'},
 notification:{origin:screenToWorld(1370,150),size:[1.72,.64],screen:[1370,150],material:'soft-white'}
};
const pose=(position,rotation=[0,0,0],scale=[1,1,1],extra={})=>({position,rotation,scale,visible:true,...extra});
export function vortex(p,t,start,end,phase=0){
 const u=ease(t,start,end),r=1-u,ang=u*Math.PI*2.4;
 const dx=p[0]-PORTAL[0],dy=p[1]-PORTAL[1];
 return {position:[PORTAL[0]+(dx*Math.cos(ang)-dy*Math.sin(ang)*.7)*r,PORTAL[1]+(dy*Math.cos(ang)+dx*Math.sin(ang)*.7)*r,PORTAL[2]+(p[2]-PORTAL[2])*r+Math.sin(u*Math.PI)*(.6+phase*.06)],rotation:[u*1.8,u*2.6,u*5.3],scale:[Math.max(.001,r**.8),Math.max(.001,r**1.2),Math.max(.001,r)],visible:t<end};
}
const folderDesk=[-1.75,.58,2.15];
export function folderAt(t){
 const o=OBJECTS.folder.origin,exit=[-1.84,3.42,1.75];
 if(t>=21.2)return pose(o,[0,0,(t>24.05&&t<24.6)?Math.sin((t-24.05)*30)*.06*Math.sin(Math.PI*(t-24.05)/.55):0],[1,1,1],{depth:.008});
 if(t>=17.6){const v=vortex([-1.53,.58,2.2],t,18.2,20.65);if(t<18.2){v.position=[-1.53-.13*Math.sin(ease(t,17.6,18.2)*Math.PI),.58,2.2];v.rotation=[0,-.12,.02*Math.sin(t*30)];}return {...v,depth:.23};}
 if(t<3){const wob=t>2.5?Math.sin((t-2.5)*28)*.055*Math.sin(clamp((t-2.5)/.5)*Math.PI):0;return pose(o,[0,0,wob],[1,1,1],{depth:.008});}
 if(t<4.5){const u=ease(t,3,4.5),anticipate=Math.sin(ease(t,3,3.7)*Math.PI)*.07;return pose(lerp3(o,exit,u),[-.12*u,-.34*u,.1*Math.sin(u*Math.PI)],[1+.11*Math.sin(u*Math.PI),1-anticipate,1],{depth:mix(.008,.23,u)});}
 if(t<5.55){const u=clamp((t-4.5)/1.05);return pose([mix(exit[0],folderDesk[0],ease(t,4.5,5.55)),mix(exit[1],folderDesk[1],u*u),mix(exit[2],folderDesk[2],u)],[-.12*(1-u),-.34+u*.2,.05*Math.sin(u*Math.PI)],[1,1,1],{depth:.23});}
 const impact=t-5.55;
 const bounce=impact<.5?.44*Math.sin(Math.PI*impact/.5):0;
 const squash=impact<.16?.16*Math.sin(Math.PI*impact/.16):0;
 const rock=Math.sin(impact*19)*Math.exp(-impact*5)*.12;
 const nudge=.22*ease(t,13,13.42);
 return pose([folderDesk[0]+nudge,folderDesk[1]+bounce,folderDesk[2]+.05*ease(t,5.55,6.4)],[-.02,-.14,rock],[1+squash,1-squash,1],{depth:.23});
}
export function browserAt(t){
 const o=OBJECTS.browser.origin;
 if(t>=21.2)return pose(o,[0,0,0],[1,1,1],{peel:0,depth:.008});
 if(t<7)return pose(o,[0,0,0],[1,1,1],{peel:0,depth:.008});
 const u=ease(t,7,9.2),p=lerp3(o,[.65,2.9,2.65],u);
 const drift=ease(t,9.2,11);
 p[0]+=.13*Math.sin((t-9.2)*1.6)*drift;p[1]+=.14*Math.sin((t-9.2)*1.9)*drift;
 const rotation=[-.12*u+drift*.07*Math.sin(t*1.7),-.44*u+drift*.13*Math.sin(t),-.12*u];
 if(t>=17.25){const at=browserAt(17.2499),v=vortex(at.position,t,17.25,20.25,.4);return {...v,rotation:v.rotation.map((x,i)=>x+at.rotation[i]*(1-ease(t,17.25,20.25))),peel:.38+.9*Math.sin(ease(t,17.25,20.25)*Math.PI),depth:.035};}
 return pose(p,rotation,[1,1,1],{peel:Math.sin(ease(t,7,9.6)*Math.PI)*.85+.24*u,depth:mix(.008,.035,u)});
}
const landings=[[-.6,.055,3.4],[1.6,.055,1.9],[-2.75,.055,2.7],[1.65,.125,2.02],[-.12,.055,4.15],[3,.055,3.4],[-.45,.125,3.4],[1.4,.195,2.15],[-2.7,.125,2.9],[.2,.195,3.5],[2.9,.125,3.6]];
export function cardAt(i,t){
 const start=CARD_TIMES[i],o=OBJECTS.notification.origin,d=landings[i];
 if(i===0&&t>=11&&t<start)return pose(o,[0,0,0],[mix(.001,.25,ease(t,11,start)),1,1],{depth:.008});
 if(t<start||t>=21.2)return pose(o,[0,0,0],[.001,.001,.001],{visible:false,depth:.008});
 if(t>17.02+i*.067){const v=vortex(d,t,17.02+i*.067,19.3+i*.105,i);return {...v,rotation:[-Math.PI/2*(1-ease(t,17.02+i*.067,19.3+i*.105))+v.rotation[0],v.rotation[1],v.rotation[2]],depth:.045};}
 const a=clamp((t-start)/.85),u=ease(t,start,start+.85),launch=ease(t,start,start+.26);
 const flyY=o[1]+.52*Math.sin(a*Math.PI)-((o[1]-d[1])*a*a);
 const z=mix(o[2],d[2],u),x=mix(o[0],d[0],u);
 const hit=t-start-.85,bounce=hit>=0&&hit<.25?.14*Math.sin(hit/.25*Math.PI):0;
 const skew=(i%2?1:-1)*(.12+i*.019);
 return pose([x,a<1?flyY:d[1]+bounce,z],[-Math.PI/2*u,.08*Math.sin(u*Math.PI),skew*u],[Math.min(1,.25+spring(t-start,260,27)*.75),1,1],{depth:mix(.008,.045,launch)});
}
const cameras=[
 [0,[6.3,6.8,20.5],[0,2.6,.1],34],
 [3,[5.9,6.55,19.5],[-.12,2.65,.2],34],
 [4.6,[4.5,5.9,17.3],[-.3,2.45,.8],35],
 [6.6,[4.1,5.5,17.4],[-.3,2.2,1.15],35],
 [8,[4.6,6.3,18.5],[.1,2.75,.75],35],
 [10.6,[-2.6,6.4,19.7],[0,2.6,1],35],
 [14.8,[-3.3,7.7,22.5],[0,2.4,1],34],
 [16.6,[1.8,7.2,21],[.4,2.65,.7],34],
 [19.9,[3.4,6.7,19],[.65,2.8,.45],35],
 [22.2,[6.3,6.8,20.5],[0,2.6,.1],34],
 [25,[6.3,6.8,20.5],[0,2.6,.1],34]
];
export function cameraAt(t){
 let a=cameras[0],b=cameras[1];for(let i=0;i<cameras.length-1;i++){if(t>=cameras[i][0]){a=cameras[i];b=cameras[i+1];}}
 const u=ease(t,a[0],b[0]);return {position:lerp3(a[1],b[1],u),target:lerp3(a[2],b[2],u),fov:mix(a[3],b[3],u)+4+3*ease(t,3.1,4.5)*(1-ease(t,7,8.5))};
}
export function stateAt(t){
 t=clamp(t,0,25);const open=ease(t,16.9,17.6),close=1-ease(t,20.85,21.2);
 return {t,camera:cameraAt(t),folder:folderAt(t),browser:browserAt(t),cards:CARD_TIMES.map((_,i)=>cardAt(i,t)),portal:{scale:open*close,angle:(t-16.9)*1.2},restore:ease(t,21.15,21.35),notification:ease(t,23.45,23.7)};
}
