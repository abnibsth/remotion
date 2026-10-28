import test from 'node:test';
import assert from 'node:assert/strict';
import {folderAt,browserAt,cardAt,OBJECTS,CARD_TIMES} from '../../src/UiEscapes/motion.mjs';

test('restored folder is flat, contact rests above the desk',()=>{
 for(const t of [0,2.3,22,25])assert.equal(folderAt(t).depth,.008);
 for(let f=333;f<1056;f++){const p=folderAt(f/60);assert.ok(p.position[1]-.56*p.scale[1]>=-.025,`folder penetrates desk frame ${f}`);}
});
test('browser is undeformed on monitor and content-bearing during peel',()=>{
 assert.equal(browserAt(6.99).peel,0);assert.ok(browserAt(8.5).peel>.3);assert.equal(browserAt(22).peel,0);
 assert.deepEqual(browserAt(0).position,OBJECTS.browser.origin);
});
test('first notification develops on screen before it detaches',()=>{
 const a=cardAt(0,10.99),b=cardAt(0,11.1),c=cardAt(0,11.2);
 assert.equal(a.visible,false);assert.equal(b.visible,true);assert.equal(c.visible,true);assert.deepEqual(b.position,c.position);
});
test('notification launch is position-continuous with the display plane',()=>{
 for(let i=0;i<CARD_TIMES.length;i++){
  assert.deepEqual(cardAt(i,CARD_TIMES[i]).position,OBJECTS.notification.origin);
  const p=cardAt(i,CARD_TIMES[i]+.0001);assert.ok(Math.hypot(...p.position.map((x,j)=>x-OBJECTS.notification.origin[j]))<.002);
 }
});
test('vortex path begins without card teleportation',()=>{
 for(let i=0;i<11;i++){const t=17.02+i*.067,a=cardAt(i,t-.00001),b=cardAt(i,t+.00001);assert.ok(Math.hypot(...a.position.map((x,j)=>x-b.position[j]))<.002);}
});
test('cards resting at overlapping footprints occupy separate stack levels',()=>{
 const cards=Array.from({length:11},(_,i)=>cardAt(i,16.4));
 for(let i=0;i<11;i++)for(let j=i+1;j<11;j++){
  const a=cards[i],b=cards[j],dx=Math.abs(a.position[0]-b.position[0]),dz=Math.abs(a.position[2]-b.position[2]);
  if(dx<1.55&&dz<.52)assert.ok(Math.abs(a.position[1]-b.position[1])>=.058,`cards ${i}/${j} overlap at equal height`);
 }
});
