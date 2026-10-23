export const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
export const smooth=v=>{const x=clamp(v);return x*x*(3-2*x);};
export const mix=(a,b,q)=>a+(b-a)*q;
export const spring=(t,w=19,d=12)=>t<=0?0:1-Math.exp(-d*t)*(Math.cos(w*t)+d/w*Math.sin(w*t));
export const profiles={
 bold:{typeface:'Archivo Black',mass:'heavy',motion:'impact',anticipation:.35,overshoot:.06,settle:.55,followThrough:.12,trajectory:'gravity',color:'#181818',accent:'#F16A50'},
 italic:{typeface:'Inter Tight',mass:'light',motion:'accelerating',anticipation:.12,overshoot:.23,settle:.18,followThrough:.24,trajectory:'cubic arc',color:'#365CFF',accent:'#365CFF'},
 serif:{typeface:'Cormorant Garamond',mass:'medium',motion:'graceful',anticipation:.4,overshoot:.04,settle:.65,followThrough:.35,trajectory:'ballet arc',color:'#181818',accent:'#A995E8'},
 monospace:{typeface:'IBM Plex Mono',mass:'precise',motion:'stepped',anticipation:.1,overshoot:0,settle:.1,followThrough:0,trajectory:'orthogonal grid',color:'#181818',accent:'#D8E99A'},
};
export const starts={bold:3,italic:6,serif:9,monospace:12};
export const openingPose=(key,t)=>{const local=t>=18?20-t:t,life=smooth(local/.6)*(1-smooth((local-2.5)/.5));const map={bold:{x:82,y:875,size:190},italic:{x:300,y:1085,size:183},serif:{x:82,y:1315,size:213},monospace:{x:220,y:1495,size:76}};const a=map[key];return {...a,rotation:key==='italic'?-7*life:key==='serif'?2.3*Math.sin(local*2)*life:0,dx:key==='monospace'?Math.floor(local*3)%2*5*life:key==='italic'?Math.sin(local*3)*10*life:0};};
export const poseAt=(key,t)=>{
 const u=t-starts[key];let x=510,y=1030,sx=1,sy=1,rotation=0;
 if(key==='bold'){
  if(u<.5)y=620-24*smooth(u/.5);
  else if(u<1.03)y=mix(596,1100,clamp((u-.5)/.53)**2);
  else {const d=u-1.03;const squash=.14*Math.exp(-11*d)*Math.cos(23*d);sx=1+squash;sy=1-squash;y=1100-20*Math.exp(-9*d)*Math.sin(21*d);}
 }else if(key==='italic'){
  const q=spring(Math.max(0,u-.28),18,13);x=mix(-700,510,q);y=980-95*Math.sin(clamp(u/1.15)*Math.PI);rotation=-9+9*smooth((u-.55)/.7);
  if(u>2.3){const z=clamp((u-2.3)/.52);x+=1600*z*z;y-=260*z*z;rotation=-4*z;}
 }else if(key==='serif'){
  const q=smooth(u/1.05);x=mix(670,510,q);y=mix(1160,1030,q)-60*Math.sin(q*Math.PI);rotation=mix(-12,0,q)+1.1*Math.sin(Math.max(0,u-1)*2)*smooth((u-1)/.4)*(1-smooth((u-2.3)/.5));
 }else{
  const step=Math.floor(clamp((u-.18)/1.1)*6)/6;x=mix(330,510,step);y=mix(1195,1045,step);
 }
 return {x,y,sx,sy,rotation};
};
export const assemblyAt=t=>{
 const target='PERSONALITY';
 return [...target].map((glyph,i)=>{const k=i<3?'bold':i<6?'italic':i<9?'serif':'monospace',row=['bold','italic','serif','monospace'].indexOf(k),n=i-(row===0?0:row===1?3:row===2?6:9),startX=[200,180,260,125][row]+n*[170,125,120,86][row],startY=620+row*240,at=15.32+row*.12,q=clamp(k==='monospace'?Math.floor(smooth((t-at)/.65)*8)/8:k==='italic'?spring(t-at,21,15):k==='bold'?clamp((t-at)/.85)**2:smooth((t-at)/.8));return {glyph,key:k,x:mix(startX,[94,178.64,263.28,354.64,428.52,517.75,599.89,682.61,745.05,783.25,853.25][i],q),y:mix(startY,1035,q),progress:q,row,n};});
};
