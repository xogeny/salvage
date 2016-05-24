import { KeeperOptions } from './options';
import { keep } from './keeper';
import _ = require('lodash');

type Where = "FromA" | "FromB" | "Deleted" | "New";

export function keepObject(a: {}, b: {}, opts: KeeperOptions): {} {
    let log = (opts ? opts.log : undefined);

    if (log) log.enter(a, b);
    let ret: {} = {}
    let where: { [key: string]: Where } = {}

    // By default, we assume the result will have the same values for its
    // properties as a.
    /*
    for (let aprop in a) {
        ret[aprop] = a[aprop];
        where[aprop] = "FromA";
    }
    */

    for (let aprop in a) {
        let aval = a[aprop];
        let bval = b[aprop];
        if (!b.hasOwnProperty(aprop)) {
            // If b is missing a prop that a has, then we need to
            // remove it from the result.
            if (log) log.fact("Dropping " + aprop + " from result");
            delete ret[aprop];
            where[aprop] = "Deleted";
        } else {
            let tmp = keep(aval, bval, opts);
            if (tmp === aval) {
                if (log) log.fact("Keeping 'a' value for property " + aprop);
                ret[aprop] = aval;
                where[aprop] = "FromA";
            } else if (tmp === bval) {
                if (log) log.fact("Keeping 'b' value for property " + aprop);
                ret[aprop] = tmp;
                where[aprop] = "FromB";
            } else {
                if (log) log.fact("New value for property " + aprop);
                ret[aprop] = tmp;
                where[aprop] = "New";
            }
        }
    }

    for (let bprop in b) {
        // Check if b has any properties that a didn't.
        if (!a.hasOwnProperty(bprop)) {
            if (log) log.fact("Using 'b' value for property " + bprop);
            ret[bprop] = b[bprop];
            where[bprop] = "FromB";
        }
    }

    if (_.every(where, (x) => x === "FromA")) {
        if (log) {
            log.fact("All values came from 'a' value");
            log.leave(a);
        }
        return a;
    }
    if (_.every(where, (x) => x === "FromB")) {
        if (log) {
            log.fact("All values came from 'b' value");
            log.leave(b);
        }
        return b;
    }

    if (log) {
        log.fact("New object required, where = "+JSON.stringify(where));
        log.leave(ret);
    }
    return ret;
}
