import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const output=fileURLToPath(new URL('../../gajian-motion/v2/output/',import.meta.url));
const files=[];
for(const name of ['gajian-v2-preview.mp4','gajian-v2-final.mp4','gajian-v2-contact-sheet.png','gajian-v2-editable-source.zip']){const data=await fs.readFile(path.join(output,name));files.push({name,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}
await fs.writeFile(path.join(output,'delivery-manifest.json'),JSON.stringify({files},null,2));console.log(files);
