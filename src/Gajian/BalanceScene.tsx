import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Character} from './Character';
import {C,balanceAt,expenses,rupiah,spring,smooth,shake} from './motion.mjs';
import {Stage,Paper,Label,Money,Footer,layer,display,ExpenseIcon} from './design';

export const BalanceScene:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps+14;
 const current=expenses.reduce((a,e,i)=>t>=e.deduct?i:a,-1),last=t>=19.4;
 const [sx,sy]=shake(t,last?19.4:expenses[current]?.deduct??50,last?22:8);
 return <Stage bg={t<18.25?C.yellow:C.red}>
  <Paper t={t} light/>
  <Label dark>04 / SIMULASI KEUANGAN FIKTIF</Label>
  <div style={{...layer,inset:0,transform:`translate(${sx}px,${sy}px) scale(${1+smooth(t,14,19.4)*.015})`,transformOrigin:'50% 40%'}}>
   <div style={{...layer,left:90,top:295,color:C.navy,...display,fontSize:94}}>UANGNYA<br/>KE MANA?</div>
   <div style={{...layer,left:90,right:105,top:550,padding:'40px 32px 35px',background:C.navy,border:`5px solid ${C.ink}`,boxShadow:`12px 14px 0 ${C.cream}`,color:C.cream}}>
    <div style={{fontSize:23,letterSpacing:4,color:C.mint}}>DOMPET DEMO / SALDO BERJALAN</div>
    <div data-primary style={{...display,fontSize:last?146:119,whiteSpace:'nowrap',marginTop:30,color:last?C.yellow:C.cream,transform:`scale(${last?1+(1-spring(t-19.4,160,18))*.16:1})`,transformOrigin:'0 50%'}}>{rupiah(balanceAt(t))}</div>
    <div style={{marginTop:28,height:3,background:'#625878'}}/>
    <div style={{fontSize:21,marginTop:20,fontWeight:500}}>Awal bulan Rp5.000.000</div>
   </div>
   <div style={{...layer,left:90,top:950,width:500}}>
    {expenses.map((e,i)=>{
     if(t<e.deduct)return null;
     const active=i===current;
     return <div key={e.label} data-primary style={{height:106,marginBottom:13,padding:'14px 18px',boxSizing:'border-box',background:active?C.navy:C.cream,color:active?C.cream:C.navy,display:'flex',alignItems:'center',gap:17,border:`3px solid ${C.ink}`,transform:`translateX(${(1-spring(t-e.deduct,300,22))*-600}px)`}}>
      <div style={{background:active?C.yellow:'transparent',width:56,height:60,flexShrink:0}}><ExpenseIcon index={i} size={56}/></div>
      <div><div style={{fontSize:i===4?17:19,letterSpacing:1}}>{e.label}</div><div style={{...display,fontSize:41,color:active?C.yellow:C.navy}}>-{rupiah(e.amount)}</div></div>
     </div>;
    })}
   </div>
   <div style={{...layer,left:530,top:920,transform:`rotate(${-8-smooth(t,18.25,19.4)*7}deg)`}}><Character pose={last?'shocked':'reaching'} t={t} width={490}/></div>
   {expenses.map((e,i)=><Money key={i} t={t} start={e.deduct} count={6} mode="escape"/>)}
  </div>
  {last&&<div style={{...layer,left:700,top:1470,color:C.navy,...display,fontSize:88,transform:`rotate(8deg) scale(${spring(t-19.4,300,22)})`}}>HABIS?!</div>}
  <Footer number="04" dark/>
 </Stage>;
};
