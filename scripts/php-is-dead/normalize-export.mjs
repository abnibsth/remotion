import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
for(const mode of ['prototype','final']){
 const target=path.resolve(`out/php-is-dead/php-is-dead-${mode}.mp4`),temp=target.replace('.mp4','-bt709.mp4');
 const before=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=pix_fmt,color_range,color_space','-of','json',target],{encoding:'utf8',windowsHide:true});
 if(before.status!==0)throw Error(before.stderr);
 const source=JSON.parse(before.stdout).streams[0];
 if(source.pix_fmt==='yuv420p'&&source.color_space==='bt709'){console.log(mode,'already normalized');continue;}
 if(source.color_range!=='pc')throw Error('Expected a full-range source before range conversion');
 const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','warning','-y','-i',target,'-vf','scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-crf','17','-preset','medium','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','copy','-movflags','+faststart',temp],{encoding:'utf8',windowsHide:true});
 if(r.status!==0)throw Error(r.stderr);await fs.rename(temp,target);
 const m=spawnSync('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',target],{encoding:'utf8',windowsHide:true});if(m.status!==0)throw Error(m.stderr);
 const metadata=JSON.parse(m.stdout),v=metadata.streams.find(s=>s.codec_type==='video');if(v.pix_fmt!=='yuv420p'||v.color_space!=='bt709')throw Error('Color format not fixed');
 const decode=spawnSync('ffmpeg',['-v','error','-i',target,'-f','null','-'],{encoding:'utf8',windowsHide:true});if(decode.status!==0)throw Error(decode.stderr);
 await fs.writeFile(path.resolve(`out/php-is-dead/${mode==='prototype'?'prototype':'render'}-report.json`),JSON.stringify({frames:mode==='prototype'?480:1200,decoded:true,metadata},null,2));
 console.log(mode,'converted to limited-range BT.709 yuv420p');
}
