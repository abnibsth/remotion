import React from 'react';
import {P,hash,mix,smooth,spring,rupiah} from './motion.mjs';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/inter/latin-500.css';

export const FONT='Space Grotesk';
export const HEAVY='Archivo Black';
export const Text:React.FC<{x:number;y:number;size:number;children:React.ReactNode;fill?:string;anchor?:'start'|'middle'|'end';heavy?:boolean;transform?:string;opacity?:number;primary?:boolean}>=({x,y,size,children,fill=P.black,anchor='start',heavy=false,transform,opacity=1,primary=false})=><text data-primary={primary||undefined} x={x} y={y} fill={fill} fontFamily={heavy?HEAVY:FONT} fontSize={size} fontWeight={heavy?400:700} letterSpacing={-size*.045} textAnchor={anchor} transform={transform} opacity={opacity}>{children}</text>;
export const Texture:React.FC=()=><g opacity=".055" pointerEvents="none">{Array.from({length:700},(_,i)=><path key={i} d={`M${hash(i+13)*1080} ${hash(i+47)*1920}h${hash(i+181)*2+1}`} stroke={P.black} strokeWidth="1"/>)}</g>;
export const Note:React.FC<{x?:number;y?:number;w?:number;h?:number;r?:number;fill?:string;opacity?:number;detail?:number}>=({x=0,y=0,w=800,h=210,r=0,fill=P.lime,opacity=1,detail=1})=><g transform={`translate(${x} ${y}) rotate(${r})`} opacity={opacity}>
 <rect x={-w/2+9} y={-h/2+12} width={w} height={h} rx="18" fill={P.black} opacity=".13"/>
 <path d={`M${-w/2+20} ${-h/2}H${w/2-20}Q${w/2} ${-h/2} ${w/2} ${-h/2+20}V${h/2-20}Q${w/2} ${h/2} ${w/2-20} ${h/2}H${-w/2+20}Q${-w/2} ${h/2} ${-w/2} ${h/2-20}V${-h/2+20}Q${-w/2} ${-h/2} ${-w/2+20} ${-h/2}Z`} fill={fill}/>
 <g opacity={detail}>
 <rect x={-w/2+24} y={-h/2+23} width={w-48} height={h-46} rx="9" stroke={P.black} fill="none" strokeWidth="2"/>
 <ellipse rx={h*.33} ry={h*.35} fill={P.ivory}/>
 <Text x={0} y={h*.12} size={h*.36} anchor="middle">Rp</Text>
 <path d={`M${-w*.35} -13h${w*.18}m${-w*.18} 25h${w*.18}M${w*.17} -13h${w*.18}m${-w*.18} 25h${w*.18}`} stroke={P.black} strokeWidth="4"/>
 <circle cx={-w*.41} r="5" fill={P.black}/><circle cx={w*.41} r="5" fill={P.black}/>
 </g>
 </g>;
export const Phone:React.FC<{t:number;opacity?:number}>=({t,opacity=1})=>{
 const p=spring(t-.2,210,23),y=mix(1900,1370,p),r=mix(20,8,p);
 return <g transform={`translate(565 ${y}) rotate(${r})`} opacity={opacity}>
 <rect x="-280" y="-300" width="560" height="660" rx="64" fill={P.black}/>
 <rect x="-260" y="-280" width="520" height="620" rx="48" fill={P.ivory}/>
 <rect x="-60" y="-262" width="120" height="20" rx="10" fill={P.black}/>
 <Text x={-209} y={-220} size={25}>GAJI TELAH MASUK</Text>
 <path d="M-207 85H205" stroke={P.shade} strokeWidth="2"/>
 <Text x={-208} y={133} size={23}>Bulan ini, aman. Kayaknya.</Text>
 <rect x="-50" y="309" width="100" height="5" rx="3" fill={P.black}/>
 </g>;
};
export const RollingSalary:React.FC<{t:number;x:number;y:number;scale?:number;opacity?:number;split?:number}>=({t,x,y,scale=1,opacity=1,split=0})=>{
 const shown=rupiah(Math.round(mix(4250000,5000000,smooth(t,0,.52))));
 const chars=shown.split(''),width=82;
 return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
  {chars.map((c,i)=>{const p=smooth(t,.05+i*.018,.40+i*.018);const drop=(1-p)*-170;return <g key={i} transform={`translate(${(i-(chars.length-1)/2)*width} ${drop+split*Math.sin(i*1.7)*70}) rotate(${split*(i-4)*8})`}><Text x={0} y={0} size={131} anchor="middle" fill={P.black}>{c}</Text></g>;})}
 </g>;
};
export const SalaryPlatform:React.FC<{t:number;x:number;y:number;w:number;h:number;r:number;morph:number}>=({t,x,y,w,h,r,morph})=><g>
 <Note x={x} y={y} w={w} h={h} r={r} detail={morph}/>
 <g transform={`translate(${x} ${y}) rotate(${r})`} opacity={1-morph}>
  <RollingSalary t={t} x={0} y={45}/>
 </g>
</g>;
export const PaperTrail:React.FC<{t:number;opacity?:number}>=({t,opacity=1})=><g opacity={opacity}>{Array.from({length:5},(_,i)=>{
 const dt=t-2.8-i*.10,p=smooth(dt,0,.6);if(dt<0)return null;
 const x=mix(540,[-140,1220,930,60,1160][i],p),y=mix(1100,[530,440,1580,1480,1150][i],p)+Math.sin((t+i)*2)*35;
 return <Note key={i} x={x} y={y} w={180+i*15} h={95+i*5} r={mix(0,[-28,28,-20,25,16][i],p)+Math.sin(t*2+i)*8} opacity={.8} fill={i%2?P.lavender:P.lime}/>;
 })}</g>;
export const SmallPrint:React.FC<{light?:boolean}>=({light=false})=><text x="80" y="1760" fill={light?P.ivory:P.black} opacity=".35" fontFamily="Inter" fontSize="18" fontWeight="500">Ilustrasi karakter & transaksi fiktif.</text>;
