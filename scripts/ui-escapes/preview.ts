import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import {createFilm} from '../../src/UiEscapes/engine';
import {stateAt} from '../../src/UiEscapes/motion.mjs';
const w=window as unknown as {ready:Promise<void>;seek:(t:number)=>Promise<void>;stateAt:typeof stateAt;film:ReturnType<typeof createFilm>};
w.ready=(async()=>{await Promise.all([document.fonts.load('500 80px "Space Grotesk"'),document.fonts.load('600 80px "Space Grotesk"'),document.fonts.load('700 80px "Space Grotesk"'),document.fonts.load('400 24px "IBM Plex Mono"'),document.fonts.load('500 24px "IBM Plex Mono"')]);const f=createFilm(document.getElementById('root')!);w.film=f;w.stateAt=stateAt;w.seek=async(t:number)=>{f.seek(t);await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));};await w.seek(0);})();
