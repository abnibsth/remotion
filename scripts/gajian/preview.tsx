import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Thumbnail} from '@remotion/player';
import {GajianVisual} from '../../src/Gajian';

declare global {interface Window {seek:(t:number)=>Promise<void>;ready:Promise<void>;}}
const root=createRoot(document.getElementById('root')!);
window.seek=async(t:number)=>{
 const frame=Math.max(0,Math.min(899,Math.round(t*30)));
 flushSync(()=>root.render(<Thumbnail component={GajianVisual} frameToDisplay={frame} compositionWidth={1080} compositionHeight={1920} fps={30} durationInFrames={900} style={{width:1080,height:1920}}/>));
 await document.fonts.ready;
};
window.ready=(async()=>{await window.seek(0);await document.fonts.load('100px Anton');await document.fonts.load('900 40px Inter');await window.seek(0);})();
