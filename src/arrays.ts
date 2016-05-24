import { KeeperOptions } from './options';
import { keep } from './keeper';

function identical(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export function keepArray(a: any[], b: any[], opts: KeeperOptions): any[] {
    let log = (opts ? opts.log : undefined);

    if (log) log.enter(a, b);
    let ret: any[] = [];
    for (let i = 0; i < b.length; i++) {
        let bval = b[i];
        ret[i] = bval;
        for (let j = 0; j < a.length; j++) {
            let aval = a[j];
            let c = keep(aval, bval, opts);
            if (c === aval) {
                ret[i] = aval;
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