import {Composition,registerRoot} from 'remotion';
import {Gajian} from '../../src/Gajian';

const StandaloneGajian=()=> <Composition id="Gajian" component={Gajian} durationInFrames={900} fps={30} width={1080} height={1920}/>;
registerRoot(StandaloneGajian);
