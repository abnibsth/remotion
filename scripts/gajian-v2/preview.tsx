import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Thumbnail} from '@remotion/player';
import {V2Visual} from '../../src/GajianV2';
declare global{interface Window{seek:(t:number)=>Promise<void>;ready:Promise<void>;}}
const root=createRoot(document.getElementById('root')!);
window.seek=async(t:number)=>{flushSync(()=>root.render(<Thumbnail key={Math.round(t*30)} component={V2Visual} frameToDisplay={Math.min(899,Math.max(0,Math.round(t*30)))} compositionWidth={1080} compositionHeight={1920} durationInFrames={900} fps={30} style={{width:1080,height:1920}}/>));await document.fonts.ready;};
window.ready=(async()=>{await window.seek(0);await document.fonts.load('700 100px "Space Grotesk"');await document.fonts.load('400 100px "Archivo Black"');await window.seek(0);})();
