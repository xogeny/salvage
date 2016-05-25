import { SalvageOptions } from './options';
import { salvageObject } from './objects';
import { salvageArray } from './arrays';
import { Logger } from './logger';

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
export function salvage(aval: any, bval: any, opts?: SalvageOptions) {
    return _salvage(aval, bval, opts, undefined, undefined);
}

/**
 * This is an "internal" implementation of salvage that has a slightly
 * broader interface to handle recursive calls.
 */
export function _salvage(aval: any, bval: any, opts: SalvageOptions, aparent: any, bparent: any) {
    // Check if a log was provided
    let log = (opts ? opts.log : undefined);

    // Log that we have started this comparison.
    if (log) log.enter(aval, bval);

    // Get the result of "typeof" for both values.
    let bto = typeof aval;
    let ato = typeof bval;

    // First, check if these are the same base type (if not, we definitely keep b).
    if (ato !== bto) {
        // Since "a" and "b" were of different types, we definitely keep the 
        // newer value from "b".
        if (log) log.leave(bval);
        return bval;
    }

    // If we get here, these are the same type, so let's figure out what type that is...

    // If we get here, then "a" and "b" have the same type.  As such, we need to decide
    // if these aren't just the same type, but whether they represent the same value.
    // But that kind of equality check depends on the underlying type...

    switch (bto) {
        // For primitive types, we can just use good old "===" on the values
        // (NB we used it on the *types* above, but not yet the values).
        case 'string':
        case 'number':
        case 'boolean':
        case 'function':
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
            //let ctype = bval.toString();
            let ctype = Object.prototype.toString.call(bval);
            switch (ctype) {
                case "[object Object]":
                    // It's an object, so use this special function to decide what
                    // properties to keep.
                    //console.log("K log = ", log);
                    let ret = salvageObject(aval, bval, opts);
                    if (log) log.leave(ret);
                    return ret;
                case "[object Date]":
                    // You might imagine that one could use === or at the very least
                    // == here...but this is Javascript and, *of course*, you cannot
                    // compare dates like that.  Fortunately, since we know that these 
                    // are *both* dates, we can do this instead...
                    if (aval.getTime()===bval.getTime()) {
                        if (log) log.leave(aval);
                        return aval;
                    }
                    if (log) log.leave(bval);
                    return bval;
                default:
                    /* istanbul ignore else */
                    if (Array.isArray(bval)) {
                        // It's an array, so use this special function to decide
                        // what elements to keep.
                        let ret = salvageArray(aval, bval, opts, aparent, bparent);
                        if (log) log.leave(ret);
                        return ret;
                    } else {
                        // This is here to advertise any cases that arent covered here.
                        /* istanbul ignore next */
                        throw new Error("No object equality check for " + bto + " (" + ctype + ")");
                    }
            }
            
        /* istanbul ignore next */
        default:
            // If we get here, we are dealing with types for which we do not know how 
            // to make a proper equality check.  As such, we'll throw an exception to 
            // be on the safe side.
            
            // TODO: Allow the user to provide a function to resolve these cases so that 
            // special user defined types can be compared?!?
            throw new Error("No equality check for value '"+bval+"' of type " + bto);
    }
}

