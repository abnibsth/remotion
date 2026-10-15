export const SCENES: {start: number; end: number}[];
export function normalizeTime(t: number): number;
export function clamp(x: number, a?: number, b?: number): number;
export function hash(n: number): number;
export function springValue(t: number, stiffness?: number, damping?: number): number;
export function shake(t: number, start: number, strength?: number, decay?: number): number;
export function sceneAt(t: number): {start: number; end: number; index: number; local: number};
export function motionState(t: number): ReturnType<typeof sceneAt> & {characterTime: number; cameraScale: number; shakeX: number; shakeY: number};
