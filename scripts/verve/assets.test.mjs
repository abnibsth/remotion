import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const dir='public/product-commercial/verve';
test('every approved photographic asset matches its provenance hash and recorded dimensions',async()=>{
 const manifest=JSON.parse(await fs.readFile(path.join(dir,'asset-manifest.json'),'utf8'));
 assert.equal(manifest.product.brand,'MYKONOS');assert.equal(manifest.product.variant,'Verve');
 assert.ok(manifest.permission.includes('explicitly confirmed'));
 for(const asset of manifest.assets){
  const buffer=await fs.readFile(path.join(dir,asset.file));
  assert.equal(createHash('sha256').update(buffer).digest('hex'),asset.sha256);
  assert.equal(buffer.readUInt32BE(16),asset.width);assert.equal(buffer.readUInt32BE(20),asset.height);
 }
 assert.ok(manifest.excluded_claims.includes('fragrance notes'));
});
