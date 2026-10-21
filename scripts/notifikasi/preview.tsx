import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {NotifikasiView} from '../../src/Notifikasi/View';

declare global {interface Window {seek:(t:number)=>Promise<void>;ready:Promise<void>;}}
const root=createRoot(document.getElementById('root')!);
const fps=Number(new URLSearchParams(window.location.search).get('fps')||30);
if(fps!==30&&fps!==60)throw new Error('Frame rate must be 30 or 60');
window.seek=async(t:number)=>{
  flushSync(()=>root.render(<NotifikasiView t={Math.max(0,Math.min((20*fps-1)/fps,t))}/>));
  await document.fonts.ready;
};
window.ready=(async()=>{await document.fonts.load('100px Anton');await document.fonts.load('900 40px Inter');await window.seek(0);})();
