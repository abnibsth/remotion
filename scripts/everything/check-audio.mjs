import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
const files=['public/everything-is-motion/audio/soundscape.wav','out/everything-is-motion/everything-is-motion-master.mp4','out/everything-is-motion/everything-is-motion-social.mp4'];
const reports=[];
for(const file of files){const r=spawnSync('ffmpeg',['-hide_banner','-i',file,'-vn','-af','loudnorm=I=-14:TP=-1:LRA=11:print_format=json','-f','null','-'],{encoding:'utf8'});const match=r.stderr.match(/\{\s*"input_i"[\s\S]*?\}/);reports.push({file,status:r.status,data:match?JSON.parse(match[0]):r.stderr.slice(-500)});}
await fs.writeFile('out/everything-is-motion/audio-diagnosis.json',JSON.stringify(reports,null,2));
console.log('Wrote audio-diagnosis.json');
