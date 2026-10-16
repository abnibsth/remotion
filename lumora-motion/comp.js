import {clamp,mix,S,ease,sceneAt,hash} from './lib/motion.js';
import {camera} from './lib/camera.js';
const A='assets/live-20261016/';
const img=(name,cls='',other='')=>`<img class="${cls}" src="${A+name}.png" alt="" ${other}>`;
const mask=(text,id='',cls='')=>`<div class="mask ${cls}"><span ${id?`id="${id}"`:''}>${text}</span></div>`;
const top=(n,dark=true)=>`<div class="topline">${img(dark?'logo-light':'logo-nav')}<span>${n}</span></div>`;
const bottom=(a,b='lumora.bai01.my.id')=>`<div class="bottomline"><span>${a}</span><span>${b}</span></div>`;
const chrome=url=>`<div class="chrome"><i></i><i></i><i></i><span class="address">${url}</span></div>`;
const browser=(id,cls,shot,url)=>`<div id="${id}" class="browser ${cls}">${chrome(url)}<div class="viewport">${img(shot)}</div></div>`;
const stage=document.querySelector('#stage');
stage.innerHTML=`
<section id="s0" class="scene dark"><div class="ambient"></div><div id="point" class="lightpoint"></div>
${img('logo-light','open-logo','id="opening-logo"')}
<div class="open-copy"><h1>${mask('SETIAP BISNIS','open-line1')}${mask('PUNYA CERITA.','open-line2','lime')}</h1></div>
<p id="opening-caption" class="opening-caption">Cerita yang tersusun. Potensi yang ditemukan.</p><div id="open-rule" class="hairline"></div>${bottom('DIGITAL PITCHING + BUSINESS DISCOVERY','LUMORA')}</section>
<section id="s1" class="scene dark"><div class="ambient"></div>${top('01 / KENALI LUMORA')}
${browser('intro-browser','intro-browser','landing','lumora.bai01.my.id')}
<div id="intro-caption" class="intro-caption">Bisnis nyata, solusi nyata. ↗</div>${bottom('Website LUMORA · tampilan asli')}</section>
<section id="s2" class="scene light">${top('02 / JELAJAHI BISNIS',false)}
<div class="discovery-copy"><div class="kicker">Business Discovery</div><h2 style="margin-top:30px">${mask('TEMUKAN','dis-line1')}${mask('BISNIS.','dis-line2')}</h2><h3 style="font-size:38px;letter-spacing:-1.4px;margin-top:22px" id="dis-sub">KENALI POTENSINYA.</h3><p class="lede muted" id="dis-lede">Jelajahi cerita, perjalanan,<br>dan kebutuhan UMKM.</p></div>
<div class="discovery-filters" id="filters">${['Semua','F&B','Retail','Jasa','Kreatif','Fashion'].map((t,i)=>`<span class="${i===0?'active':''}">${t}</span>`).join('')}</div>
${browser('discovery-browser','discovery-browser','discovery-full','lumora.bai01.my.id/explore')}
<div id="selected-label" class="tag selected-label">Contoh bisnis dari LUMORA</div>
<div id="cards-track" class="cards-track">${[0,1,2].map(i=>`<div id="card-${i}" class="business-card">${img('business-card-'+i)}</div>`).join('')}</div>
${bottom('Profil contoh / data ilustrasi · bukan klaim pelanggan terverifikasi')}</section>
<section id="s3" class="scene dark"><div class="ambient"></div>${top('03 / CERITA DI BALIK PROFIL')}
<div class="profile-copy"><div class="kicker lime">Profil Bisnis</div><h2 style="margin-top:30px">${mask('BUKAN SEKADAR','pro-line1')}${mask('PROFIL.','pro-line2','lime')}</h2><p class="lede" id="pro-lede">INI PERJALANAN BISNIS.</p></div>
<div class="profile-labels">${['Identitas & cerita usaha','Perjalanan & tonggak bisnis','Business Model Canvas'].map((t,i)=>`<div id="profile-feature-${i}"><b>0${i+1}</b>${t}</div>`).join('')}</div>
${browser('profile-browser','profile-browser','profile-full','lumora.bai01.my.id/business/aksara-lokal')}
<div id="timeline-panel" class="detail-panel">${img('profile-perjalanan')}</div>
<div id="bmc-panel" class="detail-panel">${img('profile-model-bisnis')}</div>
<div id="detail-title" class="detail-title">Aksara Lokal · Contoh profil</div>
${bottom('Profil & angka contoh dari website · data ilustrasi, bukan hasil terverifikasi')}</section>
<section id="s4" class="scene light">${top('04 / LUMORA AI',false)}
<div class="ai-copy"><div class="kicker">Asisten Bisnis</div><h2 style="margin-top:30px">${mask('CERITAKAN','ai-line1')}${mask('BISNISMU.','ai-line2')}</h2><h2 class="smallhead">${mask('BIARKAN AI MEMBANTU','ai-line3')}${mask('MENYUSUNNYA.','ai-line4')}</h2><p id="ai-lede" class="lede muted">Dari cerita sederhana<br>menjadi draf yang bisa kamu edit.</p></div>
<div id="ai-window" class="ai-window">${img('ai-interface')}<div class="chat-demo"><div id="user-msg" class="user-msg"><span id="typed"></span></div><div id="ai-msg-1" class="ai-msg">Mari susun draf profil dari cerita Aksara Lokal.</div><div id="ai-msg-2" class="ai-msg">Studio desain kemasan untuk produk pangan skala kecil, berbasis di Malang.</div></div></div>
<div id="draft" class="draft"><div class="draft-head"><span>Draf profil bisnis</span><span class="tag" style="font-size:15px;padding:6px 10px">Tinjau & edit</span></div><h3>Aksara Lokal</h3><p>Studio desain kemasan untuk produk pangan skala kecil.</p></div>
<p id="ai-note" class="ai-note">Ilustrasi percakapan · AI membantu menyusun, pemilik tetap meninjau.</p>${bottom('Antarmuka asli LUMORA · isi percakapan disimulasikan')}</section>
<section id="s5" class="scene dark"><div class="ambient"></div>${top('05 / BUKA PERCAKAPAN')}
<div class="connect-copy"><h2>${mask('SATU PLATFORM.','con-line1')}${mask('LEBIH BANYAK PELUANG.','con-line2','lime')}</h2></div>
<div id="role-left" class="role-label left">Pemilik UMKM</div><div id="role-right" class="role-label right">Calon Mitra</div>
${browser('con-left','connect-browser left','profile','lumora.bai01.my.id/business/aksara-lokal')}
${browser('con-right','connect-browser right','discovery-full','lumora.bai01.my.id/explore')}
<div id="connection" class="link-line"></div><div id="connection-dot" class="link-dot">↔</div><p id="connect-note" class="connect-note">Kenali bisnisnya. Mulai percakapannya.</p>${bottom('Ilustrasi peluang terhubung · bukan jaminan kemitraan atau pendanaan')}</section>
<section id="s6" class="scene light"><div class="ambient" style="border-color:#123f3210"></div>
${img('logo-nav','final-logo','id="final-logo"')}
<div class="final-copy"><h2>${mask('SETIAP BISNIS PUNYA CERITA.','final-line')}</h2><p id="final-sub">Temukan peluang untuk tumbuh bersama.</p></div>
<div id="final-url" class="url-pill">lumora.bai01.my.id <span>↗</span></div><div id="final-rule" class="final-rule"></div>${bottom('DIGITAL PITCHING + BUSINESS DISCOVERY','LUMORA')}</section>
<div id="grain"></div><div id="wipe"></div><div id="wipe2"></div>`;
const $=id=>document.getElementById(id);
const op=(id,v)=>$(id).style.opacity=clamp(v);
const rise=(id,t,delay=0,type='text',distance=125)=>{const p=S(t-delay,type);$(id).style.transform=`translateY(${(1-p)*distance}%)`;op(id,t>=delay?ease((t-delay)*2):0);};
const enter=(id,t,{delay=0,x=0,y=60,scale=.98,type='browser',ry=0,rx=0,rz=0}={})=>{const p=S(t-delay,type);camera($(id),{x:x*(1-p),y:y*(1-p),scale:mix(scale,1,p),ry:ry*(1-p),rx:rx*(1-p),rz:rz*(1-p)});op(id,t>=delay?ease((t-delay)*2):0);};
const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d');const data=ctx.createImageData(128,128);for(let i=0;i<data.data.length;i+=4){const n=Math.floor(hash(i)*255);data.data.set([n,n,n,255],i);}ctx.putImageData(data,0,0);$('grain').style.backgroundImage=`url(${canvas.toDataURL()})`;
function opening(t){
 const p=S(t-.15,'browser');op('point',(1-ease(t-.8))*ease(t*3));
 op('opening-logo',p);$('opening-logo').style.clipPath=`inset(0 ${(1-clamp(p))*100}% 0 0)`;
 camera($('opening-logo'),{y:mix(60,0,p),scale:mix(1.12,.92,clamp(t/4))});
 rise('open-line1',t,.6);rise('open-line2',t,.97);
 enter('opening-caption',t,{delay:1.6,y:24,type:'text'});op('open-rule',ease(t-1.65));camera($('open-rule'),{scale:ease(t-1.65)});
 $('s0').querySelector('.open-copy').style.transform='none';
}
function introduction(t){
 const p=S(t,'browser');op('intro-browser',ease(t*2));
 camera($('intro-browser'),{x:mix(620,-20,p),y:mix(80,-5,p),scale:mix(.78,1,p)+clamp(t/4)*.015,ry:mix(-17,0,p),rx:mix(5,0,p)});
 enter('intro-caption',t,{delay:1.3,y:28,type:'small'});
}
function discovery(t){
 rise('dis-line1',t,.05);rise('dis-line2',t,.15);
 enter('dis-sub',t,{delay:.55,y:25,type:'text'});enter('dis-lede',t,{delay:.75,y:25,type:'text'});
 enter('filters',t,{delay:.85,y:15,type:'small'});enter('discovery-browser',t,{delay:0,x:300,y:30,ry:-8});
 op('discovery-browser',ease(t*2)*(1-.75*ease(t-.55)));
 enter('selected-label',t,{delay:.6,y:15,type:'small'});
 camera($('cards-track'),{x:-54*clamp((t-1)/3),y:-8*clamp(t/5),scale:1+clamp((t-3.5)/1.5)*.04});
 for(let i=0;i<3;i++){
  const p=S(t-.35-i*.18,'card'),sel=ease(t-3.3);
  camera($('card-'+i),{x:(1-p)*120+(i?sel*45:0),y:(1-p)*220+(i?sel*50:-sel*18),scale:1+(i?-.055*sel:.045*sel),ry:(1-p)*-10});
  op('card-'+i,t>=.35+i*.18?ease((t-.35-i*.18)*2)*(i?1-.55*sel:1):0);
 }
}
function profile(t){
 rise('pro-line1',t,.05);rise('pro-line2',t,.17);enter('pro-lede',t,{delay:.6,y:25,type:'text'});
 for(let i=0;i<3;i++)enter('profile-feature-'+i,t,{delay:.7+i*.25,x:-30,y:0,type:'small'});
 const p=S(t,'browser');camera($('profile-browser'),{x:(1-p)*180,y:(1-p)*50,scale:mix(.9,1,p),ry:mix(-8,0,p)});op('profile-browser',ease(t*2));
 $('profile-browser').querySelector('.viewport>img').style.transform=`translateY(${-mix(0,1160,ease((t-.9)*.55))}px)`;
 const q=S(t-1.25,'card');camera($('timeline-panel'),{x:(1-q)*110,y:(1-q)*130,scale:mix(.94,1,q)});
 op('timeline-panel',ease((t-1.25)*2)*(1-ease((t-3.35)*2)));
 const b=S(t-3.25,'card');camera($('bmc-panel'),{x:(1-b)*110,y:(1-b)*150,scale:mix(.94,1,b)});op('bmc-panel',ease((t-3.25)*2));
 enter('detail-title',t,{delay:1.1,y:20,type:'small'});
}
function ai(t){
 ['ai-line1','ai-line2','ai-line3','ai-line4'].forEach((id,i)=>rise(id,t,.05+i*.14));
 enter('ai-lede',t,{delay:.8,y:20,type:'text'});enter('ai-window',t,{delay:0,x:180,y:40,ry:-7});
 const message='Saya menjalankan Aksara Lokal, studio desain kemasan di Malang. Bantu susun profil bisnis saya.';
 $('typed').textContent=message.slice(0,Math.floor(clamp((t-.65)/1.35)*message.length));
 enter('user-msg',t,{delay:.65,y:18,type:'small'});enter('ai-msg-1',t,{delay:2.15,y:22,type:'small'});enter('ai-msg-2',t,{delay:2.65,y:22,type:'small'});
 enter('draft',t,{delay:3.0,x:90,y:24,scale:.96,type:'card'});enter('ai-note',t,{delay:.4,y:12,type:'small'});
}
function connection(t){
 rise('con-line1',t,0);rise('con-line2',t,.18);
 const p=S(t-.15,'browser'),converge=ease((t-2.6)*.7);
 camera($('con-left'),{x:-(1-p)*380+converge*8,y:(1-p)*65,ry:(1-p)*9,scale:mix(.94,1,p)});
 camera($('con-right'),{x:(1-p)*380-converge*8,y:(1-p)*65,ry:-(1-p)*9,scale:mix(.94,1,p)});
 op('con-left',ease((t-.15)*2));op('con-right',ease((t-.25)*2));
 enter('role-left',t,{delay:.65,y:15,type:'text'});enter('role-right',t,{delay:.75,y:15,type:'text'});
 $('connection').style.transform=`scaleX(${ease(t-1.05)})`;op('connection',ease(t-1.05));enter('connection-dot',t,{delay:1.5,y:0,scale:.5,type:'small'});enter('connect-note',t,{delay:1.65,y:20,type:'text'});
}
function finale(t){
 const p=S(t,'browser');camera($('final-logo'),{y:(1-p)*25,scale:mix(1.04,1,p)-clamp(t/3)*.015});op('final-logo',ease(t*2));
 $('final-logo').style.clipPath=`inset(0 ${(1-ease(t*1.5))*100}% 0 0)`;
 rise('final-line',t,.15);enter('final-sub',t,{delay:.35,y:20,type:'text'});enter('final-url',t,{delay:.6,y:25,type:'small'});camera($('final-rule'),{scale:ease(t-.65)});op('final-rule',ease(t-.65));
}
const renderers=[opening,introduction,discovery,profile,ai,connection,finale];
window.seek=input=>{
 const t=clamp(Number(input)||0,0,30);const current=sceneAt(t);const index=['Cerita','LUMORA','Discovery','Profil','Asisten AI','Peluang','Tumbuh bersama'].indexOf(current.name);
 for(let i=0;i<7;i++){$('s'+i).style.opacity=i===index?'1':'0';$('s'+i).style.pointerEvents=i===index?'auto':'none';}
 renderers[index](t-current.start);
 $('grain').style.backgroundPosition=`${Math.floor(hash(Math.floor(t*15))*128)}px ${Math.floor(hash(Math.floor(t*15)+9)*128)}px`;
 // Two-panel editorial shutter: scene switches only while fully covered.
 let cover=-2200,cover2=-2200;
 for(const boundary of [4,8,13,18,23,27]){
  const dt=t-boundary;
  if(dt>=-.24&&dt<=.5){
   const incoming=clamp(ease((dt+.24)*3)/ease(.72));
   const outgoing=clamp(ease(Math.max(0,dt)*2)/ease(1));
   cover=dt<0?mix(-2000,0,incoming):mix(0,2000,outgoing);
   cover2=dt<0?mix(-2000,0,clamp(ease((dt+.20)*4)/ease(.8))):mix(0,2000,clamp(ease(Math.max(0,dt-.035)*2.2)/ease(1.023)));
  }
 }
 $('wipe').style.transform=`translateX(${cover}px)`;$('wipe2').style.transform=`translateX(${cover2}px)`;
 document.querySelector('#scrub').value=t;document.querySelector('#time').textContent=t.toFixed(2)+' / 30';window.currentTime=t;
};
function resize(){const s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform=`scale(${s})`;stage.style.left=`${(innerWidth-1920*s)/2}px`;stage.style.top=`${(innerHeight-1080*s)/2}px`;}
addEventListener('resize',resize);resize();
if(new URLSearchParams(location.search).has('render'))document.documentElement.classList.add('render');
let playing=false,epoch=0;const audio=new Audio('audio/soundtrack.wav');
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'Jeda':'Putar';if(playing){epoch=performance.now()-window.currentTime*1000;audio.currentTime=window.currentTime;audio.play().catch(()=>{});requestAnimationFrame(tick);}else audio.pause();};
function tick(now){if(!playing)return;const t=(now-epoch)/1000;window.seek(Math.min(t,29.983333));if(t>=30){playing=false;$('play').textContent='Putar';audio.pause();return;}requestAnimationFrame(tick);}
$('scrub').oninput=e=>{playing=false;audio.pause();$('play').textContent='Putar';window.seek(Number(e.target.value));};
await Promise.all([
 document.fonts.load('500 128px Poppins'),document.fonts.load('600 72px Poppins'),document.fonts.load('700 72px Poppins'),
 document.fonts.load('400 24px Geist'),document.fonts.load('500 24px Geist'),document.fonts.load('600 24px Geist'),
 ...[...document.images].map(i=>i.decode()),
]);
await document.fonts.ready;
// Rasterize the two display lines once at 2x. This avoids Chromium changing
// glyph antialiasing when a text layer is promoted after a nonsequential seek.
for(const [id,text,color] of [['open-line1','SETIAP BISNIS','#f5f2e9'],['open-line2','PUNYA CERITA.','#b7df68']]){
 const c=document.createElement('canvas');c.width=3380;c.height=288;const g=c.getContext('2d');g.scale(2,2);g.font='500 128px Poppins';g.letterSpacing='-6px';g.fillStyle=color;g.textAlign='center';g.textBaseline='alphabetic';g.fillText(text,845,110);
 $(id).innerHTML=`<img src="${c.toDataURL()}" width="1690" height="144" alt="${text}" style="display:block;width:100%;height:144px;object-fit:contain">`;
}
await Promise.all([...document.images].map(i=>i.decode()));
// Warm every authored layer once before capture; compositor allocation must not
// depend on which scene a random-access renderer requests first.
for(const t of [1.9,5.8,10.4,15.6,17.45,21.65,25.4,29]){window.seek(t);await new Promise(requestAnimationFrame);}
window.seek(0);await new Promise(requestAnimationFrame);window.__ready=true;
