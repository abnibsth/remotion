export function validateNarrationPlan(plan){
 let end=0;
 for(const p of plan){
  if(![p.start,p.end,p.at,p.tempo].every(Number.isFinite)||p.start<0||p.end<=p.start||p.at<0||p.tempo<.5||p.tempo>2)throw Error('Invalid narration clip');
  if(p.at<end-1e-6)throw Error('Narration phrases overlap');
  end=p.at+(p.end-p.start)/p.tempo;
  if(end>20)throw Error('Narration exceeds film duration');
 }
 return true;
}
export function clipFilter(p){
 return `aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,atrim=start=${p.start}:end=${p.end},asetpts=PTS-STARTPTS,atempo=${p.tempo},afade=t=in:d=0.004,afade=t=out:st=${Math.max(0,(p.end-p.start)/p.tempo-.012)}:d=0.012`;
}
export function buildNarrationFilter(plan){
 validateNarrationPlan(plan);
 const split=`[0:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,asplit=${plan.length}${plan.map((_,i)=>`[s${i}]`).join('')}`;
 const clips=plan.map((p,i)=>{
  const duration=(p.end-p.start)/p.tempo;
  return `[s${i}]atrim=start=${p.start}:end=${p.end},asetpts=PTS-STARTPTS,atempo=${p.tempo},afade=t=in:d=0.004,afade=t=out:st=${Math.max(0,duration-.012)}:d=0.012,adelay=${Math.round(p.at*48000)}S:all=1[c${i}]`;
 });
 return [split,...clips,`${plan.map((_,i)=>`[c${i}]`).join('')}amix=inputs=${plan.length}:normalize=0,apad=whole_dur=20,atrim=duration=20[out]`].join(';');
}
