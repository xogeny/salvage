import { Logger } from './logger';

/**
 * The KeyFunction type represents a function that constructs a key 
 * (conceptually this is really a hash) for a given element in an 
 * array.  The first argument is the element itself, the second 
 * argument is the index of that element and the last argument is 
 * the parent value *of the array* and not the array itself.
 * This last argument is included in case the user would like to
 * provide different key functions depending on the context the
 * array appears in.
 */
export type KeyFunction = (a: any, i: number, parent: any) => string;

/**
 * This is the default key function used if no user provided
 * function is specified.
 */
export function defaultKey(a: any, i: number) {
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
                    return ""+a.getTime();
            }
    }
    return JSON.stringify(a);
}

/**
 * This function is a key function that always returns the same value 
 * regardless of the element.  The practical consequence is that using 
 * this key function provides the most conservative checking (i.e., the
 * case where every element is compared against every other element).
 * It is ALSO the slowest possible choice, so users are encouraged to provide
 * their own key functions in the case where more reasonable key values
 * can be determined.
 */
export function sameKey(a: any, i: number) {
    return "sameKeyForEverything";
}

/**
 * This is another key function.  This function returns the elements index
 * as the key.  In practice, this key function should only be used in 
 * cases where elements are not likely to be inserted or deleted in arrays
 * between successive values.
 */
export function sameIndex(a: any, i: number) {
    return "" + i;
}

/**
 * This key function constructs a key by running JSON.stringify on the 
 * underlying value.  This is a pretty brute force approach.
 */
export function jsonKey(a: any) {
    return JSON.stringify(a);
}

/**
 * SalvageOptions is the type that defines what options can be passed
 * into the `salvage` function.  The `log` allows the user to provide
 * a Logger instance.  However, this option is primarily used by developers
 * to facilitate debugging and can largely be ignored.  The `keyFunction`
 * argument allows a user specified key function to be provided for 
 * helping to narrow down potential duplicate values in arrays.
 */
export interface SalvageOptions {
    log?: Logger;
    keyFunction?: KeyFunction;
}
