import {C,text,mono,php,group,hit,rule} from '../design';
import {smooth,clamp,spring} from '../motion.mjs';
export const punchline=(t:number)=>{
  if(t<14.65){
    const d=t-14,q=smooth(d/.5),scale=1.4+q*4;
    return group(php(-328,95,320),510,866,scale,0,Math.max(.035,1-smooth((d-.38)/.22)));
  }
  let s=mono('PHP WOULD LIKE A WORD.',80,280,22,C.purple);
  s+=hit(text('BRO,',75,645,227),t,14.65,510,540);
  if(t>=15.20){
    const a=spring(t-15.20,21,14);s+=group(text("I'M STILL",0,0,106),83,845+(1-a)*80,1,0,clamp((t-15.20)*12));
  }
  s+=hit(text('RUNNING',78,1015,135),t,15.65,510,945);
  if(t>=16.25){
    s+=hit(text('YOUR',82,1170,95,C.green),t,16.25,250,1125);
    s+=hit(text('BACKEND.',72,1365,154,C.green,'transform="translate(0 -850) scale(1 1.65)"'),t,16.25,510,1300,2);
    s+=`<path d="M84 1450H930" stroke="${C.green}" stroke-width="3"/>`;
  }
  s+=rule(1530);
  const collapse=smooth((t-17.78)/.22);
  return `<g transform="translate(${510*collapse} ${900*collapse}) scale(${1-collapse*.995} ${1-collapse*.997})" opacity="${1-collapse*.7}">${s}</g>`;
};
