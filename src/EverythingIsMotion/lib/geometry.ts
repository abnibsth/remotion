import {Point, TAU, mix, mixPoints, progress} from './motion';
import glyphData from './glyphs.json';
export type Contours = Point[][];
const N = 128;
const SLOTS = 12;
export const resampleClosed = (points: Point[], count: number): Point[] => {
  const lengths = points.map((p, i) => Math.hypot(p[0] - points[(i+1)%points.length][0], p[1] - points[(i+1)%points.length][1]));
  const total = lengths.reduce((a,b) => a+b, 0);
  let j = 0, consumed = 0;
  return Array.from({length: count}, (_, i) => {
    const target = total * i / count;
    while (j < lengths.length - 1 && consumed + lengths[j] < target) consumed += lengths[j++];
    const k = (j+1)%points.length, t = (target-consumed)/Math.max(lengths[j], 1e-9);
    return [mix(points[j][0], points[k][0], t), mix(points[j][1], points[k][1], t)];
  });
};
const ellipse = (rx: number, ry: number, cx = 0, cy = 0): Point[] => Array.from({length: N}, (_,i) => {
  const a = TAU*i/N;
  return [cx + Math.cos(a)*rx, cy + Math.sin(a)*ry];
});
const zero = (p: Point): Point[] => Array.from({length:N}, () => [...p]);
const pack = (outer: Point[], inner?: Point[]): Contours => Array.from({length:SLOTS*3}, (_,i) => i===0 ? outer : i===1 && inner ? inner : zero([0,0]));
const blend = (a: Contours, b: Contours, t: number): Contours => a.map((p,i) => mixPoints(p,b[i],t));
const flattenGlyph = (name: keyof typeof glyphData): Contours => (glyphData[name] as Point[][][]).flat();
const glyphs = {move:flattenGlyph('MOVE'), everything:flattenGlyph('EVERYTHING'), motion:flattenGlyph('IS MOTION')};

const capsule = (rx:number,ry:number): Point[] => Array.from({length:N},(_,i)=>{
  const top=i<N/2;
  const u=top?i/(N/2-1):1-(i-N/2)/(N/2-1);
  return [-Math.cos(u*Math.PI)*rx,(top?-1:1)*Math.sin(u*Math.PI)*ry];
});
const bentLine = (t: number): Point[] => {
  const bend = progress(t,2,3.7);
  const angle = mix(0.00001,TAU,bend), length = mix(820,235*TAU,bend);
  const radius=length/angle, thick=mix(6,11,bend);
  const centerY=radius*(1-Math.cos(angle/2))/2;
  const edge = (sample: number, side: number): Point => {
    const u=(1-Math.cos(sample*Math.PI))/2;
    const a=(u-.5)*angle;
    const width=thick*mix(Math.sin(sample*Math.PI),1,bend);
    return [Math.sin(a)*(radius+width*side),radius*(1-Math.cos(a))-centerY-Math.cos(a)*width*side];
  };
  return Array.from({length:N},(_,i)=>i<N/2?edge(i/(N/2-1),1):edge(1-(i-N/2)/(N/2-1),-1));
};
const volumeContour = (outer:number,inner:number):Point[] => Array.from({length:N},(_,i)=>{
  const top=i<N/2;
  const sample=top?i/(N/2-1):1-(i-N/2)/(N/2-1);
  const a=((1-Math.cos(sample*Math.PI))/2-.5)*TAU;
  const r=top?outer:inner;
  return [Math.sin(a)*r,-Math.cos(a)*r];
});

export const ribbonEdges = (t: number, count = 64): Point[] => {
  const phase = t-6;
  const center = (u: number): Point => {
    const x = Math.sin(u*TAU*1.08 + phase*.73)*mix(145,490,progress(t,6,7.1)) + (u-.5)*180;
    const y = (u-.5)*850 + Math.sin(u*TAU*1.6-phase*.7)*90;
    return [x,y];
  };
  const edge = (u: number, side: number): Point => {
    const p = center(u), a = center(u-.001), b = center(u+.001);
    const dx = b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
    const taper = Math.pow(Math.sin(Math.PI*u),.5);
    const width = (42+68*(.5+.5*Math.cos(u*TAU*1.2-phase*1.4)))*taper;
    return [p[0]-dy/len*width*side,p[1]+dx/len*width*side];
  };
  return [...Array.from({length:count},(_,i)=>edge(i/(count-1),1)),...Array.from({length:count},(_,i)=>edge(1-i/(count-1),-1))];
};

const ribbon = (t: number) => pack(resampleClosed(ribbonEdges(t),N));
const sphere = () => pack(ellipse(235,235));
const liquid = (t: number): Contours => {
  const p = progress(t,13.5,14.2)*(1-progress(t,14.5,15));
  const outer = Array.from({length:N},(_,i):Point=>{
    const a=TAU*i/N;
    const pinch = 1 - .98*p*Math.pow(Math.abs(Math.sin(a)),8);
    const r = 1+.12*Math.cos(3*a-(t-13.5)*1.5)+.045*Math.sin(5*a+(t-13.5));
    return [Math.cos(a)*480*r,Math.sin(a)*205*r*pinch];
  });
  return pack(outer);
};
const glyphToLiquid = (t: number): Contours => {
  const amount = progress(t,12.1,13.6);
  const target = liquid(t);
  return glyphs.motion.map((contour,index) => {
    const slot = Math.floor(index/3), kind = index%3;
    if (!contour.some(p=>Math.abs(p[0]-contour[0][0])+Math.abs(p[1]-contour[0][1])>.001)) return zero([mix(contour[0][0],0,amount),mix(contour[0][1],0,amount)]);
    const local = progress(t,12.1+slot*.025,13.2+slot*.025);
    if (index===0) return mixPoints(contour,target[0],amount);
    const center: Point = [mix(-550+slot*100,0,amount),0];
    const blob = ellipse(110*(1-amount),100*(1-amount),center[0],0);
    const holeCenter:Point=[contour.reduce((sum,p)=>sum+p[0],0)/N,contour.reduce((sum,p)=>sum+p[1],0)/N];
    const counterTravel=progress(t,12.5,13.6);
    const closingCounter = zero([mix(holeCenter[0],0,counterTravel),mix(holeCenter[1],0,counterTravel)]);
    return mixPoints(contour,kind===0 ? blob : closingCounter,kind===0?local:progress(t,12.1,12.5));
  });
};

export const geometryAt = (input: number): Contours => {
  const t = ((input%20)+20)%20;
  if (t < 1.2) {
    const breath = 1+.045*Math.pow(Math.sin(Math.PI*t/1.2),2);
    return pack(ellipse(19*breath,19/breath));
  }
  if (t < 2) {
    const p=progress(t,1.2,1.92);
    return pack(mixPoints(ellipse(mix(19,410,p),mix(19,6,p)),capsule(410,6),p));
  }
  if (t < 3.7) return pack(bentLine(t));
  if (t < 4.12) return blend(pack(bentLine(3.7)),pack(volumeContour(246,224)),progress(t,3.7,4.12));
  if (t < 5.75) {
    const p=progress(t,4.12,5.5);
    return pack(volumeContour(mix(246,235,p),mix(224,0,p)));
  }
  if (t < 6.85) return blend(pack(volumeContour(235,0)),ribbon(t),progress(t,5.75,6.85));
  if (t < 8.7) return ribbon(t);
  if (t < 9.65) {
    // Letter contours expand from the same ribbon's center as its surface unfolds.
    return blend(ribbon(t),glyphs.move,progress(t,8.7,9.65));
  }
  if (t < 10.22) return glyphs.move;
  if (t < 10.7) return blend(glyphs.move,glyphs.everything,progress(t,10.22,10.7));
  if (t < 11.12) return glyphs.everything;
  if (t < 11.6) return blend(glyphs.everything,glyphs.motion,progress(t,11.12,11.6));
  if (t < 12.1) return glyphs.motion;
  if (t < 13.6) return glyphToLiquid(t);
  if (t < 15.15) return liquid(t);
  if (t < 16.4) return blend(liquid(t),sphere(),progress(t,15.15,16.4));
  if (t < 18.6) {const r=mix(235,19,progress(t,16.4,18.6));return pack(ellipse(r,r));}
  return pack(ellipse(19,19));
};

export const contourPath = (points: Point[]) => {
  // Sampled font outlines retain straight stems and exact counters.
  return `M${points.map(p=>`${p[0].toFixed(3)},${p[1].toFixed(3)}`).join('L')}Z`;
};
