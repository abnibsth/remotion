import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Character} from './Character';
import {C,smooth} from './motion.mjs';
import {Stage,Paper,Label,Headline,Footer,Floor,layer,display} from './design';

export const SilenceScene:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps;
 return <Stage bg={C.cream}>
  <Floor light/><Paper t={t} light quiet/>
  <Label dark>05 / HENING SEJENAK</Label>
  <div style={{...layer,inset:0,transform:`scale(${1+t*.003})`,transformOrigin:'50% 60%'}}>
   <div style={{...layer,left:410,top:630}}><Character pose="defeated" t={t+20} width={520} tear={smooth(t,1.1,4.3)}/></div>
   <svg width="1080" height="1920" style={{...layer,inset:0}}><path d="M610 1005L385 837L356 861L602 1051" stroke={C.navy} strokeWidth="3" fill="none" strokeDasharray="10 9" opacity=".4"/></svg>
   <div style={{...layer,left:110,top:590,width:440,height:310,border:`5px solid ${C.navy}`,borderRadius:26,background:C.cream,boxShadow:`8px 10px 0 #DBCCB2`,transform:'rotate(-5deg)',padding:'48px 26px',boxSizing:'border-box'}}>
    <div style={{...layer,top:14,left:155,width:95,height:13,borderRadius:12,background:C.navy}}/>
    <div style={{fontSize:21,letterSpacing:3,color:C.navy}}>SALDO TERSEDIA</div>
    <div data-primary style={{...display,fontSize:89,color:C.navy,marginTop:24,whiteSpace:'nowrap'}}>Rp12.500</div>
    <div style={{fontSize:16,color:C.navy,opacity:.5,marginTop:18}}>DOMPET DEMO</div>
   </div>
  </div>
  <Headline y={325} size={150} color={C.navy} enter={(t-.55)*.35} style={{opacity:t<.55?0:smooth(t,.55,1.4)}}>LAH...?</Headline>
  <Headline y={1420} size={104} color={C.navy} enter={(t-2.7)*.6} style={{opacity:t<2.7?0:smooth(t,2.7,3.4)}}>TINGGAL SEGITU?!</Headline>
  <Footer number="05" dark/>
 </Stage>;
};
