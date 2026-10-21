import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const out='out/verve-commercial';
const files=['product-commercial-preview.mp4','product-commercial-final.mp4','product-commercial-contact-sheet.png','product-commercial-source.zip','product-commercial-prototype-7s.mp4','asset-manifest.json','production-qc-report.txt','verification.json'];
const rows=[];
for(const name of files){const buffer=await fs.readFile(path.join(out,name));rows.push({file:name,bytes:buffer.length,sha256:createHash('sha256').update(buffer).digest('hex')});}
await fs.writeFile(path.join(out,'delivery-manifest.json'),JSON.stringify({product:'MYKONOS Verve Extrait de Parfum 50 ml',files:rows},null,2));
for(const r of rows)console.log(`${r.file}: ${(r.bytes/1e6).toFixed(2)} MB`);
