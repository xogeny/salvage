import { Logger } from './logger';

export type KeyFunction = (a: any, i: number, parent: any) => string;

export function sameKey(a: any, i: number) {
    return "sameKeyForEverything";
}

export function sameIndex(a: any, i: number) {
    return ""+i;
}

export interface SalvageOptions {
    log?: Logger;
    keyFunction?: KeyFunction;
}
