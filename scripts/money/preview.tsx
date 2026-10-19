import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {MoneyFilm} from '../../src/WhereDidMyMoneyGo';

declare global {interface Window {seek:(time:number)=>Promise<void>;ready:Promise<void>;}}
const root=createRoot(document.getElementById('root')!);
window.seek=async(time:number)=>{flushSync(()=>root.render(<MoneyFilm time={Math.max(0,Math.min(1199/60,time))}/>)); await document.fonts.ready;};
window.ready=(async()=>{await window.seek(0);await Promise.all([document.fonts.load('700 100px "Space Grotesk"'),document.fonts.load('400 40px "IBM Plex Mono"')]);})();
