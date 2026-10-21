import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=path.join(root,'out/verve-commercial');
const run=(bin,args)=>{const r=spawnSync(bin,args,{encoding:'utf8',maxBuffer:32*1024*1024,windowsHide:true});assert.equal(r.status,0,r.stderr);return r;};
const reports=[];
for(const name of ['final','preview']){
 const file=path.join(out,`product-commercial-${name}.mp4`),metadata=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',file]).stdout);
 const v=metadata.streams.find(s=>s.codec_type==='video'),a=metadata.streams.find(s=>s.codec_type==='audio');
 assert.equal(v.width,1920);assert.equal(v.height,1080);assert.equal(v.r_frame_rate,'60/1');assert.equal(Number(v.nb_read_frames),1200);assert.equal(Number(metadata.format.duration),20);
 assert.equal(v.codec_name,'h264');assert.equal(v.pix_fmt,'yuv420p');assert.equal(a.codec_name,'aac');assert.equal(a.sample_rate,'48000');assert.equal(a.channels,2);
 assert.equal(v.color_primaries,'bt709');assert.equal(v.color_transfer,'iec61966-2-1');assert.equal(v.color_space,'bt709');
 const decoded=run('ffmpeg',['-hide_banner','-v','error','-i',file,'-f','null','-']);assert.equal(decoded.stderr.trim(),'');
 const log=run('ffmpeg',['-hide_banner','-i',file,'-af','loudnorm=I=-14:TP=-1:LRA=8:print_format=json','-f','null','-']).stderr;
 const audio=JSON.parse(log.slice(log.lastIndexOf('{'),log.lastIndexOf('}')+1));assert.ok(Number(audio.input_tp)<=-1);assert.ok(Math.abs(Number(audio.input_i)+14)<.7);
 const stats=run('ffmpeg',['-hide_banner','-i',file,'-vf','signalstats,metadata=print','-an','-f','null','-']).stderr;
 const min=[...stats.matchAll(/lavfi.signalstats.YMIN=(\d+(?:\.\d+)?)/g)].map(m=>Number(m[1])),max=[...stats.matchAll(/lavfi.signalstats.YMAX=(\d+(?:\.\d+)?)/g)].map(m=>Number(m[1]));
 assert.equal(min.length,1200);assert.equal(max.length,1200);const blank=min.map((x,i)=>max[i]-x<15?i:-1).filter(i=>i>=0);assert.deepEqual(blank,[]);
 const bytes=await fs.readFile(file);let offset=0,moov=-1,mdat=-1;while(offset+8<=bytes.length){let size=bytes.readUInt32BE(offset);if(size===1)size=Number(bytes.readBigUInt64BE(offset+8));const type=bytes.toString('ascii',offset+4,offset+8);if(type==='moov')moov=offset;if(type==='mdat')mdat=offset;if(size<8)break;offset+=size;}assert.ok(moov>=0&&mdat>moov);
 reports.push({file:path.basename(file),bytes:bytes.length,frames:1200,duration:20,fps:60,width:1920,height:1080,codec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',sampleRate:48000,loudness:audio,blankFrames:blank,fullDecode:true,faststart:true,color:{primaries:v.color_primaries,transfer:v.color_transfer,matrix:v.color_space}});
 console.log(`${name}: 1200 frames; 20s; 1080p60; ${audio.input_i} LUFS / ${audio.input_tp} dBTP; decode PASS`);
}
const qc=JSON.parse(await fs.readFile(path.join(out,'visual-qc.json'),'utf8'));assert.ok(qc.seekSafe);assert.deepEqual(qc.errors,[]);for(const c of qc.checks){assert.equal(c.invalidPaths,0);assert.ok(c.fontReady);assert.deepEqual(c.overflow,[]);}
await fs.copyFile(path.join(root,'public/product-commercial/verve/asset-manifest.json'),path.join(out,'asset-manifest.json'));
await fs.writeFile(path.join(out,'verification.json'),JSON.stringify({passed:true,reports,visualQC:qc},null,2));console.log('ALL PRODUCT COMMERCIAL CHECKS PASSED');
