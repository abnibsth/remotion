export const FPS=60,FRAMES=1200;
export const PRODUCT=Object.freeze({brand:'MYKONOS',name:'VERVE',type:'Extrait de Parfum',volume:'50 ml',variant:'Verve'});
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,p)=>a+(b-a)*p;
export const smooth=p=>{const x=clamp(p);return x*x*x*(x*(x*6-15)+10);};
export const progress=(t,a,b)=>smooth((t-a)/(b-a));
export const spring=t=>t<=0?0:1-Math.exp(-11*t)*(1+11*t);
export const sceneAt=t=>t<3?'teaser':t<7?'reveal':t<12?'details':t<17?'hero':'packshot';
// Camera moves the flat photographic plane only: no imaginary view is revealed.
export const cameraAt=t=>{
 const reveal=progress(t,.65,4.1),details=progress(t,6.7,7.5),hero=progress(t,11.5,12.6),final=progress(t,16.6,17.8);
 return {x:mix(mix(1040,1190,reveal),1150,hero),y:mix(mix(850,572,reveal),570,hero),zoom:mix(mix(3.35,1.04,reveal),1.09,hero)*(1-.055*final),rotation:mix(mix(-3,0,reveal),-1.2,details)*(1-hero),rotateY:0,depth:mix(160,0,reveal),final};
};
export const shotAt=t=>({
 bottleOpacity:1-progress(t,6.85,7.4)+progress(t,11.6,12.35),
 detailOpacity:progress(t,6.85,7.4)*(1-progress(t,11.6,12.35)),
 packageOpacity:progress(t,17,17.7),
 light:progress(t,0,.9),
 detailPan:progress(t,7.2,11.8),
 hero:progress(t,11.7,12.7),
 final:progress(t,16.6,17.8),
});
