// Downloads curated Unsplash photos into public/images with verification.
// Each slot tries candidates in order; first valid JPEG wins. Idempotent: skips existing files.
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const base = path.join(root, 'public/images');

const slots = {
  'products/kopi-nusantara': ['photo-1447933601403-0c6688de566e', 'photo-1498757581582-c4469cce39d5', 'photo-1611854779393-1b2da9d400fe'],
  'products/keripik-pisang': ['photo-1606313564200-e75d5e30476c', 'photo-1599490659213-e2b9527bd087', 'photo-1566478989037-eec170784d0b', 'photo-1613919113640-25732ec5e61f'],
  'products/sambal': ['photo-1583224964978-2257b960c3d3', 'photo-1583258292688-d0213dc5a3a8', 'photo-1526346698789-22fd84314424'],
  'products/tote-bag': ['photo-1591561954557-26941169b49e', 'photo-1590874103328-eac38a683ce7', 'photo-1566150905458-1bf1fc113f0d', 'photo-1553062407-98eeb64c6a62'],
  'products/kerajinan-rotan': ['photo-1595437193398-f24279553f4f', 'photo-1596079890744-c1a0462d0975', 'photo-1616486338812-3dadae4b4ace', 'photo-1601366533287-5ee4c763ae4e'],
  'products/lilin': ['photo-1602874801007-bd458bb1b8b6', 'photo-1603006905003-be475563bc59', 'photo-1571115177098-24ec42ed204d'],
  'products/tas-anyaman': ['photo-1548036328-c9fa89d128fa', 'photo-1590874103328-eac38a683ce7', 'photo-1566150905458-1bf1fc113f0d'],
  'products/kaos': ['photo-1521572163474-6864f9cf17ab', 'photo-1523381210434-271e8be1f52b'],
  'products/madu': ['photo-1587049352846-4a222e784d38', 'photo-1558642452-9d2a7deb7f62', 'photo-1471943311424-646960669fbc'],
  'products/cokelat': ['photo-1511381939415-e44015466834', 'photo-1549007994-cb92caebd54b', 'photo-1606312619070-d48b4c652a52'],
  'products/sabun': ['photo-1600857544200-b2f666a9a2ec', 'photo-1600180758890-6b94519a8ba6', 'photo-1607006344380-b6775a0824a7'],
  'products/keramik': ['photo-1610701596007-11502861dcfa', 'photo-1578749556568-bc2c40e68b61', 'photo-1565193566173-7a0ee3dbe261', 'photo-1493106641515-6b5631de4bb9'],
  'categories/makanan': ['photo-1504674900247-0877df9cc836', 'photo-1467003909585-2f8a72700288'],
  'categories/fashion': ['photo-1441986300917-64674bd600d8', 'photo-1489987707025-afc232f7ea0f'],
  'categories/kerajinan': ['photo-1513364776144-60967b0f800f', 'photo-1452860606245-08befc0ff44b'],
  'categories/kecantikan': ['photo-1596462502278-27bfdc403348', 'photo-1522335789203-aabd1fc54bc9'],
  'categories/dekorasi': ['photo-1493663284031-b7e3aefcae8e', 'photo-1524758631624-e2822e304c36'],
  'categories/ramah-lingkungan': ['photo-1542601906990-b4d3fb778b09', 'photo-1441974231531-c6227db76b6e'],
  'stories/pengrajin': ['photo-1452860606245-08befc0ff44b', 'photo-1416879595882-3373a0480b5b'],
  'stories/kopi': ['photo-1495474472287-4d71bcdd2085', 'photo-1509042239860-f550ce710b93'],
  'stories/dapur': ['photo-1556910103-1c02745aae4d', 'photo-1466637574441-749b8f19452f'],
  'stories/studio': ['photo-1441984904996-e0b6ba687e04', 'photo-1523381210434-271e8be1f52b'],
};

const isImage = (buf) =>
  (buf[0] === 0xff && buf[1] === 0xd8) || // jpeg
  (buf[0] === 0x89 && buf[1] === 0x50) || // png
  buf.slice(0, 4).toString() === 'RIFF'; // webp

async function fetchOne(id) {
  const url = `https://images.unsplash.com/${id}?w=1000&q=80&fm=jpg&fit=crop`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 20000) throw new Error(`too small (${buf.length}B)`);
  if (!isImage(buf)) throw new Error('not an image');
  return buf;
}

const result = {};
for (const [slot, candidates] of Object.entries(slots)) {
  const file = path.join(base, `${slot}.jpg`);
  try {
    await fs.access(file);
    result[slot] = 'exists';
    continue;
  } catch { /* needs download */ }
  await fs.mkdir(path.dirname(file), { recursive: true });
  let done = false;
  for (const id of candidates) {
    try {
      const buf = await fetchOne(id);
      await fs.writeFile(file, buf);
      result[slot] = id;
      done = true;
      break;
    } catch (e) {
      console.error(`  miss ${slot} <- ${id}: ${e.message}`);
    }
  }
  if (!done) result[slot] = 'FAILED';
  console.log(slot, '=>', result[slot]);
}
await fs.writeFile(path.join(base, 'manifest.json'), JSON.stringify(result, null, 2));
const failed = Object.entries(result).filter(([, v]) => v === 'FAILED');
console.log('\nDONE. failed:', failed.length ? failed.map(([k]) => k).join(', ') : 'none');
