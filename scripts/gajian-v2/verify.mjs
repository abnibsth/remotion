import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=path.join(root,'gajian-motion/v2/output');
const run=(bin,args)=>{const r=spawnSync(bin,args,{encoding:'utf8',maxBuffer:32e6});if(r.status)throw Error(r.stderr);return r;};
const reports=[];
for(const [name,duration,frames]of [['gajian-v2-preview.mp4',7,210],['gajian-v2-final.mp4',30,900]]){
 const file=path.join(out,name),p=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',file]).stdout);
 const v=p.streams.find(s=>s.codec_type==='video'),a=p.streams.find(s=>s.codec_type==='audio');
 assert.equal(+p.format.duration,duration);assert.equal(+v.duration,duration);assert.equal(+v.nb_read_frames,frames);assert.equal(v.width,1080);assert.equal(v.height,1920);assert.equal(v.r_frame_rate,'30/1');assert.equal(v.codec_name,'h264');assert.equal(v.pix_fmt,'yuv420p');assert.equal(a.codec_name,'aac');assert.equal(+a.sample_rate,48000);
 run('ffmpeg',['-v','error','-xerror','-i',file,'-f','null','-']);
 const measured=run('ffmpeg',['-hide_banner','-nostats','-i',file,'-vn','-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-']).stderr;
 const loudness=JSON.parse(measured.slice(measured.lastIndexOf('{'),measured.lastIndexOf('}')+1));
 assert.ok(+loudness.input_tp<=-1,'True peak must remain below -1dBTP');
 const scan=run('ffmpeg',['-hide_banner','-nostats','-i',file,'-an','-vf','blackdetect=d=0.1:pix_th=0.04:pic_th=0.98','-f','null','-']).stderr;
 assert.ok(!scan.includes('black_start:'),'No unintended blank intervals');
 reports.push({name,duration,frames,width:v.width,height:v.height,fps:30,video:v.codec_name,audio:a.codec_name,sampleRate:+a.sample_rate,bytes:(await fs.stat(file)).size,loudness,decodePassed:true});
}
const report={passed:true,files:reports};
await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
