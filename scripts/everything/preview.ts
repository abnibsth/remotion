import {svgAt} from '../../src/EverythingIsMotion/lib/film';
import '@fontsource/space-grotesk/latin-700.css';

declare global {
  interface Window {seek:(time:number)=>Promise<void>; ready:Promise<void>}
}
window.seek=async(time:number)=>{
  document.getElementById('root')!.innerHTML=svgAt(time);
  document.documentElement.dataset.time=String(time);
};
window.ready=document.fonts.load('700 18px "Space Grotesk"').then(()=>document.fonts.ready).then(()=>{window.seek(0);});
