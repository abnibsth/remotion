import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Character} from './Character';
import {C,spring,smooth,clamp} from './motion.mjs';
import {Stage,Paper,Label,Footer,layer,display,Floor} from './design';

const Calendar:React.FC<{t:number}>=({t})=><div style={{...layer,left:590,top:380,width:360,height:440,background:C.cream,border:`5px solid ${C.ink}`,boxShadow:`10px 12px 0 ${C.ink}`,transform:`rotate(${Math.sin(t*24)*Math.exp(-t*4)*3}deg)`}}>
 <div style={{background:C.red,padding:'19px 22px',fontSize:24,color:C.cream,letterSpacing:3}}>GAJIAN BERIKUTNYA</div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8,padding:'22px 18px',color:C.navy}}>{Array.from({length:28},(_,i)=><div key={i} style={{height:47,display:'grid',placeItems:'center',fontSize:20,position:'relative',border:i===27?`3px solid ${C.red}`:'none',borderRadius:i===27?'50%':0}}>{i+1}{i<3&&<span style={{...layer,width:30,height:3,background:C.red,transform:'rotate(-30deg)'}}/>}</div>)}</div>
 <div style={{fontSize:18,textAlign:'center',color:C.navy,opacity:.65}}>Masih 25 hari lagi.</div>
 </div>;
export const WaitingScene:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps;
 const pan=smooth(t,0,2),drop=spring(t-1.35,180,16),reveal=smooth(t,1.85,2.7);
 return <Stage>
  <Floor/><Paper t={t}/><Label>06 / SIKLUS KEHIDUPAN</Label>
  <div style={{...layer,inset:0,transform:`translateX(${-18*pan}px)`}}>
   <Calendar t={t}/>
   <div style={{...layer,left:95,top:540}}><Character pose="defeated" t={t+25} width={600} look={smooth(t,.6,2)}/></div>
   <svg width="1080" height="1920" style={{...layer,inset:0}}><path d="M65 1355H1010L1070 1430H20Z" fill="#8B635A" stroke={C.ink} strokeWidth="7"/><path d="M20 1430H1070V1470H20ZM95 1470V1730H143V1470M932 1470V1710H981V1470" fill="#644B51" stroke={C.ink} strokeWidth="7"/>
    {t>=1.35&&<g transform={`translate(715 ${1120+drop*220}) rotate(${-8+(1-drop)*40})`}><path d="M-82-38L60-24L76 35L-70 43Z" fill={C.cream} stroke={C.ink} strokeWidth="6"/><path d="M-60-26L2-4L53-16M2-4L8 29" fill="none" stroke={C.ink} strokeWidth="4"/><path d="M39-3L80-1L84 22L44 23Z" fill={C.yellow} stroke={C.ink} strokeWidth="4"/><circle cx="65" cy="11" r="4" fill={C.ink}/></g>}
   </svg>
  </div>
  <div style={{...layer,left:80,right:100,top:1050,height:340,overflow:'hidden',opacity:t<1.85?0:1}}>
   <div data-primary style={{...display,fontSize:127,color:C.yellow,textShadow:`7px 8px 0 ${C.ink}`,transform:`translateY(${(1-reveal)*340}px)`,background:C.navy,padding:'18px 14px'}}>GAJIAN<br/>MASIH LAMA...</div>
  </div>
  <div data-primary style={{...layer,left:95,top:1430,fontSize:34,color:C.cream,background:C.navy,padding:'10px 0',opacity:smooth(t,2.4,2.85)}}>Baru masuk, udah pamit.</div>
  <div data-primary style={{...layer,left:95,top:1500,background:C.mint,color:C.navy,padding:'17px 36px',fontSize:43,fontWeight:900,transform:`scale(${Math.max(.001,spring(t-3.05,300,22))})`,transformOrigin:'0 50%',opacity:t<3.05?0:1}}>RELATE GAK?</div>
  <Footer number="06"/>
  <div style={{...layer,left:95,top:1660,fontSize:18,color:C.cream,opacity:clamp((t-3.3)*2)*.5}}>Karakter, saldo & transaksi merupakan ilustrasi fiktif.</div>
 </Stage>;
};
