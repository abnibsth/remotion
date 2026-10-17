import {geometryAt, contourPath} from './geometry';
import {cameraAt} from './camera';
import {colorMix, loopTime, mix, progress} from './motion';
export {geometryAt, resampleClosed, ribbonEdges} from './geometry';
export {cameraAt} from './camera';
export const PALETTE = {dark:'#111216',paper:'#F0ECE4',red:'#F05A3F',blue:'#4768F5'};

export const stateAt = (input:number) => {
  const t=loopTime(input);
  const light=progress(t,8.05,8.45)*(1-progress(t,15.6,16.8));
  const cobalt=progress(t,14.7,16.5)*(1-progress(t,18,18.6));
  const ceramic=progress(t,4.1,4.9)*(1-progress(t,8.7,9.65))+progress(t,12.1,13.6)*(1-progress(t,18.1,18.6));
  return {t, background:colorMix(PALETTE.dark,PALETTE.paper,light),color:colorMix(PALETTE.red,PALETTE.blue,cobalt),light,ceramic};
};

export const svgAt = (input:number) => {
  const time = loopTime(input);
  const s=stateAt(time>=19.5 ? 0 : time), {t}=s, c=cameraAt(t), geometry=geometryAt(t);
  const d=geometry.filter(p=>p.some(v=>Math.abs(v[0]-p[0][0])+Math.abs(v[1]-p[0][1])>.001)).map(contourPath).join('');
  const objectPaths = Array.from({length:12},(_,slot)=>geometry.slice(slot*3,slot*3+3).filter(p=>p.some(v=>Math.abs(v[0]-p[0][0])+Math.abs(v[1]-p[0][1])>.001)).map(contourPath).join('')).filter(Boolean);
  const objectMarkup = (material:string, extra='') => objectPaths.map(path=>`<path d="${path}" fill="${material}" fill-rule="evenodd" ${extra}/>`).join('');
  const kind = t<2?'01 / ORIGIN':t<4.12?'02 / CURVATURE':t<5.75?'03 / VOLUME':t<9.65?'04 / CONTINUUM':t<12.1?'05 / LANGUAGE':t<15.15?'06 / SURFACE TENSION':t<18.6?'07 / REDUCTION':'01 / ORIGIN';
  const furniture = progress(t,.4,1)*(1-progress(t,18.6,19.25));
  const ink = colorMix(PALETTE.paper,PALETTE.dark,s.light);
  const letters=t>=9.65&&t<12.1;
  const highlightX = mix(-90,80,progress(t,4.2,6)) + Math.sin(t*.8)*35;
  const spec = s.ceramic;
  const fill = spec>.00001?'url(#ceramic)':s.color;
  const rotation = (progress(t,13.6,15.15)*12-progress(t,15.15,16.4)*12);
  const scaleImpact= t>=9.65 && t<10.22 ? 1+.016*Math.sin((t-9.65)*19)*Math.exp(-(t-9.65)*7):1;
  const secondary = progress(t,3.3,3.95)*(1-progress(t,4.8,5.5));
  const wave=progress(t,17.1,17.9);
  const shadow = progress(t,4.1,5.1)*(1-progress(t,8.1,8.7))+progress(t,12.5,14)*(1-progress(t,17.1,18.1));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label="EVERYTHING IS MOTION — ${kind}">
  <defs>
    <radialGradient id="ceramic" gradientUnits="userSpaceOnUse" cx="${highlightX}" cy="-115" r="${t>=12.1&&t<16.4?650:mix(390,56,progress(t,16.4,18.6))}">
      <stop offset="0" stop-color="${colorMix(s.color,PALETTE.paper,.58*spec)}"/>
      <stop offset=".29" stop-color="${colorMix(s.color,PALETTE.paper,.13*spec)}"/>
      <stop offset=".64" stop-color="${s.color}"/>
      <stop offset=".9" stop-color="${colorMix(s.color,PALETTE.dark,.63*spec)}"/>
      <stop offset="1" stop-color="${colorMix(s.color,PALETTE.dark,.8*spec)}"/>
    </radialGradient>
    <linearGradient id="ribbonLight" x1="0" y1="0" x2="1" y2=".4" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="${PALETTE.dark}" stop-opacity=".45"/>
      <stop offset=".22" stop-color="${PALETTE.paper}" stop-opacity=".42"/>
      <stop offset=".4" stop-color="${s.color}" stop-opacity="0"/>
      <stop offset=".68" stop-color="${PALETTE.dark}" stop-opacity=".5"/>
      <stop offset=".84" stop-color="${PALETTE.paper}" stop-opacity=".36"/>
      <stop offset="1" stop-color="${PALETTE.dark}" stop-opacity=".25"/>
    </linearGradient>
    <filter id="softShadow" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="22"/></filter>
    <clipPath id="object"><path d="${d}" fill-rule="evenodd"/></clipPath>
  </defs>
  <rect width="1920" height="1080" fill="${s.background}"/>
  <g transform="translate(960 540) scale(${c.zoom}) rotate(${c.rotation}) translate(${-c.x} ${-c.y})">
    ${shadow>.001?`<ellipse cx="20" cy="337" rx="${mix(210,390,progress(t,6,7))}" ry="15" fill="${PALETTE.dark}" opacity="${.2*shadow}" filter="url(#softShadow)"/>`:''}
    ${secondary>.001?`<ellipse cx="0" cy="0" rx="${268+6*Math.sin(t)}" ry="${242-20*progress(t,3.3,4.8)}" fill="none" stroke="${PALETTE.red}" stroke-width="1.2" opacity="${secondary*.45}" transform="rotate(-12)"/>`:''}
    <g transform="rotate(${rotation}) scale(${scaleImpact})">
      ${objectMarkup(fill)}
      ${t>5.75&&t<9.65?`<path d="${d}" fill="url(#ribbonLight)" fill-rule="evenodd" opacity="${progress(t,5.75,6.7)*(1-progress(t,8.7,9.65))}"/>`:''}
    </g>
    ${t>17.1&&t<18.4?`<circle cx="0" cy="0" r="${mix(48,580,wave)}" fill="none" stroke="${PALETTE.blue}" stroke-width="${mix(2.5,.5,wave)}" opacity="${(1-progress(t,17.3,18.4))*.5}"/>`:''}
  </g>
  <g fill="${ink}" font-family="'Space Grotesk',sans-serif" opacity="${furniture}">
    <text x="76" y="79" font-size="18" font-weight="700" letter-spacing="2.4">EVERYTHING IS MOTION</text>
    <text x="1844" y="79" text-anchor="end" font-size="15" letter-spacing="2.1" opacity=".48">ONE FORM. INFINITE TRANSFORMATIONS.</text>
    <text x="76" y="1005" font-size="14" letter-spacing="2" opacity=".55">${kind}</text>
    <text x="1844" y="1005" text-anchor="end" font-size="14" letter-spacing="2" opacity=".55">${letters?'FORM BECOMES MEANING':'A CONTINUOUS STUDY'}</text>
  </g>
  </svg>`;
};
