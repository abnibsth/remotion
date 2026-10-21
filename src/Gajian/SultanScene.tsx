import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Character} from './Character';
import {C,spring,smooth} from './motion.mjs';
import {Stage,Paper,Burst,Headline,Label,Money,Footer,layer,Bill} from './design';

const Throne:React.FC=()=><svg width="890" height="1080" viewBox="0 0 890 1080" style={{...layer,left:100,top:570}}>
 <path d="M180 720L210 120L340 180L440 20L550 180L680 120L720 720Z" fill={C.navy2} stroke={C.ink} strokeWidth="9"/>
 <path d="M241 652L260 229L347 260L440 119L532 260L632 223L662 652Z" fill={C.navy} stroke={C.yellow} strokeWidth="5"/>
 <path d="M131 623L234 643V907H123Z M656 643L754 623L768 907H656Z" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
 <path d="M111 611L251 611V681H111Z M640 611H772V681H640Z M180 844H710V932H180Z" fill={C.mint} stroke={C.ink} strokeWidth="8"/>
 <path d="M214 935L190 1045H260L289 935M601 935L625 1045H697L672 935" fill={C.navy} stroke={C.ink} strokeWidth="8"/>
 <path d="M25 800L153 774L193 1019L62 1044Z M730 808L861 823L839 1050L711 1035Z" fill={C.cream} stroke={C.ink} strokeWidth="6"/>
 <path d="M60 805Q35 710 115 735L132 786M753 823Q755 736 816 749L831 824" fill="none" stroke={C.ink} strokeWidth="7"/>
 <g transform="translate(72 876) rotate(-9)" fill="none" stroke={C.navy} strokeWidth="7" strokeLinejoin="round"><path d="M0 50V0H17Q35 0 35 15Q35 29 17 29H0M17 29L38 50M49 59V18H62Q78 18 78 34Q78 49 62 49H49"/></g>
 <path d="M735 923L816 934" stroke={C.navy} strokeWidth="7"/>
 </svg>;
export const SultanScene:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps;
 return <Stage bg={C.yellow}>
  <Burst t={t} color={C.navy} opacity={.09} cy={1040}/><Paper t={t} light/>
  <Money t={t} start={0} count={13}/>
  <Label dark>02 / MENTAL JUTAWAN</Label>
  <Headline y={320} size={166} color={C.navy} enter={t-.12}>AUTO<br/><span style={{color:C.cream,textShadow:`7px 8px 0 ${C.navy}`}}>SULTAN!</span></Headline>
  <div style={{...layer,inset:0,transform:`perspective(2000px) rotateX(${-2+smooth(t,0,3)*2}deg) translateY(${(1-spring(t,180,16))*400}px) scale(${1+t*.008})`,transformOrigin:'50% 70%'}}>
   <Throne/>
   <div style={{...layer,left:225,top:640}}><Character pose="rich" t={t+4} sunglasses={smooth(t,.18,.55)} width={630}/></div>
  </div>
  <Bill x={-55+t*22} y={1020+t*33} rotate={24+t*9} scale={1.45}/><Bill x={886-t*20} y={530+t*27} rotate={-28+t*11} scale={1.3}/>
  <div data-primary style={{...layer,left:105,right:105,top:1510,color:C.navy,fontSize:33,fontWeight:700,textAlign:'center',background:C.yellow,padding:'15px 0'}}>Baru gajian, berasa kaya.</div>
  <Footer number="02" dark/>
 </Stage>;
};
