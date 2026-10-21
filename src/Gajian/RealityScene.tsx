import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Character} from './Character';
import {C,expenses,spring,smooth,shake,rupiah} from './motion.mjs';
import {Stage,Paper,Headline,Label,Speed,Footer,ExpenseIcon,layer,display} from './design';

export const RealityScene:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps+8;
 const list=expenses.slice(0,4),active=list.reduce((a,e,i)=>t>=e.attack?i:a,-1);
 const dt=active>=0?t-list[active].attack:0;
 const [sx,sy]=shake(t,active>=0?list[active].attack:8,active>=2?22:14);
 const dirs=[[-1200,0],[1100,0],[0,-1000],[0,1200]];
 return <Stage>
  <Paper t={t}/><Speed t={t} strength={.6+(t-8)*.09}/>
  <Label>03 / PLOT TWIST BULANAN</Label>
  <div style={{...layer,inset:0,transform:`translate(${sx}px,${sy}px)`}}>
   {active<0?<>
    <Headline y={390} size={135} enter={t-8.03} color={C.red} extrude rotate={-4}>EH, TUNGGU<br/>DULU!</Headline>
    <div style={{...layer,left:280,top:850}}><Character pose="confused" t={t} width={540}/></div>
   </>:<>
    <div style={{...layer,left:100,top:315,...display,fontSize:87,color:C.cream}}>REALITA<br/><span style={{color:C.red}}>MENYERANG.</span></div>
    <div style={{...layer,left:380,top:680,transform:`rotate(${sx*.18}deg)`}}><Character pose={active<1?'confused':active<3?'panicking':'shocked'} t={Math.floor(t*10)/10} width={580}/></div>
    {list.map((e,i)=>{
     if(t<e.attack)return null;
     const settled=i<active,p=spring(t-e.attack,300,22),stack=smooth(t,list[i+1]?.attack??99,(list[i+1]?.attack??99)+.32);
     const x=settled?90:90+(1-p)*dirs[i][0];
     const y=settled?860+i*145:555+(1-p)*dirs[i][1];
     const scale=settled?.58:1;
     return <div key={e.label} data-primary style={{...layer,left:x,top:y,width:800,height:220,transform:`rotate(${settled?-2:i%2===0?-3:2}deg) scale(${scale})`,transformOrigin:'0 0',background:settled?C.cream:C.red,color:C.ink,border:`6px solid ${C.ink}`,boxShadow:`11px 13px 0 ${settled?C.red:C.yellow}`,display:'flex',alignItems:'center',gap:24,padding:'22px 30px',boxSizing:'border-box',opacity:1-stack*.06}}>
      <ExpenseIcon index={i} size={90}/><div><div style={{fontSize:29,letterSpacing:3}}>{e.label}</div><div style={{...display,fontSize:79,whiteSpace:'nowrap'}}>-{rupiah(e.amount)}</div></div>
     </div>;
    })}
    <div style={{...layer,left:110,top:1380,background:C.yellow,color:C.navy,padding:'16px 24px',fontSize:29,transform:'rotate(-3deg)'}}>GAJI: MASUK. TAGIHAN: IKUT MASUK.</div>
   </>}
  </div>
  {active>=0&&dt<.1&&<div style={{...layer,inset:0,background:C.red,opacity:.34*(1-dt/.1),mixBlendMode:'screen'}}/>}
  {active>=0&&dt<.6&&<svg width="1080" height="1920" style={{...layer,inset:0,opacity:1-smooth(dt,.1,.6),pointerEvents:'none'}}><ellipse cx="540" cy="720" rx={220+dt*1100} ry={100+dt*600} fill="none" stroke={C.cream} strokeWidth={8*(1-dt/.6)}/></svg>}
  <Footer number="03"/>
 </Stage>;
};
