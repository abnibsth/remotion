import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Character} from './Character';
import {C,spring,smooth,mix,rupiah,clamp} from './motion.mjs';
import {Stage,Paper,Burst,Phone,Headline,Label,Confetti,Footer,layer,display,ui} from './design';

export const SalaryScene:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps;
 const celebrate=t>=2.5,p=spring(t,180,16),push=smooth(t,1.6,2.35),exit=smooth(t,2.45,2.8);
 const amount=t<1.55?Math.round(5000000*smooth(t,.75,1.55)):5000000;
 return <Stage>
  <Burst t={t} opacity={celebrate?.22:.08} cy={1000}/><Paper t={t}/>
  <Label>01 / HARI PALING DITUNGGU</Label>
  {!celebrate&&<div data-primary style={{...layer,left:90,top:270,...display,fontSize:106}}>AKHIRNYA,<br/><span style={{color:C.yellow}}>TANGGAL GAJIAN.</span></div>}
  <div style={{...layer,inset:0,opacity:1-exit,transform:`translateY(${mix(0,-20,push)}px) scale(${mix(1,1.22,push)})`,transformOrigin:'50% 48%'}}>
   <Phone y={640} x={235} scale={Math.max(.001,p)} rotation={mix(-12,-2,p)}>
    <div style={{padding:'96px 35px',...ui}}>
     <div style={{fontSize:24,letterSpacing:5,opacity:.55}}>DOMPET DEMO</div>
     <div style={{marginTop:58,fontSize:28,fontWeight:500}}>Halo, pejuang kantor.</div>
     <div style={{marginTop:18,fontSize:20,letterSpacing:4}}>SALDO TERSEDIA</div>
     <div style={{marginTop:16,...display,fontSize:66}}>Rp5.000.000</div>
     <div style={{marginTop:32,height:2,background:C.navy,opacity:.2}}/>
     <div style={{marginTop:30,fontSize:24}}>↑ Transfer masuk</div>
    </div>
    <div style={{...layer,left:20,right:20,top:130,padding:'30px 24px',background:C.mint,border:`3px solid ${C.ink}`,borderRadius:18,boxShadow:`8px 9px 0 ${C.navy}`,opacity:t<.7?0:1,transform:`translateY(${(1-spring(t-.7,300,22))*-380}px)`}}>
     <div style={{fontSize:21,letterSpacing:2}}>✓ GAJI TELAH MASUK</div>
     <div style={{...display,fontSize:66,marginTop:14,whiteSpace:'nowrap'}}>+ {rupiah(amount)}</div>
     <div style={{fontSize:24,marginTop:12}}>Saldo: Rp5.000.000</div>
    </div>
    <div style={{...layer,bottom:84,left:34,right:34,background:C.navy,color:C.cream,padding:24,borderRadius:14,fontSize:22,textAlign:'center'}}>BULAN INI, AMAN.</div>
   </Phone>
  </div>
  {celebrate&&<>
   <Headline y={330} size={204} enter={t-2.5} extrude rotate={-4}>GAJIAN!!!</Headline>
   <div style={{...layer,left:170,top:650,transform:`translateY(${-Math.sin(clamp((t-2.5)/.8)*Math.PI)*135}px) scale(${.7+.3*spring(t-2.5,180,16)})`}}><Character pose="celebrating" t={t} width={740}/></div>
   <div data-primary style={{...layer,left:160,right:160,top:1480,color:C.navy,background:C.yellow,textAlign:'center',padding:'20px 0',fontSize:29,transform:'rotate(-3deg)'}}>KERJA KERAS TERBAYAR JUGA.</div>
   <Confetti t={t} start={2.5}/>
  </>}
  <Footer number="01"/>
 </Stage>;
};
