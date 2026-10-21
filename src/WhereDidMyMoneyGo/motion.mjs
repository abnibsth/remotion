export const FINANCE = Object.freeze({
  initial: 5000000,
  expenses: [
    {label: 'RENT', amount: 1500000},
    {label: 'FOOD', amount: 1200000},
    {label: 'INSTALLMENTS', amount: 1000000},
    {label: 'TRANSPORT', amount: 500000},
    {label: 'OTHER EXPENSES', amount: 787500},
  ],
});
export const EVENTS = Object.freeze({deductions: [5.5, 6.75, 8, 9.75, 11.25], collapse: 12.5, silence: 13, fold: 16.4, title: 17.25});
export const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
export const mix = (a,b,p) => a+(b-a)*p;
export const smooth = p => { const x=clamp(p); return x*x*x*(x*(x*6-15)+10); };
export const progress = (t,a,b) => smooth((t-a)/(b-a));
export const spring = (t, frequency=12, damping=0.85) => {
  if(t<=0)return 0;
  const w=frequency*Math.sqrt(1-damping*damping);
  return 1-Math.exp(-damping*frequency*t)*(Math.cos(w*t)+damping*frequency/w*Math.sin(w*t));
};
export const formatIDR = n => 'Rp'+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
export const balanceAt = t => FINANCE.initial-FINANCE.expenses.reduce((sum,e,i)=>sum+Math.round(e.amount*progress(t,EVENTS.deductions[i],EVENTS.deductions[i]+0.55)),0);
export const cameraAt = t => ({
  x: 34*progress(t,5,6.4)-68*progress(t,6.4,8.4)+34*progress(t,8.8,9.4),
  y: 105*progress(t,2.5,3.8)-105*progress(t,4,5),
  zoom: 1+0.025*progress(t,0,2.2)-0.045*progress(t,2.5,4)+0.02*progress(t,4,5)+0.018*progress(t,9,12.4)-0.018*progress(t,12.5,13)+0.045*progress(t,13.6,15.8)-0.045*progress(t,16,17.8),
  rotation: -1.1*progress(t,3.7,4.7)+1.1*progress(t,8.8,9.5),
  perspective: 0.8*progress(t,3.7,5)-0.8*progress(t,8.8,9.5),
});
// Four equally sampled edges retain exact vertex correspondence in every morph.
export const receiptPoints = (width,height,curve=0,tooth=0) => {
  const points=[]; const n=48;
  const warp=(x,y)=>[x,y+curve*42*Math.sin((x/width+0.5)*Math.PI*2)];
  for(let i=0;i<=n;i++)points.push(warp(-width/2+width*i/n,-height/2));
  for(let i=1;i<=n;i++)points.push(warp(width/2,-height/2+height*i/n));
  for(let i=1;i<=n;i++)points.push(warp(width/2-width*i/n,height/2-(i%2)*tooth));
  for(let i=1;i<n;i++)points.push(warp(-width/2,height/2-height*i/n));
  return points;
};
export const morphPoints = (a,b,p) => a.map((point,i)=>[mix(point[0],b[i][0],p),mix(point[1],b[i][1],p)]);
export const pathFromPoints = points => points.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' ')+' Z';
export const surfaceAt = t => {
  const unfold=progress(t,2.15,3.55), track=progress(t,4.05,5), drain=progress(t,8.85,9.45);
  const returnPaper=progress(t,16,16.45), fold=progress(t,16.45,17.05), panel=progress(t,17.05,17.6);
  const notification=receiptPoints(1160,300,0,0);
  const receipt=receiptPoints(630,850,0,14);
  const timeline=receiptPoints(1660,450,0.2,10);
  let points=morphPoints(notification,receipt,unfold);
  points=morphPoints(points,timeline,track);
  points=morphPoints(points,receiptPoints(340,8),drain);
  if(t>=16){points=morphPoints(receiptPoints(135,3),receiptPoints(620,310,0,12),returnPaper);points=morphPoints(points,receiptPoints(270,270),fold);points=morphPoints(points,receiptPoints(1712,850),panel);}
  return {path:pathFromPoints(points),x:960,y:t>=16?mix(620,565,returnPaper):mix(mix(510,590,unfold),565,track),opacity:t<1?progress(t,.7,1):t<13?1-progress(t,9.15,9.5):t<16?0:returnPaper,red:panel,fold};
};
