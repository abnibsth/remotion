import {Composition,registerRoot} from 'remotion';
import {GajianV2,GajianV2Prototype} from '../../src/GajianV2';
const Root=()=><>
 <Composition id="GajianV2" component={GajianV2} durationInFrames={900} fps={30} width={1080} height={1920}/>
 <Composition id="GajianV2Prototype" component={GajianV2Prototype} durationInFrames={210} fps={30} width={1080} height={1920}/>
</>;
registerRoot(Root);
