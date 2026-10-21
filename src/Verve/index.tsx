import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import {cameraAt,mix,progress,shotAt} from './motion.mjs';

const C={black:'#100F0D',ink:'#181612',gold:'#C5A56A',ivory:'#EFE8D9',muted:'#A79D8A'};
const serif='Georgia, "Times New Roman", serif',sans='Inter, sans-serif';
const asset=(name:string)=>staticFile(`product-commercial/verve/${name}`);
const Caption:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;fill?:string;anchor?:'start'|'middle'|'end';spacing?:number;opacity?:number}>=({x,y,children,size=24,fill=C.ivory,anchor='start',spacing=4,opacity=1})=><text data-type="caption" x={x} y={y} fontFamily={sans} fontSize={size} fill={fill} textAnchor={anchor} letterSpacing={spacing} opacity={opacity}>{children}</text>;
const MaskLine:React.FC<{t:number;start:number;x:number;y:number;width:number;height:number;children:React.ReactNode}>=({t,start,x,y,width,height,children})=><svg x={x} y={y} width={width} height={height} overflow="hidden" opacity={t<start?0:1}><g transform={`translate(0 ${height*(1-progress(t,start,start+.8))})`}>{children}</g></svg>;

export const VerveFilm:React.FC<{time:number}>=({time:t})=>{
 const camera=cameraAt(t),shot=shotAt(t),reveal=progress(t,2.5,4.5);
 const titleOpacity=progress(t,3.1,3.7)*(1-progress(t,6.55,7.05));
 const detailIntro=progress(t,7.35,8),detailTwo=progress(t,9.35,10),detailThree=progress(t,10.5,11.05);
 const bottleHeight=700*camera.zoom,bottleWidth=bottleHeight*132/239;
 return <div style={{width:1920,height:1080,background:C.black,overflow:'hidden'}}>
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width={1920} height={1080}>
  <defs>
   <radialGradient id="verve-bg" cx="63%" cy="43%" r="64%"><stop offset="0" stopColor="#5B4426" stopOpacity={mix(.35,.65,shot.hero)}/><stop offset=".53" stopColor="#211B13"/><stop offset="1" stopColor={C.black}/></radialGradient>
   <linearGradient id="verve-edge"><stop stopColor={C.gold} stopOpacity="0"/><stop offset=".5" stopColor={C.gold} stopOpacity=".7"/><stop offset="1" stopColor={C.gold} stopOpacity="0"/></linearGradient>
   <linearGradient id="verve-detail-mask"><stop stopColor="white"/><stop offset=".76" stopColor="white"/><stop offset="1" stopColor="black"/></linearGradient>
   <mask id="verve-photo-fade"><rect width={1220} height={1080} fill="url(#verve-detail-mask)"/></mask>
   <linearGradient id="verve-sweep"><stop stopColor="white" stopOpacity="0"/><stop offset=".5" stopColor="#FFE7AF" stopOpacity=".16"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
   <pattern id="verve-grain" width={13} height={17} patternUnits="userSpaceOnUse"><circle cx={2} cy={4} r={.5} fill="white" opacity={.055}/><circle cx={9} cy={12} r={.4} fill="white" opacity={.035}/></pattern>
   <clipPath id="verve-bottle-clip"><rect x={camera.x-bottleWidth/2} y={camera.y-bottleHeight/2} width={bottleWidth} height={bottleHeight}/></clipPath>
  </defs>
  <rect width={1920} height={1080} fill="url(#verve-bg)"/>
  <path d="M0 865H1920" stroke="url(#verve-edge)" opacity={.3*reveal}/>
  <g opacity={shot.detailOpacity}>
   <g mask="url(#verve-photo-fade)">
    <image href={asset('detail-photo.png')} x={mix(-130,-65,shot.detailPan)} y={mix(-175,-50,shot.detailPan)} width={1320} height={1320} preserveAspectRatio="xMidYMid meet"/>
    <rect width={1220} height={1080} fill={C.black} opacity={.14}/>
   </g>
  </g>
  <g opacity={shot.packageOpacity}>
   <image data-product="authentic-packaging" href={asset('box-cutout.png')} x={1370+65*(1-shot.packageOpacity)} y={390} width={310} height={461} preserveAspectRatio="xMidYMid meet"/>
  </g>
  <ellipse cx={camera.x} cy={930} rx={270} ry={25} fill="black" opacity={.6*shot.bottleOpacity*reveal}/>
  <g opacity={shot.bottleOpacity}>
   <g transform={`rotate(${camera.rotation} ${camera.x} ${camera.y})`}>
    <image data-product="front-photo" href={asset('bottle-front.png')} x={camera.x-bottleWidth/2} y={camera.y-bottleHeight/2} width={bottleWidth} height={bottleHeight} preserveAspectRatio="xMidYMid meet" style={{filter:`brightness(${mix(.12,1,shot.light)})`}}/>
    <g clipPath="url(#verve-bottle-clip)" opacity={(1-progress(t,2.5,3.1))*.8} style={{mixBlendMode:'screen'}}><rect x={mix(-350,1700,progress(t,.1,2.5))} y={0} width={220} height={1080} fill="url(#verve-sweep)" transform="skewX(-12)"/></g>
   </g>
  </g>
  <g opacity={1-progress(t,2.7,3.2)}>
   <Caption x={130} y={155} size={25} opacity={progress(t,.15,.8)}>MYKONOS</Caption>
   <Caption x={130} y={886} size={22} fill={C.gold} opacity={progress(t,.7,1.5)}>SEBUAH KESAN.</Caption>
   <Caption x={130} y={929} size={22} opacity={progress(t,1.35,2)}>DIMULAI DARI DETAIL.</Caption>
  </g>
  <g opacity={titleOpacity}>
   <Caption x={139} y={275} size={30} spacing={7}>MYKONOS</Caption>
   <MaskLine t={t} start={3.25} x={125} y={340} width={820} height={205}><text data-type="headline" x={0} y={166} fill={C.ivory} fontFamily={serif} fontSize={185} letterSpacing={7}>VERVE</text></MaskLine>
   <path d={`M139 596H${139+505*progress(t,3.7,4.7)}`} stroke={C.gold} strokeWidth={1.5}/>
   <Caption x={139} y={653} size={25} spacing={4}>EXTRAIT DE PARFUM</Caption>
   <Caption x={139} y={705} size={23} fill={C.gold}>50 ML</Caption>
   <Caption x={139} y={884} size={20} fill={C.muted} spacing={3}>HADIR. TANPA BANYAK KATA.</Caption>
  </g>
  <g opacity={shot.detailOpacity}>
   <Caption x={1260} y={238} size={22} fill={C.gold}>THE DETAILS</Caption>
   <g opacity={detailIntro*(1-progress(t,9.05,9.35))}>
    <text x={1250} y={407} fill={C.ivory} fontFamily={serif} fontSize={81}>Siluet hitam.</text>
    <Caption x={1260} y={474} size={21} fill={C.muted} spacing={2}>BENTUK YANG TEGAS.</Caption>
    <path d="M1260 550H1640" stroke={C.gold} strokeWidth={1}/>
    <Caption x={1260} y={605} size={24}>01 / BENTUK</Caption>
   </g>
   <g opacity={detailTwo*(1-progress(t,10.15,10.45))}>
    <text x={1250} y={407} fill={C.ivory} fontFamily={serif} fontSize={81}>Aksen emas.</text>
    <Caption x={1260} y={474} size={21} fill={C.muted} spacing={2}>TUTUP DAN LABEL VERVE.</Caption>
    <path d="M1260 550H1640" stroke={C.gold} strokeWidth={1}/>
    <Caption x={1260} y={605} size={24}>02 / KONTRAS</Caption>
   </g>
   <g opacity={detailThree}>
    <text x={1250} y={407} fill={C.ivory} fontFamily={serif} fontSize={81}>Verve.</text>
    <Caption x={1260} y={474} size={21} fill={C.muted} spacing={2}>EXTRAIT DE PARFUM · 50 ML</Caption>
    <path d="M1260 550H1640" stroke={C.gold} strokeWidth={1}/>
    <Caption x={1260} y={605} size={24}>03 / IDENTITAS</Caption>
   </g>
  </g>
  <g opacity={shot.hero*(1-progress(t,16.45,16.85))}>
   <Caption x={145} y={243} size={28} spacing={7}>MYKONOS</Caption>
   <MaskLine t={t} start={12.25} x={132} y={330} width={850} height={170}><text x={0} y={137} fill={C.ivory} fontFamily={serif} fontSize={142}>Hadir.</text></MaskLine>
   <MaskLine t={t} start={12.65} x={138} y={510} width={850} height={190}><text x={0} y={70} fill={C.ivory} fontFamily={serif} fontSize={77}>Tanpa banyak</text><text x={0} y={157} fill={C.ivory} fontFamily={serif} fontSize={77}>kata.</text></MaskLine>
   <Caption x={145} y={806} size={24} fill={C.gold}>VERVE / 50 ML</Caption>
  </g>
  <g opacity={progress(t,16.95,17.6)}>
   <Caption x={145} y={246} size={29} spacing={7}>MYKONOS</Caption>
   <text data-type="headline" x={131} y={458} fontFamily={serif} fontSize={176} fill={C.ivory} letterSpacing={6}>VERVE</text>
   <Caption x={145} y={540} size={24} spacing={3}>EXTRAIT DE PARFUM · 50 ML</Caption>
   <text x={141} y={635} fill={C.gold} fontFamily={serif} fontSize={49}>Hadir. Tanpa banyak kata.</text>
   <path d="M145 704H694" stroke={C.gold} strokeWidth={1} opacity={.5}/>
   <Caption x={145} y={780} size={26} spacing={1}>TEMUKAN DI SHOPEE</Caption>
   <path d="M647 772H692M681 762L693 772L681 782" fill="none" stroke={C.gold} strokeWidth={2}/>
   <Caption x={145} y={953} size={18} fill={C.muted} spacing={2}>PRODUCT IN MOTION / VERVE</Caption>
  </g>
  <rect width={1920} height={1080} fill="url(#verve-grain)" pointerEvents="none"/>
 </svg>
 </div>;
};
export const VerveCommercial:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 return <AbsoluteFill><VerveFilm time={frame/fps}/><Audio src={staticFile('product-commercial/verve/soundtrack.wav')}/></AbsoluteFill>;
};
