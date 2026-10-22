import {svgAt} from '../../src/FixOneBug/film';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
(window as unknown as {seek:(t:number)=>void;ready:Promise<void>}).seek=(t:number)=>{document.getElementById('root')!.innerHTML=svgAt(t);};
(window as unknown as {ready:Promise<void>}).ready=Promise.all([document.fonts.load('400 120px "Archivo Black"'),document.fonts.load('500 30px "IBM Plex Mono"')]).then(()=>document.fonts.ready).then(()=>{document.getElementById('root')!.innerHTML=svgAt(0);});
