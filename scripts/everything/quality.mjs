import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const out=path.resolve('out/everything-is-motion');
const video=path.join(out,'everything-is-motion-master.mp4');
function run(args,raw=false){const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error',...args],{encoding:raw?undefined:'utf8',maxBuffer:64*1024*1024,windowsHide:true});if(r.status!==0)throw new Error(String(r.stderr));return r.stdout;}
for(const [name,filter] of [
 ['final-contact-sheet.png','fps=1,scale=480:270,tile=4x5'],
 ['final-transition-audit.png',"select='eq(n,118)+eq(n,126)+eq(n,220)+eq(n,235)+eq(n,270)+eq(n,340)+eq(n,370)+eq(n,405)+eq(n,520)+eq(n,545)+eq(n,570)+eq(n,640)+eq(n,680)+eq(n,740)+eq(n,785)+eq(n,855)',scale=480:270,tile=4x4"],
 ['final-half-scale.png',"select='eq(n,600)',scale=960:540"],
 ['final-full-resolution.png',"select='eq(n,450)'"],
])run(['-y','-i',video,'-vf',filter,'-frames:v','1','-update','1',path.join(out,name)]);
const first=run(['-i',video,'-vf',"select='eq(n,0)'",'-frames:v','1','-f','rawvideo','-pix_fmt','rgb24','-'],true);
const last=run(['-i',video,'-vf',"select='eq(n,1199)'",'-frames:v','1','-f','rawvideo','-pix_fmt','rgb24','-'],true);
let total=0,max=0,count=0;
for(let i=0;i<first.length;i++){const d=Math.abs(first[i]-last[i]);total+=d;max=Math.max(max,d);if(d>3)count++;}
const report={encodedLoop:{meanAbsoluteChannelError:total/first.length,maxChannelError:max,channelFractionOver3:count/first.length},sourceLoop:'Byte-identical PNGs; independently checked in render and verify',checks:['Full-resolution encoded ribbon still','50% encoded still','20 time samples from encoded master','16 encoded transition checkpoints']};
await fs.writeFile(path.join(out,'visual-qc.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
