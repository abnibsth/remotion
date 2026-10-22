import {svgAt} from '../../src/PhpIsDead/film';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
declare global {interface Window {seek:(t:number)=>Promise<void>;ready:Promise<void>}}
window.seek=async(t:number)=>{if(!Number.isFinite(t)||t<0||t>20)throw Error('Seek must be between 0 and 20 seconds');document.getElementById('root')!.innerHTML=svgAt(t);};
window.ready=Promise.all([document.fonts.load('400 200px "Archivo Black"'),document.fonts.load('700 30px "Space Grotesk"'),document.fonts.load('500 30px "IBM Plex Mono"')]).then(()=>document.fonts.ready).then(()=>window.seek(0));
