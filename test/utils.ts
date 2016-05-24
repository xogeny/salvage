import { expect } from 'chai';
import { keep, ConsoleLogger, KeeperOptions } from '../src';
import _ = require('lodash');

const silent = false;

export function shouldChange(a: any, b: any) {
    let opts: KeeperOptions = {
        log: new ConsoleLogger(silent),
    }
    let c = keep(a, b, opts);
    opts.log.done();
    expect(c).to.not.equal(a);
}

export function shouldBeFirst(a: any, b: any) {
    let opts: KeeperOptions = {
        log: new ConsoleLogger(silent),
    }
    let c = keep(a, b, opts);
    opts.log.done();
    expect(c).to.equal(a);
}

export function shouldBeSecond(a: any, b: any) {
    let opts: KeeperOptions = {
        log: new ConsoleLogger(silent),
    }
    let c = keep(a, b, opts);
    opts.log.done();
    expect(c).to.equal(b);    
}

export function shouldEqual(a: {}, b: {}, c: {}, fromA: string[], fromB: string[]) {
    let opts: KeeperOptions = {
        log: new ConsoleLogger(silent),
    }
    let ta = _.clone(a);
    let tb = _.clone(b);

    // This should be true (just confirm before we test again later)
    expect(ta).to.deep.equal(a);
    expect(tb).to.deep.equal(b);
    let r = keep(a, b, opts);
    opts.log.done();

    // Make sure that "a" and "b" didn't get mutated for some reason
    expect(ta).to.deep.equal(a, "keep MUTATED first input argument!!!");
    expect(tb).to.deep.equal(b, "keep MUTATED second input argument!!!");

    //console.log("keep ", a, ", ", b, " = ", c, " == ", r);
    for (let rp in r) {
        let ina = fromA.indexOf(rp) >= 0;
        let inb = fromB.indexOf(rp) >= 0;
        expect(ina || inb).to.equal(true);
    }

    expect(c).to.deep.equal(r);
    for (let ap in a) {
        let eq = fromA.indexOf(ap) >= 0;
        if (eq) {
            expect(a[ap]).to.equal(r[ap]);
        }
    }
    for (let bp in b) {
        let eq = fromB.indexOf(bp) >= 0;
        if (eq) {
            expect(b[bp]).to.equal(r[bp]);
        }
    }
}
