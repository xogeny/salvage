import { SalvageOptions, sameKey } from './options';
import { _salvage } from './salvage';

function identical(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export function salvageArray(a: any[], b: any[], opts: SalvageOptions, aparent: any, bparent: any): any[] {
    let log = (opts ? opts.log : undefined);
    let keyfunc = (opts && opts.keyFunction ? opts.keyFunction : sameKey);

    let akeys: { [key: string]: number[] } = {};

    if (keyfunc) {
        for (let j = 0; j < a.length; j++) {
            let key = keyfunc(a[j], j, aparent);
            if (!akeys.hasOwnProperty(key)) {
                akeys[key] = [];
            }
            akeys[key].push(j);
        }
    }

    if (log) log.enter(a, b);
    let ret: any[] = [];
    for (let i = 0; i < b.length; i++) {
        let bval = b[i];
        ret[i] = bval;
        
        let bkey = keyfunc(bval, i, bparent);
        if (log) log.fact("Key for element "+i+" of 'b' was "+bkey);
        let indices: number[] = [];
        if (akeys.hasOwnProperty(bkey)) {
            indices = akeys[bkey];
            if (log) log.fact("Indices for elements of 'a' matching key '"+bkey+"' = "+JSON.stringify(indices));
        }
        
        for (let j = 0; j < indices.length; j++) {
            let aval = a[indices[j]];
            let c = _salvage(aval, bval, opts, a, b);
            if (c === aval) {
                ret[i] = aval;
                break;
            }
        }
    }

    if (identical(ret, a)) {
        if (log) {
            log.fact("Result is identical to 'a' value");
            log.leave(a);
        }
        return a;
    }

    if (identical(ret, b)) {
        if (log) {
            log.fact("Result is identical to 'b' value");
            log.leave(b);
        }
        return b;
    }
    if (log) {
        log.fact("New value required because mixing elements");
        log.leave(ret);
    }
    return ret;
}