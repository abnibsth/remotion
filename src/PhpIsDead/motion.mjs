export const stampTimes = [3.10, 4.40, 5.48, 6.36, 7.05];
export const clamp = (v, a=0, b=1) => Math.min(b, Math.max(a,v));
export const hash = n => {const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
export const spring = (t, frequency=18, damping=11) => t<=0?0:1-Math.exp(-damping*t)*(Math.cos(frequency*t)+damping/frequency*Math.sin(frequency*t));
export const smooth = t => {const v=clamp(t);return v*v*(3-2*v);};
export const sceneAt = t => t<3?0:t<8?1:t<10?2:t<14?3:t<18?4:5;
export const motion = t => ({time:t,scene:sceneAt(t),push:1+.014*t,shakeX:shake(t,.12)+shake(t,1,4)+shake(t,1.58,6),shakeY:shake(t,.12,4,38)+shake(t,1.58,5,32)});
export const shake = (t,at,amp=7,freq=43) => t<at?0:amp*Math.exp(-14*(t-at))*Math.sin(freq*(t-at));
