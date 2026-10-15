import React from 'react';
import {clamp, hash, springValue} from './motion.mjs';
import '@fontsource/anton/latin-400.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/inter/latin-900.css';
import './style.css';

export const C = {navy:'#141235', navy2:'#23205A', out:'#17132E', cream:'#F7EEDB', yellow:'#FFD21F', red:'#FF3B30', redDark:'#B81F2A', skin:'#EDB08A', skin2:'#C98463'};
export const S = springValue;
export const svgStyle: React.CSSProperties = {position:'absolute', width:1080, height:1920, overflow:'visible'};

export function Moon({x=0,y=0,size=70,color=C.yellow}: {x?:number;y?:number;size?:number;color?:string}) {
  return <g transform={`translate(${x} ${y}) scale(${size/100})`}><path d="M77 11A44 44 0 1 0 89 75 43 43 0 0 1 77 11Z" fill={color} stroke={C.out} strokeWidth="5" strokeLinejoin="round"/><path d="m107 12 3 11 11 3-11 3-3 11-3-11-11-3 11-3Z" fill={color}/></g>;
}

export function Background({t,kind='navy',burst=false}: {t:number;kind?:'navy'|'cream'|'yellow';burst?:boolean}) {
  const base = kind === 'cream' ? C.cream : kind === 'yellow' ? C.yellow : C.navy;
  return <svg viewBox="0 0 1080 1920" style={svgStyle}>
    <defs>
      <pattern id={`dots-${kind}`} width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.6" fill={kind==='cream'?C.navy:C.cream}/></pattern>
      <radialGradient id={`lamp-${kind}`} cx="20%" cy="20%" r="90%"><stop stopColor={kind==='navy'?C.navy2:'#FFF8E8'}/><stop offset="1" stopColor={base}/></radialGradient>
    </defs>
    <rect width="1080" height="1920" fill={base}/>
    {!burst && <><rect width="1080" height="1920" fill={`url(#lamp-${kind})`}/><path d="M0 740 1080 310V1180L0 1530Z" fill={kind==='cream'?'#EADFC8':C.navy2} opacity=".3"/>
      <path d="M-40 1640 1130 1340M-40 1720 1130 1420M-40 1800 1130 1500" fill="none" stroke={kind==='cream'?'#D7CCB6':'#343064'} strokeWidth="2"/>
      <rect x="-80" y="830" width="360" height="900" fill={`url(#dots-${kind})`} opacity={kind==='cream'?'.09':'.13'} transform="rotate(-12 0 1000)"/>
      <rect x="850" y="140" width="230" height="690" fill={`url(#dots-${kind})`} opacity=".09"/></>}
    {burst && <g transform={`translate(540 1080) rotate(${t*1.5})`}>
      {Array.from({length:32},(_,i)=>{const a=i*Math.PI/16; const b=a+.035+(i%3)*.011; return <path key={i} d={`M${Math.cos(a)*200} ${Math.sin(a)*200}L${Math.cos(a)*2300} ${Math.sin(a)*2300}L${Math.cos(b)*2300} ${Math.sin(b)*2300}Z`} fill={kind==='yellow'?C.red:C.navy2} opacity={i%2?'.55':'.9'}/>;})}
      {Array.from({length:25},(_,i)=>{const a=i*6.283/25;return <path key={i} d={`M${Math.cos(a)*540} ${Math.sin(a)*540}L${Math.cos(a+.01)*1800} ${Math.sin(a+.01)*1800}`} stroke={kind==='yellow'?C.out:C.cream} opacity=".17" strokeWidth={i%3+2}/>;})}
    </g>}
    <rect x="835" y="1410" width="245" height="510" fill={`url(#dots-${kind})`} opacity=".13"/>
  </svg>;
}

export function Kicker({children, light=false}: {children:React.ReactNode;light?:boolean}) {
  return <div className="no-kicker" style={{color:light?C.out:C.cream}}><i style={{background:light?C.out:C.yellow}}/>{children}</div>;
}

export function Headline({lines,t,start=0,y=310,size=160,color=C.yellow,extrude=true,align='left',x=88,width=900,heavy=false}: {lines:string[];t:number;start?:number;y?:number;size?:number;color?:string;extrude?:boolean;align?:'left'|'center';x?:number;width?:number;heavy?:boolean}) {
  return <div className="no-headline" data-primary="true" style={{left:x,top:y,width,textAlign:align,fontSize:size,color}}>
    {lines.map((line,i)=>{const p = S(t-start-i*.085,heavy?100:170,heavy?16:28);return <div key={line} className="no-mask" style={{paddingBottom:extrude?25:6,marginBottom:extrude?-18:0}}><div style={{opacity:t>=start+i*.085?1:0,transform:`translateY(${(1-p)*125}%) scaleY(${heavy?1+(1-p)*.45:1})`,textShadow:extrude?Array.from({length:16},(_,j)=>`${j+1}px ${j+1}px 0 ${C.redDark}`).join(','):undefined}}>{line}</div></div>;})}
  </div>;
}

export function Notification({text='Ada pesan baru!',sub='GRUP KANTOR',x,y,w=430,t,start=0,rotate=0,scale=1,count,red=false}: {text?:string;sub?:string;x:number;y:number;w?:number;t:number;start?:number;rotate?:number;scale?:number;count?:string;red?:boolean}) {
  const p=S(t-start,350,22);
  return <g opacity={t<start?0:1} transform={`translate(${x} ${y}) rotate(${rotate}) scale(${Math.max(0,p)*scale})`}>
    <rect x="9" y="13" width={w} height="117" rx="17" fill={red?C.red:C.redDark} stroke={C.out} strokeWidth="5"/>
    <rect width={w} height="117" rx="17" fill={C.cream} stroke={C.out} strokeWidth="5"/>
    <rect x="16" y="20" width="66" height="66" rx="16" fill={red?C.red:C.yellow} stroke={C.out} strokeWidth="3"/>
    <path d="M32 39H66V61H51L40 70V61H32Z" fill={C.out}/>
    <text x="99" y="34" fontFamily="Inter" fontWeight="800" fontSize="16" letterSpacing="1.5" fill={C.redDark}>{sub}</text>
    <text x="99" y="75" fontFamily="Inter" fontWeight="900" fontSize={text.length>20?24:28} fill={C.out}>{text}</text>
    {count && <g transform={`translate(${w-28} -18)`}><circle r="36" fill={C.red} stroke={C.out} strokeWidth="4"/><text y="10" textAnchor="middle" fill={C.cream} fontFamily="Inter" fontSize="26" fontWeight="900">{count}</text></g>}
  </g>;
}

export function Phone({x,y,scale=1,rotate=-8,t=0,mode='messages',active=false,stress=0}: {x:number;y:number;scale?:number;rotate?:number;t?:number;mode?:'messages'|'settings';active?:boolean;stress?:number}) {
  const v = stress*Math.sin(t*101);
  const tog=S(t-.85,250,25);
  return <g transform={`translate(${x+v} ${y}) rotate(${rotate+v*.18} 200 380) scale(${scale})`}>
    <rect x="22" y="22" width="400" height="760" rx="62" fill={C.yellow} stroke={C.out} strokeWidth="7"/>
    <rect width="400" height="760" rx="62" fill={C.out} stroke={C.out} strokeWidth="10"/>
    <rect x="12" y="12" width="376" height="736" rx="52" fill={C.navy2} stroke="#62577D" strokeWidth="4"/>
    <rect x="28" y="29" width="344" height="700" rx="39" fill={mode==='settings'?C.cream:'#E8DDC8'}/>
    <rect x="134" y="34" width="132" height="25" rx="13" fill={C.out}/>
    <text x="53" y="92" fill={C.out} fontFamily="Inter" fontWeight="900" fontSize="19">09:41</text>
    <path d="M307 77V88M316 73V88M325 69V88" stroke={C.out} strokeWidth="5"/>
    <rect x="339" y="72" width="17" height="14" rx="3" fill={C.out}/>
    {mode==='messages' ? <>
      <text x="53" y="163" fill={C.out} fontFamily="Anton" fontSize="52">HARI INI.</text>
      <text x="54" y="195" fill="#6D6375" fontFamily="Inter" fontWeight="800" fontSize="17">JADWAL SANTAI? MUNGKIN.</text>
      {[0,1,2,3].map(i=><g key={i} opacity={t>.15+i*.28?1:0} transform={`translate(47 ${235+i*102}) scale(${clamp(S(t-.15-i*.28,350,22),0,1.1)})`}>
        <rect x="5" y="7" width="306" height="83" rx="12" fill="#BEB2A3"/>
        <rect width="306" height="83" rx="12" fill={i===3?C.yellow:'#FFF8E9'} stroke={C.out} strokeWidth="2.5"/>
        <circle cx="30" cy="29" r="12" fill={i%2?C.red:C.navy2}/>
        <text x="53" y="32" fill={C.out} fontFamily="Inter" fontWeight="900" fontSize="17">{['TIM KREATIF','GRUP KANTOR','PROJECT BARU','SEMUA GRUP'][i]}</text>
        <text x="18" y="63" fill={C.out} fontFamily="Inter" fontWeight="800" fontSize="18">{['Ada pesan baru!','Meeting dimulai!','Deadline hari ini!','99+ notifikasi'][i]}</text>
      </g>)}
    </> : <>
      <text x="53" y="157" fill={C.out} fontFamily="Inter" fontWeight="900" fontSize="20">PENGATURAN FOKUS</text>
      <circle cx="200" cy="281" r="73" fill={active?C.yellow:'#D9CEB7'} stroke={C.out} strokeWidth="3"/>
      <Moon x={158} y={239} size={77} color={active?C.navy:C.cream}/>
      <text x="200" y="400" textAnchor="middle" fill={C.out} fontFamily="Anton" fontSize="36">JANGAN GANGGU</text>
      <text x="200" y="437" textAnchor="middle" fill="#6D6375" fontFamily="Inter" fontSize="17" fontWeight="800">Waktunya ambil jeda.</text>
      <rect x="57" y="477" width="286" height="102" rx="19" fill="#E3D8C0" stroke={C.out} strokeWidth="3"/>
      <text x="77" y="519" fill={C.out} fontFamily="Inter" fontWeight="900" fontSize="18">Mode hening</text>
      <text x="77" y="549" fill="#6D6375" fontFamily="Inter" fontWeight="800" fontSize="15">{active?'AKTIF':'NONAKTIF'}</text>
      <rect x="238" y="504" width="86" height="43" rx="22" fill={active?C.yellow:'#AA9E97'} stroke={C.out} strokeWidth="3"/>
      <circle cx={260+clamp(tog)*42} cy="525.5" r="16" fill={C.cream} stroke={C.out} strokeWidth="2.5"/>
      <text x="200" y="640" textAnchor="middle" fill={C.out} fontFamily="Inter" fontSize="16" fontWeight="800">{active?'Notifikasi bisa menunggu.':'Satu sentuhan untuk tenang.'}</text>
    </>}
    <path d="M161 704H240" stroke={C.out} strokeWidth="6" strokeLinecap="round"/>
    <path d="M37 622V93Q37 43 80 43" stroke="white" strokeOpacity=".28" fill="none" strokeWidth="6"/>
    <path d="M-7 160V244M407 190V292" stroke={C.out} strokeWidth="12" strokeLinecap="round"/>
  </g>;
}

export function Worker({x=100,y=650,scale=1,t=0,mood='relaxed',reach=false}: {x?:number;y?:number;scale?:number;t?:number;mood?:'relaxed'|'worried'|'panic'|'breakdown';reach?:boolean}) {
  const panic=mood==='panic'||mood==='breakdown', breakdown=mood==='breakdown';
  const breath=Math.sin(t*3)*3;
  const tilt=panic?Math.sin(t*6)*3:mood==='worried'?-5:-3;
  const blink = !panic && ((t%3.7)>3.53);
  return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={C.out} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx="423" cy="820" rx="310" ry="46" fill={C.out} opacity=".17" stroke="none"/>
    <path d="M231 362Q209 320 250 300L605 320Q649 330 642 390L612 676H231Z" fill="#494174"/>
    <path d="M252 355 580 357 565 659H251Z" fill={C.navy2} strokeWidth="4"/>
    <path d="M389 665V806M310 812H500" fill="none" strokeWidth="15"/>
    <path d="M276 593 568 590 545 773 428 777 406 670 380 781 255 771Z" fill={C.navy2}/>
    <path d="M277 754 370 754 382 811 236 811Q230 783 277 781ZM439 754 533 754 577 798Q583 818 554 818H437Z" fill={C.cream}/>
    <path d="M242 802H379M439 807H569" strokeWidth="5"/>
    <g transform={`translate(0 ${breath})`}>
      <path d="M325 310Q293 315 272 340L211 505 271 548 297 489 286 625Q414 651 574 623L554 468 600 525 658 483 596 344Q580 319 526 310Z" fill="#E7A617"/>
      <path d="M473 320 526 310Q582 318 596 344L658 483 600 525 554 468 574 623 517 634Z" fill="#B77722" stroke="none"/>
      <path d="M325 310 360 295 490 295 525 312 487 618H355Z" fill={C.cream}/>
      <path d="M348 321 327 391 353 413 329 441 337 626M506 321 529 390 504 413 526 441 505 631" fill="none" strokeWidth="5"/>
      <path d="M360 299 414 431 490 299" fill="none" stroke={C.navy2} strokeWidth="11"/>
      <rect x="391" y="425" width="60" height="82" rx="8" fill={C.cream} strokeWidth="4" transform="rotate(8 420 460)"/>
      <circle cx="418" cy="452" r="10" fill={C.red} stroke="none"/><path d="M405 477H436M406 486H429" strokeWidth="3"/>
      <path d="M374 242V315Q426 350 477 309L469 241Z" fill={C.skin}/>
      <path d="M375 245 468 246 474 282Q422 304 375 279Z" fill={C.skin2} stroke="none"/>
      <g transform={`rotate(${tilt} 420 200)`}>
        <ellipse cx="322" cy="188" rx="28" ry="39" fill={C.skin}/><ellipse cx="516" cy="188" rx="28" ry="39" fill={C.skin2}/>
        <path d="M324 111Q325 49 421 48 515 52 517 122L508 225Q500 283 425 291 348 283 333 233Z" fill={C.skin}/>
        <path d="M478 91 517 122 508 225Q500 283 425 291L415 271Q476 257 480 211Z" fill={C.skin2} stroke="none"/>
        <path d="M329 164 305 122 319 113 306 89 341 84Q332 35 399 31L396 13 432 34Q505 20 535 76L526 151 504 172 489 110Q433 141 365 102L350 162Z" fill={C.navy}/>
        <path d="M343 78Q396 42 475 66M366 91Q411 74 444 83" fill="none" stroke="#393257" strokeWidth="6"/>
        <path d={panic?'M350 146 389 132M447 132 488 145':mood==='worried'?'M348 145 390 148M446 144 486 132':'M351 148 389 146M448 145 484 148'} fill="none" strokeWidth="9"/>
        <rect x="341" y="158" width="66" height={panic?65:52} rx="16" fill={C.cream} strokeWidth="7"/>
        <rect x="438" y="158" width="66" height={panic?65:52} rx="16" fill={C.cream} strokeWidth="7"/>
        <path d="M408 175Q423 165 437 175M328 170H340M506 169H517" fill="none"/>
        {blink?<path d="M357 185H389M453 185H485" strokeWidth="5"/>: <><ellipse cx={panic?376:381} cy={panic?186:185} rx={panic?8:7} ry={panic?19:11} fill={C.out}/><ellipse cx={panic?468:479} cy={panic?186:185} rx={panic?8:7} ry={panic?19:11} fill={C.out}/></>}
        <path d="M422 185 413 219 431 221" fill="none" strokeWidth="4"/>
        {panic?<><path d="M397 249Q420 218 448 248L442 270H405Z" fill={C.out} strokeWidth="4"/><path d="M408 258H438" stroke={C.red} strokeWidth="7"/></>:<path d={mood==='worried'?'M399 250Q422 231 444 244':'M397 242Q421 264 449 240'} fill="none" strokeWidth="5"/>}
        {panic && <path d="M545 168Q578 205 549 214 529 210 545 168Z" fill="#D3E2DE" strokeWidth="4"/>}
        <path d="M353 226 371 230M476 229 491 223" stroke={C.redDark} strokeWidth="3" opacity=".5"/>
      </g>
      {breakdown ? <>
        <path d="M236 484Q168 374 257 239L299 249Q237 373 287 432Z" fill={C.skin}/>
        <path d="M257 241 285 169Q293 150 303 166L297 208 316 168Q326 151 334 168L320 221 339 188Q351 175 358 190L336 246 292 270Z" fill={C.skin}/>
        <path d="M634 481Q704 354 584 230L544 254Q626 356 590 431Z" fill={C.skin}/>
        <path d="M584 232 554 171Q543 153 534 169L542 207 519 170Q510 156 501 173L519 222 499 195Q486 183 481 199L506 250 551 272Z" fill={C.skin}/>
      </> : <>
        <path d="M217 494Q195 543 254 567L373 568 387 524 284 518 273 489Z" fill={C.skin}/>
        <path d="M370 525 403 510Q430 501 437 516L451 536Q455 548 440 552L397 568 371 568Z" fill={C.skin}/>
        <g transform={reach?'translate(-74 55) rotate(18 635 520)':''}>
          <path d="M599 497 646 482Q682 526 641 558L578 547 578 509Z" fill={C.skin}/>
          <path d="M578 511 607 489Q621 475 632 485L625 507 651 494Q666 491 668 505L660 525 637 547 579 546Z" fill={C.skin}/>
          <path d="M629 512 650 505M626 528 647 520" fill="none" strokeWidth="3"/>
        </g>
      </>}
      <path d="M227 478 281 502M596 490 643 473" stroke="#FFE16C" strokeWidth="6"/>
    </g>
  </g>;
}

export function Desk({light=false}: {light?:boolean}) {
  return <g stroke={C.out} strokeWidth="7" strokeLinejoin="round">
    <path d="M76 1350 898 1327 1025 1431 151 1466Z" fill={light?'#DDD0B4':'#65567C'}/>
    <path d="M151 1466 1025 1431V1473L151 1512Z" fill={light?'#B5A68F':'#352B50'}/>
    <path d="M175 1508V1770M942 1480V1725" fill="none" strokeWidth="24"/>
    <path d="M104 1350 900 1332" stroke={light?C.cream:'#9C87A6'} strokeWidth="7"/>
    <path d="M258 1368 489 1358 530 1393 298 1408Z" fill={C.cream} strokeWidth="3"/>
    <path d="M300 1375 436 1369M320 1387 472 1379" strokeWidth="3" opacity=".3"/>
    <path d="M822 1264H880L870 1349Q844 1362 827 1349Z" fill={C.yellow} strokeWidth="5"/>
    <path d="M880 1276Q917 1276 901 1308L876 1317" fill="none" strokeWidth="5"/>
    <path d="M836 1246Q818 1228 839 1210M858 1240Q843 1225 861 1206" fill="none" strokeWidth="4" opacity=".3"/>
  </g>;
}

export function Grain({t,quiet=false}: {t:number;quiet?:boolean}) {
  return <svg viewBox="0 0 1080 1920" style={{...svgStyle,pointerEvents:'none',mixBlendMode:'soft-light',opacity:quiet?.09:.18}}><defs><pattern id="grain" width="128" height="128" patternUnits="userSpaceOnUse" patternTransform={`translate(${Math.floor(hash(Math.floor(t*15))*120)} ${Math.floor(hash(Math.floor(t*15)+9)*120)})`}>{Array.from({length:160},(_,i)=><rect key={i} x={hash(i)*128} y={hash(i+300)*128} width={1+hash(i+400)*2} height="2" fill={i%2?'#fff':'#000'}/>)}</pattern></defs><rect width="1080" height="1920" fill="url(#grain)"/></svg>;
}
