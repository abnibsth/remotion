import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const out=path.join(root,'out/everything-is-motion');
function run(binary,args){const r=spawnSync(binary,args,{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});assert.equal(r.status,0,r.stderr);return r;}
const results=[];
for(const name of ['everything-is-motion-master.mp4','everything-is-motion-social.mp4']){
 const file=path.join(out,name);
 const data=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',file]).stdout);
 const video=data.streams.find(s=>s.codec_type==='video'),audio=data.streams.find(s=>s.codec_type==='audio');
 assert.equal(video.codec_name,'h264');assert.equal(video.width,1920);assert.equal(video.height,1080);assert.equal(video.r_frame_rate,'60/1');assert.equal(Number(video.nb_read_frames),1200);assert.equal(video.pix_fmt,'yuv420p');assert.equal(Number(video.duration),20);assert.equal(Number(data.format.duration),20);assert.equal(audio.codec_name,'aac');assert.equal(audio.sample_rate,'48000');
 run('ffmpeg',['-hide_banner','-v','error','-i',file,'-f','null','-']);
 const analysis=run('ffmpeg',['-hide_banner','-i',file,'-vn','-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-']).stderr;
 const match=analysis.match(/\{\s*"input_i"[\s\S]*?\}/);
 assert.ok(match,'loudness JSON missing');
 const loudness=JSON.parse(match[0]);assert.ok(Number(loudness.input_tp)<=-1,`true peak ${loudness.input_tp}`);assert.ok(Math.abs(Number(loudness.input_i)+14)<1,`integrated ${loudness.input_i}`);
 const black=run('ffmpeg',['-hide_banner','-i',file,'-vf','blackdetect=d=0.016:pix_th=0.03:pic_th=0.98','-an','-f','null','-']).stderr;
 assert.ok(!black.includes('black_start:'),'black frames detected');
 results.push({name,bytes:(await fs.stat(file)).size,frames:Number(video.nb_read_frames),duration:video.duration,fps:video.r_frame_rate,loudness,decode:'PASS',blackFrames:'NONE'});
}
assert.deepEqual(await fs.readFile(path.join(out,'loop-first.png')),await fs.readFile(path.join(out,'loop-last.png')));
const report={results,loopSourcePixels:'IDENTICAL',verifiedAt:new Date().toISOString()};
await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
