export function patch<T extends {}>(a: T, b: T): T {
    // Create a new object to return (we won't actually use it
    // if there are no differences in b)
    let ret: T = {} as T;
    for (let prop in a) {
        ret[prop] = a[prop];
    }
    // We'll set this to true if we ever change a value in ret.
    let changed = false;

    // Check if things are missing from b that aren't in a, those should
    // be dropped from a and marked as changed.
    for (let prop in a) {
        if (!b.hasOwnProperty(prop)) {
            changed = true;
            delete ret[prop];
        }
    }

    // Loop over all properties of b...
    for (let prop in b) {
        let bval = b[prop];
        let bto = typeof bval;
        // Does a have that property?
        if (a.hasOwnProperty(prop)) {
            let equal = false; // We assume they aren't equal unless proven otherwise
            let aval = a[prop];
            let ato = typeof aval;

            if (ato === bto) {
                // If the same type, make an equality type according to that type.
                switch (bto) {
                    case 'string':
                    case 'number':
                    case 'boolean':
                        equal = (aval === bval);
                        //console.log(a, " === ", b, " is ", equal);
                        break;
                    case 'object':
                        if (Array.isArray(bval)) {
                            let tmp = keep(aval, bval);
                            changed = tmp === bval;
                            bval = tmp;
                        } else {
                            console.log("Unhandled object type for ", bval);
                        }
                    default:
                        console.log("No equality check for ", bto);
                        equal = false;
                }
            }

            if (!equal) {
                // If these aren't equal, we need to update
                // our return object.
                ret[prop] = bval;
                changed = true;
            }
        } else {
            // If the property doesn't exist in a, add it.
            changed = true;
            ret[prop] = bval;
        }
    }

    // If b actually changed a, we return the new object
    if (changed) return ret;
    // otherwise, just return a
    return a;
}

function keep(aval: any, bval: any): any {
    let bto = typeof aval;
    let ato = typeof bval;

    if (ato === bto) {
        // If the same type, make an equality type according to that type.
        switch (bto) {
            case 'string':
            case 'number':
            case 'boolean':
                if (aval === bval) {
                    return aval;
                }
                return bval;
            case 'object':
                if (Array.isArray(bval)) {
                    return keepArray(aval as Array<any>, bval as Array<any>);
                } else {
                    console.log("Unhandled object type for ", bval);
                }
            default:
                throw new Error("No equality check for "+bto);
        }
    }
    return bval;
}

function keepArray(a: any[], b: any[]): any[] {
    let ret: any[] = [];
    for (let i = 0; i < a.length; i++) {

    }
    throw new Error("Unimplemented");
}