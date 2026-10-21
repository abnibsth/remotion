import {svgAt} from '../../src/Petir/lib/film';import '@fontsource/space-grotesk/latin-700.css';import '@fontsource/inter/latin-500.css';import '@fontsource/ibm-plex-mono/latin-500.css';
declare global{interface Window{seek:(t:number)=>Promise<void>;ready:Promise<void>}}
window.seek=async(t:number)=>{document.getElementById('root')!.innerHTML=svgAt(t);await Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>{})));};
window.ready=Promise.all([document.fonts.load('700 72px "Space Grotesk"'),document.fonts.load('500 34px Inter'),document.fonts.load('500 22px "IBM Plex Mono"')]).then(()=>document.fonts.ready).then(()=>window.seek(0));
