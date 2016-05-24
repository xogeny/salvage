import { expect } from 'chai';
import { keep, ConsoleLogger, KeeperOptions } from '../src';
import _ = require('lodash');

const silent = true;

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

export function shouldContain(a: Array<any>, b: Array<any>, fromA: Array<number | number[]>, fromB: Array<number>) {
    let opts: KeeperOptions = {
        log: new ConsoleLogger(silent),
    }
    let r = keep(a, b, opts);
    expect(r).to.deep.equal(b);

    for (let i = 0; i < fromA.length; i++) {
        let from = fromA[i];
        if (_.isArray(from)) {
            expect(r[from[0]]).to.equal(a[from[1]]);
        } else {
            expect(r[from]).to.equal(a[from]);
        }
    }

    for (let i = 0; i < fromB.length; i++) {
        let from = fromB[i];
        expect(r[from]).to.equal(b[from]);
    }
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
