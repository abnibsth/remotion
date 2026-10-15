import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
const output=path.resolve('out/notifikasi-overload');
for(const [variant,bitrate] of [['master','320k'],['social','192k']]){
  const file=path.join(output,`notifikasi-overload-${variant}.mp4`);
  await fs.access(file);
  const temporary=path.join(output,`notifikasi-overload-${variant}-audio-fixed.mp4`);
  const result=spawnSync('ffmpeg',['-hide_banner','-y','-i',file,'-i','public/notifikasi/audio/mix.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a',bitrate,'-ar','48000','-t','20','-movflags','+faststart',temporary],{stdio:'inherit'});
  if(result.status!==0)throw new Error('Audio remux failed; original preserved');
  await fs.rename(temporary,file);
}
