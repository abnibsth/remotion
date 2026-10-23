import {C,type,mono,group,rule} from './design';
import {assemblyAt,smooth,mix,profiles,openingPose,type Key} from './motion.mjs';
const sources=['BOL','ITA','SER','MO'];
const specimens=['BOLD','ITALIC','SERIF','MONOSPACE'];
export const assembly=(t:number)=>{
 let s=mono('FOUR TEMPERAMENTS. ONE VOICE.',80,270,21)+rule(305);
 const letters=assemblyAt(t),unbuild=smooth((t-18)/1.35);
 for(const [i,l] of letters.entries()){
  const p=l.progress,source=sources[l.row][l.n],key=l.key as Key,home=openingPose(key,20),homeIndex=l.n;
  const homeX=home.x+homeIndex*(home.size*(key==='monospace'?.6:.67)),homeY=home.y;
  const x=mix(l.x,homeX,unbuild),y=mix(l.y,homeY,unbuild);
  const glyphBlend=smooth((p-.52)/.28)*(1-unbuild),fontSize=mix(mix(key==='monospace'?88:147,126,p),home.size,unbuild);
  const lineX=[94,178.64,263.28,354.64,428.52,517.75,599.89,682.61,745.05,783.25,853.25][i];
  const trailAlpha=(1-p)*.35;
  s+=`<path d="M${300+l.n*130} ${620+l.row*240}Q510 ${730+l.row*75} ${lineX} 985" fill="none" stroke="${profiles[key].accent}" stroke-width="2" opacity="${trailAlpha*(1-unbuild)}"/>`;
  // Local opposing masks substitute glyphs only while that traveling letter lands.
  const id=`letter-${i}`,split=225*(1-glyphBlend);
  s+=`<defs><clipPath id="${id}-source"><rect x="-28" y="-225" width="180" height="${Math.max(0,split)}"/></clipPath><clipPath id="${id}-target"><rect x="-28" y="${-225+split}" width="180" height="${225-split}"/></clipPath></defs>`;
  let glyph=`<g clip-path="url(#${id}-source)">${type(source,0,0,fontSize,key)}</g><g clip-path="url(#${id}-target)">${type(l.glyph,0,0,fontSize,key)}</g>`;
  if(p>.99&&t<18)glyph=type(l.glyph,0,0,126,key);
  const rotate=key==='italic'?mix(-9,0,p)*(1-unbuild):key==='serif'?mix(7,0,p)*(1-unbuild):0;
  s+=group(glyph,x,y,1,1,rotate,1);
 }
 s+=mono('MOTION GIVES TYPE A VOICE.',510,1390,27,C.ink,`text-anchor="middle" opacity="${smooth((t-16.35)/.3)*(1-unbuild)}"`);
 if(t<16.7){for(const [row,word] of specimens.entries()){const key=(['bold','italic','serif','monospace'] as Key[])[row],start=row===3?2:3,q=letters.find(l=>l.row===row)!.progress;for(let i=start;i<word.length;i++)s+=group(type(word[i],0,0,row===3?88:147,key),[200,180,260,125][row]+i*[170,125,120,86][row],620+row*240,1-q*.85,1-q*.85,0,1-q);}}
 // The remaining specimen letters return along the same four style bands.
 if(t>18){for(const key of ['bold','italic','serif','monospace'] as Key[]){const word=key.toUpperCase(),start=key==='bold'?3:key==='italic'?3:key==='serif'?3:2,p=openingPose(key,20);for(let i=start;i<word.length;i++)s+=group(type(word[i],0,0,p.size,key),p.x+i*p.size*(key==='monospace'?.6:.67),p.y,unbuild,unbuild,0,unbuild);}}
 return s;
};
