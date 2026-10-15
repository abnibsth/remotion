import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSettings,requestAsset} from './render-settings.mjs';

test('preview query selects fps without becoming part of the asset filename',()=>{
  assert.equal(requestAsset('/?fps=60'),'index.html');
  assert.equal(requestAsset('/preview.js?v=1'),'preview.js');
});

test('30fps defaults preserve existing output paths',()=>{
  assert.deepEqual(renderSettings([]),{fps:30,totalFrames:600,directory:'out/notifikasi-overload',socialBitrate:'8000k',maxrate:'12000k',bufsize:'16000k'});
});
test('60fps renders 1200 native frames into a separate directory',()=>{
  const s=renderSettings(['--full','--fps=60']);
  assert.equal(s.fps,60);assert.equal(s.totalFrames,1200);
  assert.equal(s.directory,'out/notifikasi-overload-60fps');
  assert.equal((s.totalFrames-1)/s.fps,19.983333333333334);
  assert.equal(s.socialBitrate,'12000k');
});
test('unsupported frame rates are rejected',()=>{
  assert.throws(()=>renderSettings(['--fps=59']),/30 or 60/);
  assert.throws(()=>renderSettings(['--fps=invalid']),/30 or 60/);
});
