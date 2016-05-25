import { SalvageOptions } from './options';
import { _salvage } from './salvage';

// A simple function that checks whether two objects have
// *exactly* the same keys.
function sameKeys(a: {}, b: {}): boolean {
    for (let aprop in a) {
        if (!b.hasOwnProperty(aprop)) return false;
    }
    for (let bprop in b) {
        if (!a.hasOwnProperty(bprop)) return false;
    }
    return true;
}

export function salvageObject(a: {}, b: {}, opts: SalvageOptions): {} {
    let log = (opts ? opts.log : undefined);

    if (log) log.enter(a, b);

    // Create our candidate return value
    let ret: {} = {}
    let pureA = true;
    let pureB = true;

    // Populate our result from 'b' by default
    for (let key in b) {
        let bval = b[key];
        // However, if the 'a' object has the same property, figure out which
        // value (from a or from b) to keep
        if (a.hasOwnProperty(key)) {
            let aval = a[key];
            let cval = _salvage(aval, bval, opts, a, b); // which to use?
            ret[key] = cval;

            if (cval === aval) {
                if (log) log.fact("Value for property " + key + " comes from 'a'");
                pureB = false;
            } else if (cval === bval) {
                if (log) log.fact("Value for property " + key + " comes from 'b'");
                pureA = false;
            } else {
                if (log) log.fact("Value for property " + key + " is a mix of 'b' and 'b'");
                pureB = false;
                pureA = false;
            }
        } else {
            if (log) log.fact("No value for property " + key + " in 'a'");
            ret[key] = bval;
            pureA = false;
        }
    }

    let same = sameKeys(a, b);

    if (pureA && same) {
        if (log) {
            log.fact("Could keep 'a' value");
            log.leave(a);
        }
        return a;
    }

    if (pureB && same) {
        if (log) {
            log.fact("Could keep 'b' value");
            log.leave(b);
        }
        return b;
    }

    // We now have our return constructed.  However, there is one special
    // case we need to deal with.  What if 'a' and 'b' both had exactly
    // the same properties and we chose 'a' value in every case?  Then we
    // can simply return a.

    if (log) {
        log.fact("Created a new object");
        log.leave(ret);
    }
    return ret;
}
