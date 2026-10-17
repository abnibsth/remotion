export {spring,clamp,mix,smooth,hash,rupiah} from '../Gajian/motion.mjs';
export const P:{ivory:string;coral:string;black:string;lime:string;lavender:string;skin:string;skinLight:string;shade:string};
export const expenses:{label:string;amount:number;hit:number;deduct:number;end:number}[];
export function sceneAt(t:number):number;
export function balanceAt(t:number):number;
export function bodyAt(t:number):{x:number;y:number;r:number;scale:number;land:number;jump:number};
export function boardAt(t:number):{x:number;y:number;r:number;w:number;h:number;morph:number};
export function easeOut(t:number):number;
export function pulse(t:number,at:number,amplitude?:number):number;
