import { Logger } from './logger';

export type IndexChooser = (i: number, a: any[], b: any) => number[];

export function sameIndex(i: number, a: any[], b: any): number[] {
    return [i];
}

export function allIndices(i: number, a: any[], b: any): number[] {
    let ret: number[] = [];
    for (let i = 0; i < a.length; i++) {
        ret.push(i);
    }
    return ret;
}

export interface SalvageOptions {
    log?: Logger;
    indexChooser?: IndexChooser;
}
