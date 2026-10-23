import {svgAt} from '../../src/FontsHaveFeelings/film';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/inter-tight/latin-800-italic.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
const win=window as unknown as {seek:(t:number)=>void;ready:Promise<void>};
win.seek=t=>{if(!Number.isFinite(t)||t<0||t>20)throw Error('seek expects 0–20 seconds');document.getElementById('root')!.innerHTML=svgAt(t);};
win.ready=Promise.all([document.fonts.load('400 200px "Archivo Black"'),document.fonts.load('italic 800 200px "Inter Tight"'),document.fonts.load('500 200px "Cormorant Garamond"'),document.fonts.load('500 30px "IBM Plex Mono"')]).then(()=>document.fonts.ready).then(()=>win.seek(0));
