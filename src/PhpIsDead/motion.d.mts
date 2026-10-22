export const stampTimes: number[];
export function clamp(v:number,a?:number,b?:number):number;
export function hash(n:number):number;
export function spring(t:number,frequency?:number,damping?:number):number;
export function smooth(t:number):number;
export function sceneAt(t:number):number;
export function shake(t:number,at:number,amp?:number,freq?:number):number;
export function motion(t:number):{time:number;scene:number;push:number;shakeX:number;shakeY:number};
