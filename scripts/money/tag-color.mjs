import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const out='out/where-did-my-money-go';
for(const name of ['master','preview','social']){
 const file=path.join(out,`where-did-my-money-go-${name}.mp4`),temp=file.replace('.mp4','.color-tagged.mp4');
 await fs.stat(file);
 const result=spawnSync('ffmpeg',['-hide_banner','-loglevel','warning','-y','-i',file,'-map','0','-c','copy','-bsf:v','h264_metadata=video_full_range_flag=0:colour_primaries=1:transfer_characteristics=13:matrix_coefficients=1','-color_primaries','bt709','-color_trc','iec61966-2-1','-colorspace','bt709','-movflags','+faststart',temp],{encoding:'utf8',windowsHide:true});
 if(result.status!==0)throw Error(result.stderr);
 await fs.rename(temp,file);
 console.log(`Explicit sRGB-transfer / BT.709 metadata: ${name}`);
}
