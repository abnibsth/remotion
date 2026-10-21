import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.dirname(fileURLToPath(import.meta.url));const out=path.join(root,'output');
function run(exe,args){return new Promise((resolve,reject)=>{const p=spawn(exe,args,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='';p.stdout.on('data',d=>stdout+=d);p.stderr.on('data',d=>stderr+=d);p.on('error',reject);p.on('exit',code=>code===0?resolve({stdout,stderr}):reject(Error(stderr)));});}
function fastStart(buffer){let at=0,moov=-1,mdat=-1;while(at+8<=buffer.length){let n=buffer.readUInt32BE(at);const name=buffer.toString('ascii',at+4,at+8);if(n===1)n=Number(buffer.readBigUInt64BE(at+8));if(name==='moov')moov=at;if(name==='mdat')mdat=at;if(n<8)break;at+=n;}return moov>=0&&mdat>=0&&moov<mdat;}
const results=[];
for(const file of ['lumora-master.mp4','lumora-social.mp4']){
 const full=path.join(out,file);const probe=JSON.parse((await run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',full])).stdout);
 const v=probe.streams.find(s=>s.codec_type==='video'),a=probe.streams.find(s=>s.codec_type==='audio');
 assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(v.codec_name,'h264');assert.equal(v.pix_fmt,'yuv420p');assert.equal(v.r_frame_rate,'60/1');assert.equal(v.avg_frame_rate,'60/1');assert.equal(Number(v.nb_read_frames),1800);assert.equal(Number(v.duration),30);assert.equal(Number(probe.format.duration),30);
 assert.equal(a.codec_name,'aac');assert.equal(a.sample_rate,'48000');assert.equal(a.channels,2);assert.equal(Number(a.duration),30);
 const buf=await fs.readFile(full);assert.ok(fastStart(buf),'moov must precede mdat');
 await run('ffmpeg',['-v','error','-i',full,'-f','null','-']);
 const measure=await run('ffmpeg',['-hide_banner','-i',full,'-vn','-af','loudnorm=I=-14:TP=-1:print_format=json','-f','null','-']);
 const loudnessMatch=measure.stderr.match(/\{\s*"input_i"[\s\S]*?\}/);assert.ok(loudnessMatch,'FFmpeg loudness JSON missing');
 const loudness=JSON.parse(loudnessMatch[0]);
 assert.ok(Math.abs(Number(loudness.input_i)+14)<1);assert.ok(Number(loudness.input_tp)<=-1);
 results.push({file,bytes:buf.length,duration:Number(probe.format.duration),frames:Number(v.nb_read_frames),video:{codec:v.codec_name,width:v.width,height:v.height,fps:v.avg_frame_rate,pixelFormat:v.pix_fmt},audio:{codec:a.codec_name,sampleRate:a.sample_rate,channels:a.channels,duration:Number(a.duration),integratedLUFS:Number(loudness.input_i),truePeakDBTP:Number(loudness.input_tp)},fastStart:true,fullDecode:'PASS'});
 console.log(file,JSON.stringify(results.at(-1)));
}
// Decode representative actual output frames for a final encode-level visual check.
for(const [i,t] of [1.9,5.8,10.4,15.6,17.45,21.65,25.4,29].entries())await run('ffmpeg',['-hide_banner','-y','-ss',String(t),'-i',path.join(out,'lumora-master.mp4'),'-frames:v','1',path.join(out,`decoded-${i}.png`)]);
await run('ffmpeg',['-hide_banner','-y','-framerate','1','-i',path.join(out,'decoded-%d.png'),'-vf','scale=640:360,tile=4x2:padding=8:margin=8:color=0x0b3027','-frames:v','1',path.join(out,'encoded-contact-sheet.png')]);
await fs.writeFile(path.join(out,'verification.json'),JSON.stringify({verifiedAt:new Date().toISOString(),results},null,2));
console.log('PASS: exact duration, actual decoded frame count, CFR, H.264, AAC 48kHz, faststart, decoded loudness, peak and full decode for both files.');
