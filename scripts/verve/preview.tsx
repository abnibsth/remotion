import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {VerveFilm} from '../../src/Verve';

declare global{interface Window{verveSeek:(t:number)=>Promise<void>;verveReady:Promise<void>;}}
const root=createRoot(document.getElementById('root')!);
window.verveSeek=async(t:number)=>{flushSync(()=>root.render(<VerveFilm time={Math.max(0,Math.min(20,t))}/>));await document.fonts.ready;await Promise.all([...document.querySelectorAll('image')].map(e=>new Promise<void>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve();i.onerror=()=>reject(new Error('Missing asset '+e.getAttribute('href')));i.src=e.getAttribute('href')!;})));};
Object.assign(window,{seek:window.verveSeek});
window.verveReady=window.verveSeek(0);
