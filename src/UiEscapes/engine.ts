import * as THREE from 'three';
import {stateAt,ease,mix,screenToWorld,PORTAL,LABELS} from './motion.mjs';

const C={ivory:'#F5F1E9',ink:'#17191D',graphite:'#363C45',cobalt:'#456BFF',orange:'#FF8059',mint:'#9DD8BF',white:'#FAFAF8'};
const mono='"IBM Plex Mono"',sans='"Space Grotesk"';
const canvas=(w:number,h:number)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const texture=(c:HTMLCanvasElement)=>{const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;};
function round(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number,fill:string){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function text(ctx:CanvasRenderingContext2D,s:string,x:number,y:number,size:number,color=C.ink,weight=500,font=sans){ctx.fillStyle=color;ctx.font=`${weight} ${size}px ${font}`;ctx.fillText(s,x,y);}
function desktop(){
 const c=canvas(1600,1000),x=c.getContext('2d')!;x.fillStyle='#E9E7E0';x.fillRect(0,0,1600,1000);
 // Original editorial wallpaper; the detachable objects are not painted here.
 x.fillStyle='#E1E4DD';x.beginPath();x.ellipse(540,650,510,530,-.38,0,Math.PI*2);x.fill();
 x.fillStyle='#D8DED7';x.beginPath();x.ellipse(520,690,365,400,-.38,0,Math.PI*2);x.fill();
 x.fillStyle='#EEF0E9';x.beginPath();x.ellipse(590,620,225,300,-.38,0,Math.PI*2);x.fill();
 round(x,38,28,1524,78,20,C.white);text(x,'FIELD',72,79,33,C.ink,700);text(x,'/  WORKSPACE 01',216,76,23,C.graphite,400,mono);
 text(x,'LOCAL / 12:00',1252,76,22,C.graphite,400,mono);
 text(x,'A place for',96,242,47,C.graphite,500);text(x,'everything.',96,298,47,C.ink,600);
 text(x,'PROJECTS',221,665,22,C.graphite,500,mono);text(x,'01 ITEM',232,700,17,C.graphite,400,mono);
 round(x,570,839,416,72,35,C.white);text(x,'WORK',609,884,20,C.graphite,500,mono);text(x,'FILES',744,884,20,C.graphite,500,mono);text(x,'NOTES',868,884,20,C.graphite,500,mono);
 x.fillStyle=C.cobalt;x.beginPath();x.arc(592,866,5,0,Math.PI*2);x.fill();
 return texture(c);
}
function browserTexture(){
 const c=canvas(1280,896),x=c.getContext('2d')!;round(x,0,0,1280,896,30,C.white);
 round(x,0,0,1280,92,28,'#E4E6E9');x.fillStyle='#E4E6E9';x.fillRect(0,50,1280,42);
 for(let i=0;i<3;i++){x.fillStyle=[C.orange,C.mint,'#B6BDC8'][i];x.beginPath();x.arc(38+i*31,44,8,0,Math.PI*2);x.fill();}
 round(x,180,14,412,65,14,C.white);text(x,'New ideas',208,57,26,C.ink,500);text(x,'+',630,58,30,C.graphite);
 round(x,40,113,1200,60,15,'#F0F0EC');text(x,'←',62,153,26,C.graphite);text(x,'space.local / work',137,152,22,C.graphite,400,mono);
 text(x,'THE OPEN WORKSPACE',64,246,21,C.graphite,500,mono);
 text(x,'Ideas,',64,356,87,C.ink,600);text(x,'outside',64,454,87,C.ink,600);text(x,'the box.',64,552,87,C.cobalt,600);
 text(x,'Make room for a little possibility.',68,620,27,C.graphite,400);
 round(x,66,684,270,71,35,C.ink);text(x,'EXPLORE  ↗',105,731,24,C.white,500,mono);
 const g=x.createLinearGradient(762,281,1150,678);g.addColorStop(0,'#7190FF');g.addColorStop(.47,C.cobalt);g.addColorStop(1,'#253FB6');
 x.save();x.translate(984,454);x.rotate(-.28);round(x,-180,-168,337,347,54,g as unknown as string);x.fillStyle='#A4B5FF';x.beginPath();x.moveTo(-180,-168);x.lineTo(-110,-230);x.lineTo(211,-230);x.lineTo(157,-168);x.closePath();x.fill();x.fillStyle='#2E49C6';x.beginPath();x.moveTo(157,-168);x.lineTo(211,-230);x.lineTo(211,120);x.lineTo(157,179);x.closePath();x.fill();x.restore();
 x.fillStyle=C.orange;x.beginPath();x.arc(1070,685,70,0,Math.PI*2);x.fill();text(x,'✳',1036,713,81,C.ink,500);
 x.strokeStyle='#DADDD7';x.lineWidth=2;x.beginPath();x.moveTo(64,815);x.lineTo(1216,815);x.stroke();text(x,'A SMALL EXPERIMENT IN POSSIBILITY',65,861,18,C.graphite,400,mono);
 return texture(c);
}
function notificationTexture(i:number){const c=canvas(900,330),x=c.getContext('2d')!;round(x,0,0,900,330,28,C.white);round(x,0,0,13,330,6,[C.cobalt,C.mint,C.orange][i%3]);round(x,43,43,70,70,20,[C.cobalt,C.mint,C.orange][i%3]);text(x,i%3===0?'↗':i%3===1?'✓':'!',61,95,42,i%3===0?C.white:C.ink,600);text(x,'WORKSPACE / NOW',143,90,28,C.graphite,400,mono);text(x,LABELS[i],46,219,i===5||i===10?66:77,C.ink,600);text(x,'A LITTLE ATTENTION, PLEASE.',49,283,24,C.graphite,400,mono);return texture(c);}
function labelTexture(s:string,bg:string,fg:string,w=640,h=180){const c=canvas(w,h),x=c.getContext('2d')!;round(x,0,0,w,h,35,bg);x.textAlign='center';text(x,s,w/2,h*.65,h*.36,fg,600,mono);return texture(c);}
function material(color:string,roughness=.48,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
function rounded(w:number,h:number,r:number){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
function solid(w:number,h:number,d:number,r:number,mat:THREE.Material){const geo=new THREE.ExtrudeGeometry(rounded(w,h,r),{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.018,bevelThickness:.012,curveSegments:12});geo.translate(0,0,-d/2);const m=new THREE.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;return m;}
function plane(w:number,h:number,map:THREE.Texture){return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,transparent:true,side:THREE.DoubleSide}));}
function apply(g:THREE.Object3D,p:{position:number[];rotation:number[];scale:number[];visible:boolean}){g.position.set(...p.position as [number,number,number]);g.rotation.set(...p.rotation as [number,number,number]);g.scale.set(...p.scale as [number,number,number]);g.visible=p.visible;}
function shadowTexture(){const c=canvas(256,256),x=c.getContext('2d')!,g=x.createRadialGradient(128,128,12,128,128,128);g.addColorStop(0,'rgba(30,28,22,.42)');g.addColorStop(.4,'rgba(30,28,22,.24)');g.addColorStop(1,'rgba(30,28,22,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return texture(c);}
export type Film={seek:(t:number)=>void;dispose:()=>void;scene:THREE.Scene;camera:THREE.PerspectiveCamera;renderer:THREE.WebGLRenderer};
export function createFilm(host:HTMLElement,width=1080,height=1920):Film{
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});renderer.setPixelRatio(1);renderer.setSize(width,height);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;host.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(C.ivory);scene.fog=new THREE.Fog(C.ivory,30,65);
 const camera=new THREE.PerspectiveCamera(34,width/height,.1,100);
 scene.add(new THREE.HemisphereLight('#FFFFFF','#C5BBA8',1.65));
 const key=new THREE.DirectionalLight('#FFF5E7',3.1);key.position.set(-7,11,8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=10;key.shadow.camera.bottom=-5;key.shadow.normalBias=.025;key.shadow.bias=-.0001;key.shadow.radius=5;scene.add(key);
 const fill=new THREE.DirectionalLight('#E8EEFF',1.25);fill.position.set(7,5,5);scene.add(fill);const rim=new THREE.DirectionalLight('#FFFFFF',1.8);rim.position.set(0,7,-5);scene.add(rim);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),material('#D5D0C6',.94));floor.rotation.x=-Math.PI/2;floor.position.y=-2.65;floor.receiveShadow=true;scene.add(floor);
 const wall=new THREE.Mesh(new THREE.PlaneGeometry(80,40),material(C.ivory,.92));wall.position.set(0,7,-6);wall.receiveShadow=true;scene.add(wall);
 const desk=new THREE.Mesh(new THREE.BoxGeometry(10,.28,6.5),material('#EAE5DC',.38));desk.position.set(0,-.16,1.3);desk.receiveShadow=true;desk.castShadow=true;scene.add(desk);
 for(const x of [-4.1,4.1]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.22,2.5,4.8),material('#D4CEC3',.6));leg.position.set(x,-1.5,1.3);leg.castShadow=true;scene.add(leg);}
 const body=solid(6.5,4.2,.22,.15,material(C.graphite,.3,.52));body.position.set(0,3.7,-.06);scene.add(body);
 const glass=solid(6.22,3.94,.018,.07,material('#080B10',.22,.1));glass.position.set(0,3.7,.075);scene.add(glass);
 const screen=plane(6.1,3.82,desktop());screen.geometry.dispose();screen.geometry=new THREE.PlaneGeometry(6.1,3.82,48,32);const screenBase=screen.geometry.attributes.position.array.slice();screen.position.set(0,3.7,.113);scene.add(screen);
 const chin=plane(.32,.045,labelTexture('·','#363C45','#9DD8BF',200,80));chin.position.set(0,1.665,.075);scene.add(chin);
 const stand=solid(.3,1.61,.3,.035,material('#666C73',.25,.8));stand.position.set(0,.95,-.21);scene.add(stand);
 const foot=solid(2.15,1.3,.06,.16,material('#8A8D8E',.3,.7));foot.rotation.x=-Math.PI/2;foot.position.set(0,.025,.05);scene.add(foot);
 const folder=new THREE.Group();scene.add(folder);
 const folderShape=new THREE.Shape();folderShape.moveTo(-.57,-.56);folderShape.lineTo(.57,-.56);folderShape.quadraticCurveTo(.63,-.56,.63,-.49);folderShape.lineTo(.63,.3);folderShape.quadraticCurveTo(.63,.36,.56,.36);folderShape.lineTo(-.02,.36);folderShape.lineTo(-.12,.5);folderShape.lineTo(-.49,.5);folderShape.quadraticCurveTo(-.62,.5,-.62,.38);folderShape.lineTo(-.62,-.49);folderShape.quadraticCurveTo(-.62,-.56,-.57,-.56);
 const fgeo=new THREE.ExtrudeGeometry(folderShape,{depth:1,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3,curveSegments:12});const back=new THREE.Mesh(fgeo,material('#3151D1',.3,.12));back.castShadow=true;folder.add(back);
 const sheets:THREE.Mesh[]=[];for(let i=0;i<3;i++){const p=solid(1.05,.75,.012,.025,material(i%2?'#DDE5FF':'#FAFAF8',.7));sheets.push(p);folder.add(p);}
 const frontShape=rounded(1.27,.83,.06);const front=new THREE.Mesh(new THREE.ExtrudeGeometry(frontShape,{depth:.025,bevelEnabled:true,bevelSize:.015,bevelThickness:.01,bevelSegments:3}),material(C.cobalt,.3,.08));front.castShadow=true;front.receiveShadow=true;front.position.y=-.135;folder.add(front);
 const folderMark=plane(.64,.16,labelTexture('PROJECTS',C.cobalt,C.white,640,180));folderMark.position.set(0,-.18,.04);folder.add(folderMark);
 const browser=new THREE.Group();scene.add(browser);const browserGeo=new THREE.PlaneGeometry(3.22,2.25,32,24),basePositions=browserGeo.attributes.position.array.slice();
 const browserMat=new THREE.MeshStandardMaterial({map:browserTexture(),roughness:.5,metalness:0,side:THREE.DoubleSide,transparent:true,alphaTest:.4});const browserMesh=new THREE.Mesh(browserGeo,browserMat);browserMesh.castShadow=true;browserMesh.receiveShadow=true;browser.add(browserMesh);
 const browserBack=new THREE.Mesh(browserGeo,new THREE.MeshStandardMaterial({color:'#A5ADC1',roughness:.42,side:THREE.BackSide}));browserBack.position.z=-.022;browser.add(browserBack);
 const deleteButton=plane(1.14,.38,labelTexture('DELETE',C.ink,C.white));deleteButton.position.set(...screenToWorld(1350,870));scene.add(deleteButton);
 const notificationBadge=plane(.72,.3,labelTexture('01',C.orange,C.ink,360,140));notificationBadge.position.set(...screenToWorld(1380,160));scene.add(notificationBadge);
 const cards=LABELS.map((_,i)=>{const g=new THREE.Group(),body=solid(1.84,.675,.04,.05,material(C.white,.52));g.add(body);const face=plane(1.82,.667,notificationTexture(i));face.position.z=.035;g.add(face);scene.add(g);return g;});
 const contactMap=shadowTexture();const contacts=[folder,...cards].map(()=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:contactMap,transparent:true,opacity:.6,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=-.012;scene.add(m);return m;});
 const portal=new THREE.Group();portal.position.set(PORTAL[0],PORTAL[1],.22);scene.add(portal);
 const portalDisk=new THREE.Mesh(new THREE.CircleGeometry(1,96),new THREE.MeshBasicMaterial({color:'#111319'}));portal.add(portalDisk);
 const rings:THREE.Mesh[]=[];for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.03+i*.047,.013+i*.003,8,96),material(i===0?C.white:i===1?C.graphite:'#777D87',.34,.6));r.position.z=-i*.006;portal.add(r);rings.push(r);}
 const portalInner=new THREE.Mesh(new THREE.CircleGeometry(.83,96),new THREE.MeshBasicMaterial({color:'#080A0E'}));portalInner.position.z=.006;portal.add(portalInner);
 const portalSpiral=new THREE.Group();portal.add(portalSpiral);for(let i=0;i<3;i++){const curve=new THREE.EllipseCurve(0,0,.25+i*.2,.16+i*.16,.4,2.1,false,i*.7);const points=curve.getPoints(48).map(p=>new THREE.Vector3(p.x,p.y,.018));const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:i===0?'#454C5B':'#292E38',transparent:true,opacity:.65}));portalSpiral.add(l);}
 const cursorShape=new THREE.Shape();cursorShape.moveTo(0,0);cursorShape.lineTo(.04,-.42);cursorShape.lineTo(.15,-.32);cursorShape.lineTo(.24,-.48);cursorShape.lineTo(.32,-.43);cursorShape.lineTo(.23,-.27);cursorShape.lineTo(.39,-.25);cursorShape.closePath();const cursor=new THREE.Mesh(new THREE.ShapeGeometry(cursorShape),new THREE.MeshBasicMaterial({color:C.ink,side:THREE.DoubleSide}));scene.add(cursor);
 const clickRing=new THREE.Mesh(new THREE.RingGeometry(.19,.205,48),new THREE.MeshBasicMaterial({color:C.orange,transparent:true,opacity:0,side:THREE.DoubleSide}));scene.add(clickRing);
 const overlay=document.createElement('div');overlay.style.cssText=`position:absolute;inset:0;pointer-events:none;font-family:${sans};color:${C.ink};overflow:hidden`;host.appendChild(overlay);
 overlay.innerHTML=`<div data-eyebrow style="position:absolute;top:155px;left:76px;right:76px;display:flex;justify-content:space-between;font:500 19px ${mono};letter-spacing:3px"><span>AN INTERFACE EXPERIMENT</span><span>NO. 001</span></div><div data-title style="position:absolute;top:218px;left:74px;right:74px;font-weight:600;font-size:82px;line-height:.98;letter-spacing:-5px">WHAT IF YOUR<br>DESKTOP WAS <span style="color:${C.cobalt}">ALIVE?</span></div><div data-caption style="position:absolute;left:78px;right:78px;top:1512px;font:500 23px ${mono};letter-spacing:2px;display:flex;align-items:center;gap:16px"><span style="width:32px;height:3px;background:${C.cobalt}"></span><span data-chapter>01 / PERFECTLY NORMAL.</span></div><div data-final style="position:absolute;left:74px;right:74px;top:305px;font-size:59px;line-height:1.04;letter-spacing:-2px;font-weight:600;opacity:0">1 NEW NOTIFICATION<span style="color:${C.orange}">.</span></div><div style="position:absolute;bottom:205px;left:78px;right:78px;border-top:1px solid #17191D24;padding-top:23px;display:flex;justify-content:space-between;font:400 17px ${mono};letter-spacing:2px"><span>WHEN UI ESCAPES THE SCREEN</span><span>2D → 3D</span></div>`;
 const title=overlay.querySelector<HTMLElement>('[data-title]')!,eyebrow=overlay.querySelector<HTMLElement>('[data-eyebrow]')!,caption=overlay.querySelector<HTMLElement>('[data-chapter]')!,final=overlay.querySelector<HTMLElement>('[data-final]')!;
 const captions=['01 / PERFECTLY NORMAL.','02 / FILES HAVE PLACES TO BE.','03 / THINK OUTSIDE THE WINDOW.','04 / PLEASE DO NOT DISTURB.','05 / DELETE MEANS DELETE.','06 / NOTHING TO SEE HERE.'];
 function seek(t:number){
  const s=stateAt(t),cam=s.camera;camera.position.set(...cam.position as [number,number,number]);camera.lookAt(...cam.target as [number,number,number]);camera.fov=cam.fov;camera.updateProjectionMatrix();
  const screenPos=screen.geometry.attributes.position,exitPulse=Math.sin(ease(t,3.1,4.8)*Math.PI)*(1-ease(t,4.8,5.4));
  for(let i=0;i<screenPos.count;i++){const x=screenBase[i*3],y=screenBase[i*3+1],r=Math.hypot(x+1.94,y-.0);screenPos.setXYZ(i,x,y,exitPulse*.055*Math.cos(r*12-(t-3.1)*7)*Math.exp(-r*r*1.8));}screenPos.needsUpdate=true;
  apply(folder,s.folder);back.scale.z=s.folder.depth;front.position.z=s.folder.depth+.016;folderMark.position.z=s.folder.depth+.06;
  sheets.forEach((p,i)=>{p.position.set(.015*(i-1),-.015+i*.035,s.folder.depth*(.2+i*.18));p.rotation.z=Math.sin(t*6+i)*.025*ease(t,3.3,4.7)*(1-ease(t,6,6.6));p.visible=s.folder.depth>.03;});
  apply(browser,s.browser);const pos=browserGeo.attributes.position;
  for(let i=0;i<pos.count;i++){const x=basePositions[i*3],y=basePositions[i*3+1],v=(y+1.125)/2.25,u=x/3.22+.5;pos.setXYZ(i,x+Math.sin(v*Math.PI)*s.browser.peel*.13,y-s.browser.peel*v*v*.2,s.browser.peel*(v*v*.72+Math.sin(u*Math.PI)*v*.21));}pos.needsUpdate=true;browserGeo.computeVertexNormals();
  cards.forEach((g,i)=>apply(g,s.cards[i]));
  contacts.forEach((m,i)=>{const p=i===0?s.folder:s.cards[i-1],h=p.position[1];m.visible=p.visible&&t>3&&t<21.2;m.position.x=p.position[0];m.position.z=p.position[2];m.position.y=-.012+i*.0001;m.scale.set(i===0?1.8:2.3,i===0?1.0:1.15,1);(m.material as THREE.MeshBasicMaterial).opacity=i===0?.4/(1+Math.max(0,h-.58)*1.5):.35/(1+Math.max(0,h-.2)*2);});
  portal.visible=s.portal.scale>.0001;portal.scale.setScalar(Math.max(.0001,s.portal.scale*1.23));portalSpiral.rotation.z=-s.portal.angle;
  rings.forEach((r,i)=>{r.rotation.z=s.portal.angle*.12*(i%2?1:-1);r.scale.setScalar(1+.008*Math.sin(t*8+i));});
  deleteButton.visible=t<16.9||t>=21.2;notificationBadge.visible=t<11||t>=21.2;
  const cx=mix(820,300,ease(t,.2,1.5)),cy=mix(760,510,ease(t,.2,1.5));const del=ease(t,16,16.6);const cp=t<7?screenToWorld(cx,cy):screenToWorld(mix(1080,1350,del),mix(650,870,del));cursor.position.set(cp[0],cp[1],.28);cursor.visible=t<3.5||(t>=16&&t<16.95)||(t>=21.7&&t<23.3);
  const ct=t<3?t-1.5:t-16.6;clickRing.position.copy(cursor.position);clickRing.position.z=.29;clickRing.scale.setScalar(.5+Math.max(0,ct)*3);(clickRing.material as THREE.MeshBasicMaterial).opacity=ct>0&&ct<.3?(1-ct/.3)*.65:0;
  title.style.opacity=String((1-ease(t,2.8,3.4))+ease(t,22.1,22.5)*(1-ease(t,23.1,23.4)));title.style.transform=`translateY(${mix(0,-14,ease(t,2.8,3.4))}px)`;eyebrow.style.opacity='.8';
  const chapter=t<3?0:t<7?1:t<11?2:t<16?3:t<21.2?4:5;caption.textContent=captions[chapter];
  final.style.opacity=String(s.notification);final.style.transform=`translateY(${(1-s.notification)*12}px)`;
  renderer.render(scene,camera);
 }
 seek(0);
 return {seek,scene,camera,renderer,dispose(){scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{for(const v of Object.values(m))if(v instanceof THREE.Texture)v.dispose();m.dispose();});}});renderer.dispose();renderer.domElement.remove();overlay.remove();}};
}
