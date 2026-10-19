import {spawnSync} from 'node:child_process';
import path from 'node:path';
const out='out/verve-commercial',file=path.join(out,'product-commercial-final.mp4');
for(const [name,time] of [['teaser',.8],['reveal',5],['detail',9.8],['hero',14.5],['packshot',18.8]]){
 const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-nostdin','-y','-ss',String(time),'-i',file,'-frames:v','1',path.join(out,`verified-${name}.png`)],{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr);
}
console.log('Extracted five full-resolution frames from actual final MP4.');
