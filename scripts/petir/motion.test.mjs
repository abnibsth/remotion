import test from 'node:test';import assert from 'node:assert/strict';import {build} from 'esbuild';import {pathToFileURL} from 'node:url';import path from 'node:path';
const outfile=path.resolve('.cache/petir-tests/motion.mjs');await build({entryPoints:['src/Petir/lib/motion.ts'],outfile,bundle:true,platform:'node',format:'esm'});const m=await import(pathToFileURL(outfile));
test('30 seconds equals 1800 frames',()=>assert.equal(m.DURATION*m.FPS,1800));
test('leader advances downward, streamer upward, return stroke upward only after connection',()=>{assert.ok(m.leaderY(21)<m.leaderY(23));assert.ok(m.streamerY(23.1)>m.streamerY(23.4));assert.equal(m.strokeProgress(23.3),0);assert.ok(m.returnY(23.52)>m.returnY(23.75));});
test('lightning geometry is seeded stable and stays finite',()=>{const a=m.channel();m.channel();assert.deepEqual(m.channel(),a);assert.ok(a.length>18);for(const p of a)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));});
test('flash exposure is bounded and does not strobe',()=>{for(let i=0;i<1800;i++)assert.ok(m.flash(i/60)>=0&&m.flash(i/60)<=.34);});
test('small ice rises faster than graupel in the illustrated updraft',()=>{const a=m.particle(0,4,'ice'),b=m.particle(0,5,'ice'),c=m.particle(0,4,'graupel'),d=m.particle(0,5,'graupel');assert.ok(b.y-a.y<d.y-c.y);});
test('camera and lightning states are independent of frame history',()=>{const a=m.camera(15);m.camera(29);m.camera(1);assert.deepEqual(m.camera(15),a);for(let i=0;i<1800;i++)assert.ok(Object.values(m.camera(i/60)).every(Number.isFinite));});
