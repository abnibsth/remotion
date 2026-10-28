// Fetch small candidate photos per slot for visual review.
import fs from 'node:fs/promises';
import path from 'node:path';

const base = path.join(path.resolve(import.meta.dirname, '..'), 'public/images/_cand');

const pool = {
  keripik: ['photo-1599490659213-e2b9527bd087', 'photo-1566478989037-eec170784d0b', 'photo-1613919113640-25732ec5e61f', 'photo-1571771894821-ce9b6c11b08e', 'photo-1603596310923-dbb137b9a6a1', 'photo-1526951521990-620dc14c214b'],
  sambal: ['photo-1583258292688-d0213dc5a3a8', 'photo-1526346698789-22fd84314424', 'photo-1509358271058-acd22cc93898', 'photo-1596040033229-a9821ebd058d'],
  rotan: ['photo-1596079890744-c1a0462d0975', 'photo-1616486338812-3dadae4b4ace', 'photo-1601366533287-5ee4c763ae4e', 'photo-1544457070-4cd773b4d71e', 'photo-1584589167171-541ce45f1eea', 'photo-1590736969955-71cc94901144'],
  tas: ['photo-1590874103328-eac38a683ce7', 'photo-1566150905458-1bf1fc113f0d', 'photo-1594223274512-ad4803739b7c', 'photo-1559563458-527698bf5295', 'photo-1590739225287-bd31519780c3', 'photo-1548863227-3af567fc3b27'],
  madu: ['photo-1558642452-9d2a7deb7f62', 'photo-1471943311424-646960669fbc', 'photo-1585155770447-2f66e2a397b5', 'photo-1550411294-56f7d0c7fbe6'],
  tote: ['photo-1544816155-12df9643f363', 'photo-1597484662316-9f9dbfbdf00d', 'photo-1548863227-3af567fc3b27', 'photo-1594223274512-ad4803739b7c'],
};

for (const [slot, ids] of Object.entries(pool)) {
  await fs.mkdir(path.join(base, slot), { recursive: true });
  for (const [i, id] of ids.entries()) {
    try {
      const res = await fetch(`https://images.unsplash.com/${id}?w=400&q=70&fm=jpg&fit=crop`, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(path.join(base, slot, `${i}-${id}.jpg`), buf);
      console.log(slot, i, id, `${(buf.length / 1024) | 0}KB`);
    } catch (e) {
      console.log(slot, i, id, 'FAIL', e.message);
    }
  }
}
