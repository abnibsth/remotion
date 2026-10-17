import assert from 'node:assert/strict';
import {test} from 'node:test';
import {build} from 'esbuild';
import {pathToFileURL} from 'node:url';
import {mkdir} from 'node:fs/promises';

await mkdir('.cache/everything-tests', {recursive: true});
await build({entryPoints: ['src/EverythingIsMotion/lib/film.ts'], outfile: '.cache/everything-tests/film.mjs', bundle: true, platform: 'node', format: 'esm'});
const {stateAt, geometryAt, cameraAt, svgAt, ribbonEdges, resampleClosed} = await import(pathToFileURL(`${process.cwd()}/.cache/everything-tests/film.mjs`));

test('all 1200 frames have finite, visible geometry', () => {
  for (let frame = 0; frame < 1200; frame++) {
    const geometry = geometryAt(frame / 60);
    assert.ok(geometry.length > 0, `missing frame ${frame}`);
    assert.ok(geometry.flat(2).every(Number.isFinite), `non-finite frame ${frame}`);
    const markup = svgAt(frame / 60);
    assert.ok(!/NaN|undefined|Infinity/.test(markup), `bad SVG at ${frame}`);
  }
});

test('seek is independent of evaluation order', () => {
  const before = svgAt(9.6);
  for (const t of [19, 0, 14.3, 3.1, 8.9]) svgAt(t);
  assert.equal(svgAt(9.6), before);
});

test('opening and closing state and camera match exactly', () => {
  assert.deepEqual(stateAt(20), stateAt(0));
  assert.deepEqual(geometryAt(20), geometryAt(0));
  assert.deepEqual(cameraAt(20), cameraAt(0));
  assert.equal(svgAt(1199 / 60), svgAt(0));
});

test('camera and geometry stay continuous across morph boundaries', () => {
  for (const t of [1.2, 2, 3.7, 4.12, 5.75, 6.85, 8.7, 9.65, 10.22, 10.7, 11.12, 11.6, 12.1, 13.6, 15.15, 16.4, 18.6, 19.5]) {
    const a = geometryAt(t - 0.00001).flat(2);
    const b = geometryAt(t + 0.00001).flat(2);
    assert.equal(a.length, b.length, `topology at ${t}`);
    assert.ok(Math.max(...a.map((v, i) => Math.abs(v - b[i]))) < 2, `geometry discontinuity at ${t}`);
    const ca = cameraAt(t - 0.00001), cb = cameraAt(t + 0.00001);
    for (const key of ['x', 'y', 'zoom', 'rotation']) assert.ok(Math.abs(ca[key] - cb[key]) < 0.01, `camera ${key} at ${t}`);
  }
});

test('closed contour normalization preserves count and ordering', () => {
  const p = resampleClosed([[0,0], [100,0], [100,100], [0,100]], 64);
  assert.equal(p.length, 64);
  assert.deepEqual(p[0], [0,0]);
  assert.ok(p.flat().every(Number.isFinite));
});

test('line bending preserves its horizontal extent without collapsing', () => {
  for (const t of [1.99, 2, 2.05, 2.1, 2.2, 2.3]) {
    const p = geometryAt(t)[0];
    const width = Math.max(...p.map(v=>v[0])) - Math.min(...p.map(v=>v[0]));
    assert.ok(width > 750, `line collapses at ${t}: ${width}`);
  }
});

test('circle inflation remains centered with one shrinking counter', () => {
  for (const t of [3.8, 4.12, 4.5, 4.8, 5.1, 5.5]) {
    const p=geometryAt(t)[0];
    const xs=p.map(v=>v[0]), ys=p.map(v=>v[1]);
    assert.ok(Math.abs(Math.min(...xs)+Math.max(...xs)) < 2);
    assert.ok(Math.abs(Math.min(...ys)+Math.max(...ys)) < 2);
  }
});

test('ribbon edges use bounded normals and deterministic width', () => {
  const edges = ribbonEdges(7.5, 100);
  assert.equal(edges.length, 200);
  assert.ok(edges.flat().every(Number.isFinite));
  assert.deepEqual(edges, ribbonEdges(7.5, 100));
});
