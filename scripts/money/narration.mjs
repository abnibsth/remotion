import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {NARRATION_SOURCE,NARRATION_PLAN} from './narration-plan.mjs';
import {clipFilter,validateNarrationPlan} from './narration-utils.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url)),dir=path.join(root,'public/money/audio'),out=path.join(root,'out/where-did-my-money-go');
function run(args){const r=spawnSync('ffmpeg',['-hide_banner','-nostdin','-y',...args],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024,windowsHide:true});if(r.status!==0)throw Error(r.stderr);return r.stderr;}
const measurement=log=>JSON.parse(log.slice(log.lastIndexOf('{'),log.lastIndexOf('}')+1));
const raw=path.join(dir,'narration-edited.wav'),voice=path.join(dir,'narration-aligned.wav'),premix=path.join(dir,'narrated-premix.wav'),mix=path.join(dir,'soundtrack-narrated.wav');
validateNarrationPlan(NARRATION_PLAN);
// Materialize phrase WAVs independently: this FFmpeg build prematurely ends an
// asplit -> atrim -> amix graph when several branches share a compressed input.
const clips=[];
for(let i=0;i<NARRATION_PLAN.length;i++){
 const file=path.join(dir,`narration-phrase-${i}.wav`);
 run(['-i',NARRATION_SOURCE,'-af',clipFilter(NARRATION_PLAN[i]),'-c:a','pcm_s24le',file]);clips.push(file);
}
const delayed=NARRATION_PLAN.map((p,i)=>`[${i}:a]adelay=${Math.round(p.at*48000)}S:all=1[c${i}]`).join(';');
run([...clips.flatMap(f=>['-i',f]),'-filter_complex',`${delayed};${clips.map((_,i)=>`[c${i}]`).join('')}amix=inputs=${clips.length}:normalize=0,apad=whole_dur=20,atrim=duration=20[out]`,'-map','[out]','-c:a','pcm_s24le',raw]);
const check=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','json',raw],{encoding:'utf8'});
assert.equal(Number(JSON.parse(check.stdout).format.duration),20,'Edited narration must be 20 seconds');
const voiceTarget='loudnorm=I=-16:TP=-3:LRA=8';
const vm=measurement(run(['-i',raw,'-af',voiceTarget+':print_format=json','-f','null','-']));
const pass=(target,m)=>target+`:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=json`;
run(['-i',raw,'-af',pass(voiceTarget,vm),'-ar','48000','-c:a','pcm_s24le',voice]);
// A separate broad envelope lowers the score through each phrase. Sidechain
// compression adds syllable-level ducking without changing the narrated source.
const duck=NARRATION_PLAN.map(p=>{const a=Math.max(0,p.at-.08),b=p.at+(p.end-p.start)/p.tempo+.14;return `between(t,${a},${b})`;}).join('+');
const graph=`[0:a]volume='if(gt(${duck},0),0.22,0.58)':eval=frame[music];[1:a]asplit=2[control][voice];[music][control]sidechaincompress=threshold=0.025:ratio=4:attack=12:release=180:makeup=1[ducked];[ducked][voice]amix=inputs=2:normalize=0,apad=whole_dur=20,atrim=duration=20[out]`;
run(['-i',path.join(dir,'soundtrack.wav'),'-i',voice,'-filter_complex',graph,'-map','[out]','-ar','48000','-c:a','pcm_s24le',premix]);
const target='loudnorm=I=-14:TP=-1.7:LRA=9',first=measurement(run(['-i',premix,'-af',target+':print_format=json','-f','null','-']));
run(['-i',premix,'-af',pass(target,first),'-ar','48000','-c:a','pcm_s24le',mix]);
const final=measurement(run(['-i',mix,'-af',target+':print_format=json','-f','null','-']));
assert.ok(Math.abs(Number(final.input_i)+14)<.5);assert.ok(Number(final.input_tp)<=-1);
const reports=[];
for(const name of ['master','preview','social']){
 const source=path.join(out,`where-did-my-money-go-${name}.mp4`),dest=path.join(out,`where-did-my-money-go-${name}-vo.mp4`);
 run(['-i',source,'-i',mix,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-t','20','-movflags','+faststart',dest]);
 const measured=measurement(run(['-i',dest,'-af',target+':print_format=json','-f','null','-']));
 assert.ok(Number(measured.input_tp)<=-1,`${name} AAC peak`);
 assert.ok(Math.abs(Number(measured.input_i)+14)<.5);
 const p=spawnSync('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',dest],{encoding:'utf8',windowsHide:true});assert.equal(p.status,0,p.stderr);
 const meta=JSON.parse(p.stdout),v=meta.streams.find(s=>s.codec_type==='video'),a=meta.streams.find(s=>s.codec_type==='audio');
 assert.equal(Number(v.nb_read_frames),1200);assert.equal(v.r_frame_rate,'60/1');assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(Number(meta.format.duration),20);assert.equal(a.sample_rate,'48000');
 run(['-v','error','-i',dest,'-f','null','-']);
 reports.push({file:path.basename(dest),frames:1200,duration:20,fps:60,width:1920,height:1080,audio:a.codec_name,sampleRate:48000,loudness:measured,fullDecode:true});
 console.log(`${name}-vo: ${measured.input_i} LUFS / ${measured.input_tp} dBTP; 1200 frames, 20 seconds`);
}
await fs.writeFile(path.join(out,'narration-report.json'),JSON.stringify({source:NARRATION_SOURCE,sourceDuration:15.72575,plan:NARRATION_PLAN,firstPhraseTempo:1.12,mixLoudness:final,scoreGainDuringPhrases:.22,scoreGainBetweenPhrases:.58,sidechain:true,exports:reports},null,2));
console.log('Narration aligned, score ducked, all VO exports verified. Original no-VO files preserved.');
