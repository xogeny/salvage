import { expect } from 'chai';
import { keep } from '../src';
import _ = require('lodash');

export function shouldChange(a: any, b: any) {
    let c = keep(a, b);
    expect(c).to.not.equal(a);
}

export function shouldBeSame(a: any, b: any) {
    let c = keep(a, b);
    expect(c).to.equal(a);
}

export function shouldEqual(a: {}, b: {}, c: {}, fromA: string[], fromB: string[]) {
    let ta = _.clone(a);
    let tb = _.clone(b);
    
    // This should be true (just confirm before we test again later)
    expect(ta).to.deep.equal(a);
    expect(tb).to.deep.equal(b);
    let r = keep(a, b);
    
    // Make sure that "a" and "b" didn't get mutated for some reason
    expect(ta).to.deep.equal(a, "keep MUTATED first input argument!!!");
    expect(tb).to.deep.equal(b, "keep MUTATED second input argument!!!");

    //console.log("keep ", a, ", ", b, " = ", c, " == ", r);
    expect(c).to.deep.equal(r);
    for(let ap in a) {
        let eq = fromA.indexOf(ap)>=0;
        if (eq) {
            expect(a[ap]).to.equal(c[ap]);
        }
    }
    for(let bp in b) {
        let eq = fromB.indexOf(bp)>=0;
        if (eq) {
            expect(b[bp]).to.equal(c[bp]);
        }
    }
    for(let rp in r) {
        let ina = fromA.indexOf(rp)>=0;
        let inb = fromB.indexOf(rp)>=0;
        expect(ina || inb).to.equal(true);
    }
}
