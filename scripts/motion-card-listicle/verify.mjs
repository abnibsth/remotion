import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const out=path.resolve('out/motion-card-listicle');
function run(bin,args){const r=spawnSync(bin,args,{encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error(r.stderr||r.stdout);return r.stdout+r.stderr;}
const checks=[];
const check=(label,actual,expected)=>{if(actual!==expected)throw Error(`${label}: expected ${expected}, received ${actual}`);checks.push({label,actual,pass:true});};
for(const [name,w,h]of[['motion-card-listicle-final.mp4',1080,1920],['motion-card-listicle-preview.mp4',540,960]]){
 const file=path.join(out,name);const meta=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',file]));
 const v=meta.streams.find(s=>s.codec_type==='video'),a=meta.streams.find(s=>s.codec_type==='audio');
 check(name+' width',v.width,w);check(name+' height',v.height,h);check(name+' frames',Number(v.nb_read_frames),1500);check(name+' fps',v.r_frame_rate,'60/1');check(name+' duration',Number(meta.format.duration),25);check(name+' video',v.codec_name,'h264');check(name+' pixel format',v.pix_fmt,'yuv420p');check(name+' audio',a.codec_name,'aac');check(name+' audio sample rate',a.sample_rate,'48000');check(name+' channels',a.channels,2);
 run('ffmpeg',['-v','error','-i',file,'-f','null','-']);checks.push({label:name+' full AV decode',pass:true});
 await fs.writeFile(path.join(out,name.replace('.mp4','-ffprobe.json')),JSON.stringify(meta,null,2));
}
const loudness=run('ffmpeg',['-hide_banner','-i',path.join(out,'motion-card-listicle-final.mp4'),'-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-']);
const metrics=JSON.parse(loudness.slice(loudness.lastIndexOf('{'),loudness.lastIndexOf('}')+1));
if(Math.abs(Number(metrics.input_i)+14)>.7)throw Error('Integrated loudness outside target tolerance');
if(Number(metrics.input_tp)>-1)throw Error('True peak exceeds -1 dBTP');
checks.push({label:'AAC integrated loudness',actual:metrics.input_i,pass:true},{label:'AAC true peak',actual:metrics.input_tp,pass:true});
const style=JSON.parse(await fs.readFile(path.join(out,'style-qc.json'),'utf8'));check('seek determinism',style.seekSafe,true);check('browser errors',style.browserErrors.length,0);check('text safe-margin overflows',style.safeMarginOverflows.length,0);
await fs.writeFile(path.join(out,'verification.json'),JSON.stringify({verifiedAt:new Date().toISOString(),checks,loudness:metrics},null,2));
console.log(JSON.stringify({checks:checks.length,pass:true,loudness:metrics.input_i,truePeak:metrics.input_tp},null,2));
