import {C,mono} from '../design';
export const silence=(t:number)=>{
  const on=Math.floor((t-8)*2.2)%2===0;
  return `${t>=8.82?mono('meanwhile...',510,899,34,C.white,'text-anchor="middle"'):''}<rect x="497" y="935" width="26" height="8" fill="${C.lavender}" opacity="${on?1:.12}"/>`;
};
