import React from 'react';
import {AbsoluteFill, Audio, Img, Series, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const green = '#17392d';
const cream = '#f4efdf';
const serif = 'Georgia, Times New Roman, serif';
const ease = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Text: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark}) => {
 const f = useCurrentFrame();
 const {fps} = useVideoConfig();
 return <div style={{opacity: interpolate(f,[0,.18*fps],[0,1],ease), translate: `0 ${interpolate(f,[0,.38*fps],[32,0],ease)}px`, color: dark ? green : cream}}>{children}</div>;
};
const Photo: React.FC<{src: string; title: React.ReactNode; index: string}> = ({src,title,index}) => {
 const f=useCurrentFrame();
 const {fps} = useVideoConfig();
 return <AbsoluteFill style={{background:green}}>
 <Img src={staticFile(src)} style={{position:'absolute',left:680,top:0,width:1240,height:'100%',objectFit:'cover',objectPosition:'right center',scale:interpolate(f,[0,1.5*fps],[1.06,1.13],ease),translate:`${interpolate(f,[0,1.5*fps],[12,-12],ease)}px 0`}} />
 <AbsoluteFill style={{background:'linear-gradient(90deg,#102a20 0%,#102a20 35%,rgba(16,42,32,.92) 43%,rgba(16,42,32,.25) 66%,transparent 100%)'}} />
 <div style={{position:'absolute',left:120,top:110,fontSize:23,letterSpacing:6,color:cream}}>LUMORA / CERITA USAHA</div>
 <div style={{position:'absolute',left:120,top:355,width:660,fontFamily:serif,fontSize:92,lineHeight:1.12,letterSpacing:-2,textShadow:'0 4px 22px #0005'}}><Text>{title}</Text></div>
 <div style={{position:'absolute',bottom:94,left:130,color:cream,fontSize:21,letterSpacing:4}}>{index} — DARI CERITA, JADI PELUANG.</div>
 </AbsoluteFill>;
};
const Laptop: React.FC<{profile?: boolean}> = ({profile}) => {
 const f=useCurrentFrame();
 const {fps} = useVideoConfig();
 return <div style={{position:'absolute',left:850,top:210,width:970,rotate:`${interpolate(f,[0,.65*fps],[-5,-2],ease)}deg`,translate:`0 ${interpolate(f,[0,.6*fps],[65,0],ease)}px`,opacity:interpolate(f,[0,.2*fps],[0,1],ease),scale:interpolate(f,[0,1.6*fps],[.95,1.02],ease)}}>
 <div style={{padding:'18px 18px 30px',background:'#202320',borderRadius:24,boxShadow:'0 55px 90px #17392d35'}}>
 <div style={{height:540,overflow:'hidden',background:'#fff',borderRadius:7}}><Img src={staticFile(profile?'lumora/profile.png':'lumora/homepage.png')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}} /></div>
 </div><div style={{height:24,background:'linear-gradient(#a9aba3,#d5d6cf)',margin:'0 -55px',borderRadius:'0 0 45px 45px'}}/>
 </div>;
};
const Product: React.FC<{label:string; title:React.ReactNode; subtitle:string; profile?:boolean}> = ({label,title,subtitle,profile}) => <AbsoluteFill style={{background:cream,color:green}}>
 <div style={{position:'absolute',width:800,height:800,right:-220,top:-250,borderRadius:'50%',background:'#c6cbb5',filter:'blur(90px)',opacity:.45}} />
 <div style={{position:'absolute',left:130,top:112,fontSize:23,letterSpacing:5}}>{label}</div>
 <div style={{position:'absolute',left:130,top:320,width:730}}><Text dark><div style={{fontFamily:serif,fontSize:94,lineHeight:1.04,letterSpacing:-3}}>{title}</div><div style={{fontSize:29,lineHeight:1.5,marginTop:36,maxWidth:590}}>{subtitle}</div></Text></div>
 <Laptop profile={profile}/><div style={{position:'absolute',left:130,bottom:96,fontSize:22,letterSpacing:3}}>CERITA BISNIS. PELUANG NYATA.</div>
 </AbsoluteFill>;
export const OpeningScene=()=> <Photo src="lumora/story.jpg" title={<>Setiap usaha<br/>punya cerita.</>} index="01"/>;
export const ChallengeScene=()=> <Photo src="lumora/planning.jpg" title={<>Tapi belum<br/>semua terlihat.</>} index="02"/>;
export const IntroScene=()=> <Product label="03 / KENALKAN" title={<>Kenalkan<br/><span style={{fontSize:115}}>LUMORA.</span></>} subtitle="Cerita usaha, hadir dalam profil digital."/>;
export const ProfileScene=()=> <Product label="04 / PROFIL DIGITAL" title={<>Cerita<br/>jadi profil.</>} subtitle="Perjalanan bisnis. Rencana pengembangan. Satu tempat." profile/>;
export const CollaborationScene=()=> <Product label="05 / PELUANG BARU" title={<>Temukan<br/>kolaborasi.</>} subtitle="Jelajahi bisnis. Temukan mitra yang sejalan."/>;
export const ClosingScene=()=> {
 const f=useCurrentFrame();
 const {fps} = useVideoConfig();
 return <AbsoluteFill style={{background:cream,color:green,alignItems:'center',justifyContent:'center'}}>
 <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 80% 0%,#c2c9ad80,transparent 55%),radial-gradient(ellipse at 0% 100%,#b9c1a460,transparent 45%)'}} />
 <div style={{textAlign:'center',opacity:interpolate(f,[0,.25*fps],[0,1],ease),scale:interpolate(f,[0,2.6*fps],[.94,1],ease)}}>
 <div style={{fontSize:29,letterSpacing:8,marginBottom:42}}>BISNIS LOKAL, PELUANG LEBIH BESAR.</div>
 <div style={{fontFamily:serif,fontSize:200,lineHeight:1,letterSpacing:-11}}>LUMORA<span style={{fontSize:130}}>.</span></div>
 <div style={{fontSize:30,letterSpacing:8,marginTop:26}}>Cerita Bisnis, Peluang Nyata.</div>
 <div style={{display:'inline-block',border:`2px solid ${green}`,borderRadius:50,padding:'20px 66px',fontSize:33,marginTop:76}}>lumora.bai01.my.id <span style={{marginLeft:30}}>↗</span></div>
 </div>
 <div style={{position:'absolute',bottom:98,left:190,right:190,display:'flex',justifyContent:'space-between',fontSize:25,borderTop:'1px solid #17392d30',paddingTop:36}}><span>01 — Profil bisnis</span><span>02 — Dukungan AI</span><span>03 — Peluang kolaborasi</span></div>
 </AbsoluteFill>;
};
export const LumoraLaunch=()=> {
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{fontFamily:'Arial, sans-serif',background:cream}}>
 <Audio src={staticFile('lumora/ambient.wav')} volume={.6}/>
 <Series>
 <Series.Sequence name="01 Cerita usaha" durationInFrames={1.5*fps} premountFor={fps}><OpeningScene/></Series.Sequence>
 <Series.Sequence name="02 Tantangan" durationInFrames={1.3*fps} premountFor={fps}><ChallengeScene/></Series.Sequence>
 <Series.Sequence name="03 Kenalkan LUMORA" durationInFrames={1.6*fps} premountFor={fps}><IntroScene/></Series.Sequence>
 <Series.Sequence name="04 Profil digital" durationInFrames={1.5*fps} premountFor={fps}><ProfileScene/></Series.Sequence>
 <Series.Sequence name="05 Kolaborasi" durationInFrames={1.5*fps} premountFor={fps}><CollaborationScene/></Series.Sequence>
 <Series.Sequence name="06 LUMORA" durationInFrames={2.6*fps} premountFor={fps}><ClosingScene/></Series.Sequence>
 </Series>
 </AbsoluteFill>;
};
