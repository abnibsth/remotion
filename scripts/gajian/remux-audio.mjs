import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const output=fileURLToPath(new URL('../../gajian-motion/output/',import.meta.url));
const social=path.join(output,'gajian-tiktok.mp4');
const temporary=path.join(output,'gajian-tiktok-audio-corrected.mp4');
const master=path.join(output,'gajian-master.mp4');
await Promise.all([fs.access(social),fs.access(master)]);
try{await fs.access(temporary);throw new Error('Correction target already exists; inspect it before rerunning.');}catch(error){if(error.code!=='ENOENT')throw error;}
const r=spawnSync('ffmpeg',['-hide_banner','-nostdin','-i',social,'-i',master,'-map','0:v:0','-map','1:a:0','-c','copy','-t','30','-movflags','+faststart',temporary],{stdio:'inherit'});
if(r.status!==0)throw new Error('Audio stream remux failed');
// Replace only after the corrected file was successfully closed by FFmpeg.
await fs.rename(temporary,social);
console.log('TikTok now uses the master AAC stream without an extra lossy generation.');
