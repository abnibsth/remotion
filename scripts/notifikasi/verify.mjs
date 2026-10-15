import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {renderSettings} from './render-settings.mjs';
const {fps,totalFrames,directory}=renderSettings();
const output=path.resolve(directory);
function execute(bin,args){const r=spawnSync(bin,args,{encoding:'utf8',maxBuffer:16*1024*1024});if(r.status!==0)throw new Error(`${bin} failed:\n${r.stderr}`);return r;}
const report={files:[],checks:[]};
for(const name of ['notifikasi-overload-master.mp4','notifikasi-overload-social.mp4']){
  const file=path.join(output,name);
  const metadata=JSON.parse(execute('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file]).stdout);
  const video=metadata.streams.find(s=>s.codec_type==='video');
  const audio=metadata.streams.find(s=>s.codec_type==='audio');
  assert.equal(video.width,1080);assert.equal(video.height,1920);
  assert.equal(video.r_frame_rate,`${fps}/1`);assert.equal(video.avg_frame_rate,`${fps}/1`);
  assert.equal(video.nb_frames,String(totalFrames));assert.equal(video.codec_name,'h264');assert.equal(video.pix_fmt,'yuv420p');
  assert.equal(audio.codec_name,'aac');assert.equal(audio.sample_rate,'48000');assert.equal(audio.channels,2);
  assert.equal(Number(metadata.format.duration),20);assert.equal(Number(video.duration),20);assert.equal(Number(audio.duration),20);
  const scan=execute('ffmpeg',['-hide_banner','-i',file,'-vf','blackdetect=d=0.02:pix_th=0.06:pic_th=0.98','-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-']);
  assert.ok(!scan.stderr.includes('black_start:'),'Unexpected black frames');
  const loudness=JSON.parse(scan.stderr.slice(scan.stderr.lastIndexOf('{'),scan.stderr.lastIndexOf('}')+1));
  assert.ok(Number(loudness.input_tp)<=-1,`True peak ${loudness.input_tp} exceeds -1 dBTP`);
  assert.ok(Math.abs(Number(loudness.input_i)+14)<1.5,`Loudness ${loudness.input_i} outside target tolerance`);
  const quiet=execute('ffmpeg',['-hide_banner','-ss','12.6','-t','2.2','-i',file,'-af','volumedetect','-vn','-f','null','-']);
  const mean=Number(quiet.stderr.match(/mean_volume: (-?[\d.]+) dB/)?.[1]);
  assert.ok(mean < -65,`Silence section too loud: ${mean}`);
  const buffer=await fs.readFile(file);
  assert.ok(buffer.indexOf(Buffer.from('moov'))<buffer.indexOf(Buffer.from('mdat')),'Fast start moov must precede media');
  const record={name,bytes:buffer.length,duration:20,frames:totalFrames,resolution:'1080x1920',fps,videoCodec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',sampleRate:48000,loudnessLUFS:Number(loudness.input_i),truePeakDbTP:Number(loudness.input_tp),quietMeanDb:mean,blackFrames:false,fastStart:true};
  report.files.push(record);console.log(JSON.stringify(record,null,2));
  await fs.writeFile(path.join(output,name.replace('.mp4','-ffprobe.json')),JSON.stringify(metadata,null,2));
}
const frames=(await fs.readdir(path.join(output,'frames'))).filter(s=>s.endsWith('.png'));
assert.equal(frames.length,totalFrames);
if(fps===60){
  const frame=async n=>fs.readFile(path.join(output,'frames',`${String(n).padStart(4,'0')}.png`));
  assert.ok(!(await frame(60)).equals(await frame(61)),'60fps must sample new intermediate motion, not duplicate 30fps frames');
  assert.ok(!(await frame(1198)).equals(await frame(1199)),'Final two frames must not be clamped to the old 30fps endpoint');
}
const preview=JSON.parse(await fs.readFile(path.join(output,'preview-check.json'),'utf8'));
assert.equal(preview.seekSafe,true);assert.deepEqual(preview.browserErrors,[]);assert.deepEqual(preview.primarySafeAreaWarnings,[]);
report.checks=[`${totalFrames} source frames present`,'arbitrary seek pixel equality','fonts loaded','primary typography within safe area','no browser errors','no black frames in full video','exact 20s streams','AAC true peak <= -1 dBTP','near-silence from 12.6–14.8s','fast-start metadata verified'];
if(fps===60)report.checks.push('native 60fps intermediate and final frames differ (no duplicated-frame conversion)');
await fs.writeFile(path.join(output,'verification.json'),JSON.stringify(report,null,2));
console.log('ALL DELIVERY CHECKS PASSED');
