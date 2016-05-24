import { Logger } from './logger';
import _ = require('lodash');

export interface KeeperOptions {
    log: Logger;
}

/**
 * This function takes two arguments where the first argument 
 * represents some "current" value for a variable and the 
 * second represents a "new" value for the variable.  This 
 * function's job is to decide what, if anything, from the 
 * first value can be kept.
 * 
 * Keeping values from the "current" value is useful because
 * it makes it easy to decide what has truly changed.  Frameworks
 * like React and Angular2 use === as a means for detecting
 * changes and this function minimizes the number of changes 
 * by updating only values that have truly changed.
 * 
 * A use case for such functionality would be updating from
 * serialized values (e.g., ones retrieved via and AJAX call 
 * of via a websocket).  In such cases, an entirely new value 
 * is provided whether or not any of the underlying values have 
 * changed.  By running such values through the 'keep' function,
 * we can determine which values truly need updating.
 */
export function keep(aval: any, bval: any, opts?: KeeperOptions) {
    //export function keep(aval: any, bval: any, opts?: KeeperOptions): any {
    let log = (opts ? opts.log : undefined);

    //console.log("Root: log = ", log);
    if (log) log.enter(aval, bval);
    // Get the result of "typeof" for both values.
    let bto = typeof aval;
    let ato = typeof bval;

    // First, check if these are the same base type (if not, we definitely keep b).
    if (ato === bto) {
        // If the same type, we need to decide if these aren't just the same
        // type, but whether they are the same value.  But that kind of equality
        // check depends on the underlying type...
        switch (bto) {
            // For primitive types, we can just use good old "===" on the values
            // (we used it on the *types* above, but not the values).
            case 'string':
            case 'number':
            case 'boolean':
                if (aval === bval) {
                    if (log) log.leave(aval);
                    return aval;
                }
                if (log) log.leave(bval);
                return bval;
            // Object is a really tricky case because lots of stuff comes back
            // as "object" in Javascript (including a null value).
            case 'object':
                // Handle null value special case...
                if (aval === null || bval === null) {
                    if (log) log.leave(bval);
                    return bval;
                }

                // If this is an object, let's convert it to string to help us try to figure out
                // what kind of object it is...
                let ctype = bval.toString();

                switch (ctype) {
                    case "[object Object]":
                        // It's an object, so use this special function to decide what
                        // properties to keep.
                        //console.log("K log = ", log);
                        let ret = keepObject(aval, bval, opts);
                        if (log) log.leave(ret);
                        return ret;
                    default:
                        if (Array.isArray(bval)) {
                            // It's an array, so use this special function to decide
                            // what elements to keep.
                            let ret = keepArray(aval, bval, opts);
                            if (log) log.leave(ret);
                            return ret;
                        } else {
                            console.log("bval = ", bval);
                            console.log("ctype = ", ctype);
                            throw new Error("No object equality check for " + bto + " (" + ctype + ")");
                        }
                }
            default:
                console.log("bval = ", bval);
                throw new Error("No equality check for " + bto);
        }
    }
    if (log) log.leave(bval);
    return bval;
}

type Where = "FromA" | "FromB" | "Deleted" | "New";

function keepObject(a: {}, b: {}, opts: KeeperOptions): {} {
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

function keepArray(a: any[], b: any[], opts: KeeperOptions): any[] {
    let log = (opts ? opts.log : undefined);

    let ret: any[] = [];
    for (let i = 0; i < a.length; i++) {

    }
    throw new Error("keepArray unimplemented");
}