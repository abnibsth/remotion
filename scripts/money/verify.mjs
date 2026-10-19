import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=path.join(root,'out/where-did-my-money-go');
const run=(bin,args)=>{const r=spawnSync(bin,args,{encoding:'utf8',maxBuffer:32*1024*1024,windowsHide:true});assert.equal(r.status,0,r.stderr);return r;};
const reports=[];
for(const name of ['master','preview','social']){
 const file=path.join(out,`where-did-my-money-go-${name}.mp4`);
 const metadata=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',file]).stdout);
 const v=metadata.streams.find(s=>s.codec_type==='video'),a=metadata.streams.find(s=>s.codec_type==='audio');
 assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(v.r_frame_rate,'60/1');assert.equal(Number(v.nb_read_frames),1200);
 assert.equal(v.codec_name,'h264');assert.equal(v.pix_fmt,'yuv420p');assert.equal(a.codec_name,'aac');assert.equal(a.sample_rate,'48000');
 assert.equal(Number(v.duration),20);assert.equal(Number(metadata.format.duration),20);
 assert.equal(v.color_primaries,'bt709');assert.equal(v.color_transfer,'iec61966-2-1');assert.equal(v.color_space,'bt709');assert.equal(v.color_range,'tv');
 const decoded=run('ffmpeg',['-hide_banner','-v','error','-i',file,'-f','null','-']);assert.equal(decoded.stderr.trim(),'');
 const loud=run('ffmpeg',['-hide_banner','-i',file,'-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-']).stderr;
 const measured=JSON.parse(loud.slice(loud.lastIndexOf('{'),loud.lastIndexOf('}')+1));
 assert.ok(Number(measured.input_tp)<=-1,`${name} AAC true peak ${measured.input_tp}`);
 assert.ok(Math.abs(Number(measured.input_i)+14)<.7,`${name} LUFS ${measured.input_i}`);
 // Catch white or black blank frames, including every frame of the comedic pause.
 const stats=run('ffmpeg',['-hide_banner','-i',file,'-vf','signalstats,metadata=print','-an','-f','null','-']).stderr;
 const mins=[...stats.matchAll(/lavfi.signalstats.YMIN=(\d+(?:\.\d+)?)/g)].map(m=>Number(m[1]));
 const maxs=[...stats.matchAll(/lavfi.signalstats.YMAX=(\d+(?:\.\d+)?)/g)].map(m=>Number(m[1]));
 assert.equal(mins.length,1200);assert.equal(maxs.length,1200);
 const blank=mins.map((n,i)=>maxs[i]-n<20?i:-1).filter(i=>i>=0);assert.deepEqual(blank,[]);
 const bytes=await fs.readFile(file);let offset=0,moov=-1,mdat=-1;
 while(offset+8<=bytes.length){let size=bytes.readUInt32BE(offset);const type=bytes.toString('ascii',offset+4,offset+8);if(size===1)size=Number(bytes.readBigUInt64BE(offset+8));if(type==='moov')moov=offset;if(type==='mdat')mdat=offset;if(size<8)break;offset+=size;}
 assert.ok(moov>=0&&mdat>moov,'faststart metadata');
 reports.push({file:path.basename(file),bytes:bytes.length,width:v.width,height:v.height,frames:Number(v.nb_read_frames),fps:v.r_frame_rate,duration:Number(v.duration),video:v.codec_name,pixelFormat:v.pix_fmt,audio:a.codec_name,sampleRate:Number(a.sample_rate),color:{primaries:v.color_primaries,transfer:v.color_transfer,matrix:v.color_space},loudness:measured,decode:'PASS',blankFrames:blank,faststart:true});
 console.log(`${name}: 1200 frames, 20s, 1080p60, full decode PASS; ${measured.input_i} LUFS / ${measured.input_tp} dBTP`);
}
const qc=JSON.parse(await fs.readFile(path.join(out,'visual-qc.json'),'utf8'));assert.equal(qc.errors.length,0);assert.ok(qc.seekSafe);
for(const c of qc.checks){assert.equal(c.badPaths,0);assert.deepEqual(c.overflow,[],`overflow at ${c.time}`);assert.ok(c.fonts.every(Boolean));}
await fs.writeFile(path.join(out,'verification.json'),JSON.stringify({passed:true,reports,visualQC:qc},null,2));
console.log('ALL DELIVERY CHECKS PASSED');
