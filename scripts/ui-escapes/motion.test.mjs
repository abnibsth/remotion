import test from 'node:test';
import assert from 'node:assert/strict';
import {stateAt,folderAt,browserAt,cardAt,screenToWorld,OBJECTS,CARD_TIMES,PORTAL} from '../../src/UiEscapes/motion.mjs';

test('screen coordinates map to the exact monitor surface',()=>{
 assert.deepEqual(screenToWorld(0,0),[-3.05,5.61,.135]);
 const p=screenToWorld(1600,1000);assert.ok(Math.abs(p[0]-3.05)<1e-9);assert.ok(Math.abs(p[1]-1.79)<1e-9);
});
test('folder is one persistent identity, flat until anticipation and thick after exit',()=>{
 assert.deepEqual(folderAt(0).position,OBJECTS.folder.origin);
 assert.equal(folderAt(0).depth,.008);assert.ok(folderAt(4.7).depth>.18);
 assert.ok(folderAt(4.7).position[2]>1);assert.ok(folderAt(6.8).position[1]>.48);
});
test('folder and browser trajectories do not jump at choreography joins',()=>{
 for(const t of [3,3.7,4.5,5.55,6.05,6.55,7,13,13.5,17.6,18.2,20.65,21.2])for(const fn of [folderAt,browserAt]){
  const a=fn(t-1e-5),b=fn(t+1e-5);if(!a.visible||!b.visible)continue;const d=Math.hypot(...a.position.map((x,i)=>x-b.position[i]));assert.ok(d<.005,`${fn.name} at ${t}: ${d}`);
 }
});
test('cards are individually scheduled and return to a common portal',()=>{
 assert.equal(CARD_TIMES.length,11);
 for(let i=0;i<11;i++){assert.equal(cardAt(i,CARD_TIMES[i]-.01).visible,i===0);assert.equal(cardAt(i,15.99).visible,true);assert.equal(cardAt(i,21.3).visible,false);}
 assert.ok(PORTAL[1]>2);
});
test('all 1500 states are finite, deterministic and history independent',()=>{
 for(let f=0;f<1500;f++){
  const s=stateAt(f/60),v=JSON.stringify(s);assert.ok(!/null|NaN|Infinity/.test(v),`frame ${f}`);
  if(f%71===0){stateAt(22-f/100);assert.equal(JSON.stringify(stateAt(f/60)),v);}
 }
});
test('final desktop restores same monitor-plane object placement',()=>{
 assert.deepEqual(folderAt(25).position,folderAt(0).position);assert.deepEqual(browserAt(25).position,browserAt(0).position);
 const a=stateAt(0),b=stateAt(25);assert.deepEqual(a.camera,b.camera);assert.equal(b.portal.scale,0);
});
