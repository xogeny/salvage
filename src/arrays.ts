import { SalvageOptions, KeyFunction } from './options';
import { _salvage } from './salvage';

/*
 * This is a utility function to determine if the contents of
 * two arrays are identical to each other (i.e., each element
 * is === equal its counterpart).
 */
function identical(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

/**
 * This function uses the SalvageOptions to construct 
 * a default key function.
 */
function defaultKey(opts: SalvageOptions): KeyFunction {
    return (a: any, i: number) => {
        // First, let's figure out what type of value we are
        // trying to generate a key (hash) for.  If it is a primitive
        // type, we can just use the value itself.
        let ato = typeof a;
        switch (ato) {
            case 'string':
            case 'number':
            case 'boolean':
                return "" + a;
            case 'object':
                let ctype = Object.prototype.toString.call(a);
                switch (ctype) {
                    case "[object Date]":
                        return "" + a.getTime();
                }
                let keyIds: string[] = opts && opts.keyIds || [];
                for(let i = 0; i < keyIds.length; i++) {
                    let key = keyIds[i];
                    // If our object has this particular key, return 
                    // the value associated with the key as a string.
                    if (a.hasOwnProperty(key)) {
                        return ""+a[key];
                    }
                }
        }
        // Our fallback, if we can't find a better choice, is to
        // user serialized JSON.  This actually works suprisingly
        // well (although the larger and deeper the value, the more
        // of a performance penalty you will probably take).
        return JSON.stringify(a);
    }
}

/*
 * This is the main workhorse routine for salvaging arrays.
 * 
 * The first two arguments are the arrays to be compared.  The third argument, opts, reflects
 * the options specified when `salvage` was invoked (if any).  Finally, the last two arguments
 * represent the parent values to the arrays `a` and `b`.  If there are no parent values
 * (i.e., the arrays represent root level values), then the parent values will be `undefined`.
 * These parent values are passed to the provided key function (if any) in order to help
 * determine what kind of key to use.
 */
export function salvageArray(a: any[], b: any[], opts: SalvageOptions, aparent: any, bparent: any): any[] {
    // See if we have a log option
    let log = (opts ? opts.log : undefined);

    // If a log was provided, log entry into this comparison
    if (log) log.enter(a, b);

    // See if the user provided a key function, if not...use "sameKey" which will basically mean
    // that we compare every element in "a" with every element in "b"...
    let keyfunc = (opts && opts.keyFunction ? opts.keyFunction : defaultKey(opts));

    // Determine the key for every element in "a" and match that key to the elements
    // that yielded that key...
    let akeys: { [key: string]: number[] } = {};
    for (let j = 0; j < a.length; j++) {
        // Call the key function to determine the key...
        let key = keyfunc(a[j], j, aparent);
        if (!akeys.hasOwnProperty(key)) {
            // If no other element has yielded this key, create an empty list
            // of indices.
            akeys[key] = [];
        }
        // Add the index of the current element in a to the list of indices that
        // yielded the key "key".
        akeys[key].push(j);
    }

    // Prepare the array that we will return.
    let ret: any[] = [];

    // Loop over all elements in "b"
    for (let i = 0; i < b.length; i++) {
        // The default case is that we are simply going to return the value from "b"
        // as the i-th element of our return value.
        let bval = b[i];
        ret[i] = bval;

        // However, let's also check to see if there were any elements in "a" that are
        // possibly "equal" to the value we are inserting here.  To do this, we first
        // calculate a "key" for this element in "b"...
        let bkey = keyfunc(bval, i, bparent);
        if (log) log.fact("Key for element " + i + " of 'b' was " + bkey);

        // Now lets determine which elements in "a" (if any) had the same key.  We start
        // by assuming that there were none...
        let indices: number[] = [];

        // ...then we check to see if the key of the current element in "b" is present in 
        // our "akeys" mapping.  If so, let's check all the elements in "a" that had that 
        // that key.
        if (akeys.hasOwnProperty(bkey)) {
            indices = akeys[bkey];
            if (log) log.fact("Indices for elements of 'a' matching key '" + bkey + "' = " + JSON.stringify(indices));
        }

        // Now that we have our list of potential indices in "a" to check, let's loop over them...
        for (let j = 0; j < indices.length; j++) {
            // Grab the actual value in "a" associated with this index.
            let aval = a[indices[j]];
            // Now run salvage recursively on the value from "a" and the value from "b".
            let c = _salvage(aval, bval, opts, a, b);
            // If salvage decided to keep the a value, use that at this index in our return 
            // list.
            if (c === aval) {
                ret[i] = aval;
                // N.B. - If we've found a salvageable value from "a", we don't need to look
                // for any more salvageable values in "a".
                break;
            }
        }
    }

    // Check to see if every value in our return array is identical to every value
    // in "a" (in other words, we were able to salvage every value in "a" and only
    // values from "a").
    if (identical(ret, a)) {
        if (log) {
            log.fact("Result is identical to 'a' value");
            log.leave(a);
        }
        // If so, we can just return "a" as our return value.  No need to create 
        // any new values here.
        return a;
    }

    // Next, check to see if every value in our return array is identical to
    // every value in "b".
    if (identical(ret, b)) {
        if (log) {
            log.fact("Result is identical to 'b' value");
            log.leave(b);
        }
        // If so, we can just return "b" as our return value.  Again, no need 
        // to create any new values here.
        return b;
    }
    if (log) {
        log.fact("New value required because mixing elements");
        log.leave(ret);
    }

    // If we found that we needed to mix values from both "a" and "b", then 
    // we are forced to return a new array (but this necessarily mean that 
    // any of the actual values in the array are new...it just means they didn't
    // all come from the same source).
    return ret;
}