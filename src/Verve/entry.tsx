import {Composition,registerRoot} from 'remotion';
import {VerveCommercial} from './index';
const VerveRoot=()=> <>
 <Composition id="VerveCommercial" component={VerveCommercial} durationInFrames={1200} fps={60} width={1920} height={1080}/>
 <Composition id="VervePrototype" component={VerveCommercial} durationInFrames={420} fps={60} width={1920} height={1080}/>
</>;
registerRoot(VerveRoot);
