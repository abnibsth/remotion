import {svgAt} from '../../src/ClickALink/lib/film';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
declare global {interface Window {seek:(t:number)=>Promise<void>;ready:Promise<void>}}
window.seek=async(t:number)=>{document.getElementById('root')!.innerHTML=svgAt(t);document.documentElement.dataset.time=String(t);};
window.ready=Promise.all([document.fonts.load('700 80px "Space Grotesk"'),document.fonts.load('500 24px "IBM Plex Mono"')]).then(()=>document.fonts.ready).then(()=>window.seek(0));
