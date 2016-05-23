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
export function keep(aval: any, bval: any): any {
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
                    return aval;
                }
                return bval;
            // Object is a really tricky case because lots of stuff comes back
            // as "object" in Javascript (including a null value).
            case 'object':
                // Handle null value special case...
                if (aval===null || bval===null) {
                    return bval;
                }
                
                // If this is an object, let's convert it to string to help us try to figure out
                // what kind of object it is...
                let ctype = bval.toString();

                switch (ctype) {
                    case "[object Object]":
                        // It's an object, so use this special function to decide what
                        // properties to keep.
                        return keepObject(aval, bval);
                    default:
                        if (Array.isArray(bval)) {
                            // It's an array, so use this special function to decide
                            // what elements to keep.
                            return keepArray(aval, bval);
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
    return bval;
}

function keepObject(a: {}, b: {}): {} {
    let ret: {} = {}
    let changed = false;

    // By default, we assume the result will have the same values for its
    // properties as a.
    for (let aprop in a) {
        ret[aprop] = a[aprop];
    }

    for (let aprop in a) {
        let aval = a[aprop];
        let bval = b[aprop];
        if (!b.hasOwnProperty(aprop)) {
            // If b is missing a prop that a has, then we need to
            // remove it from the result.
            delete ret[aprop];
            changed = true;
        } else {
            let tmp = keep(aval, bval);
            if (tmp !== aval) {
                ret[aprop] = tmp;
                changed = true;
            }
        }
    }

    for (let bprop in b) {
        // Check if b has any properties that a didn't.
        if (!a.hasOwnProperty(bprop)) {
            ret[bprop] = b[bprop];
            changed = true;
        }
    }

    console.log("changed = ", changed);
    if (changed) {
        return ret;
    }
    return a;
}

function keepArray(a: any[], b: any[]): any[] {
    let ret: any[] = [];
    for (let i = 0; i < a.length; i++) {

    }
    throw new Error("keepArray unimplemented");
}