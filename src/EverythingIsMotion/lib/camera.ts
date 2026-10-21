import {loopTime, mix, progress} from './motion';
export const cameraAt = (input: number) => {
  const t = loopTime(input);
  const orbit = progress(t,2,4)*(1-progress(t,5,6.6));
  const follow = progress(t,6,7.3)*(1-progress(t,8.8,9.65));
  const macro = progress(t,12.15,13.6)*(1-progress(t,15.15,16.6));
  const pass = Math.exp(-Math.pow((t-8.24)/.24,2));
  const impact = t>=9.65 && t<10.22 ? .035*Math.exp(-(t-9.65)*8)*Math.sin((t-9.65)*18) : 0;
  return {
    x: mix(orbit*26*Math.sin(t*.6)+follow*75*Math.sin((t-6)*1.25)+macro*45*Math.sin((t-12.1)*.8),Math.sin(Math.PI*1.08+(t-6)*.73)*490,pass),
    y: mix(follow*-45*Math.sin((t-6)*1.8),Math.sin(Math.PI*1.6-(t-6)*.7)*90,pass),
    zoom: 1+.08*progress(t,.1,1.2)*(1-progress(t,1.2,2))+.08*orbit+.1*follow+13*pass+.14*macro+impact,
    rotation: orbit*2*Math.sin(t*.7)+follow*mix(-8,8,progress(t,6,8.7))+macro*-4,
    perspective: 1600,
    target: [0,0],
    blur: 0,
  };
};
