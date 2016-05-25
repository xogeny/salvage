import { SalvageOptions } from './options';
import { _salvage } from './salvage';

/**
 * A simple function that checks whether two objects have
 * *exactly* the same keys.
 */
function sameKeys(a: {}, b: {}): boolean {
    for (let aprop in a) {
        if (!b.hasOwnProperty(aprop)) return false;
    }
    for (let bprop in b) {
        if (!a.hasOwnProperty(bprop)) return false;
    }
    return true;
}

/**
 * salvageObjects is the workhorse for checking to see whether an object 
 * can be salvaged.  It is passed two objects as well as the user specified
 * salvage options.
 */
export function salvageObject(a: {}, b: {}, opts: SalvageOptions): {} {
    // Check to see if a Logger has been specified.
    let log = (opts ? opts.log : undefined);

    // If there is a logger, log that we are comparing these values
    if (log) log.enter(a, b);

    // Create our candidate return value
    let ret: {} = {}
    
    // Initialize two flags indicating whether we have so far used 
    // values only from "a" or values from "b".  Since we haven't actually
    // used any values, both of these start as true but may be invalidated
    // as we populate "ret".
    let pureA = true;
    let pureB = true;

    // Our return value *must* be deep equal to "b".  So by default, we will
    // populate our return value with the values from "b" but check to see 
    // if there is a value from "a" that we can salvage.
    for (let key in b) {
        let bval = b[key];
        
        // However, if the "a" object has the same property, figure out if 
        // we can salvage that value.
        if (a.hasOwnProperty(key)) {
            // Get the value from "a"
            let aval = a[key];
            
            // Now call `salvage` on the value from "a" and the value from "b"
            // associated with the property "key".
            let cval = _salvage(aval, bval, opts, a, b); // which to use?
            
            // We will use the salvaged value (whatever it is) in our return value.
            ret[key] = cval;

            // ...but, we also need to check to see whether the value came from 
            // "a" or "b" in order to determine whether to invalidate one or both 
            // of our "pure" flags...
            if (cval === aval) {
                if (log) log.fact("Value for property " + key + " comes from 'a'");
                // We took a value from "a", so our return object is not made up 
                // purely of values from "b".
                pureB = false;
            } else if (cval === bval) {
                if (log) log.fact("Value for property " + key + " comes from 'b'");
                // We took a value from "b", so our return object is not made up 
                // purely of values from "a".
                pureA = false;
            } else {
                if (log) log.fact("Value for property " + key + " is a mix of 'b' and 'b'");
                // The resulting value from our call to "salvage" is *neither* the value 
                // from "a" or from "b" (i.e., it was necessary to create a new value).  As
                // such, our return value with be *neither* purely from "a" *nor* purely 
                // from "b".
                pureB = false;
                pureA = false;
            }
        } else {
            if (log) log.fact("No value for property " + key + " in 'a'");
            // If we get here, the property "key" was not present in "a" at all.  Therefore,
            // we can no longer claim that our return value is made up purely of values 
            // from "a".
            ret[key] = bval;
            pureA = false;
        }
    }

    // Check to see if "a" and "b" had exactly the same properties and no others.
    let same = sameKeys(a, b);

    // If "a" and "b" had the same properties AND we took values purely from "a", then
    // we can simply return "a".
    if (pureA && same) {
        if (log) {
            log.fact("Could keep 'a' value");
            log.leave(a);
        }
        return a;
    }

    // On the other hand, if "a" and "b" had the same properties AND we took values purely 
    // from "b", then we can simply return "b".
    if (pureB && same) {
        if (log) {
            log.fact("Could keep 'b' value");
            log.leave(b);
        }
        return b;
    }

    // If we get here, we have mixed values from both "a" and "b" and our return value
    // must be a new object that mixes both.
    if (log) {
        log.fact("Created a new object");
        log.leave(ret);
    }
    return ret;
}
