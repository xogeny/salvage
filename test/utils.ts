import { expect } from 'chai';
import { patch } from '../src';

export function shouldBeNew(a: {}, b: {}) {
    let c = patch(a, b);
    expect(c).to.not.equal(a);
    expect(c).to.not.equal(b);
    expect(c).to.deep.equal(b);
}

export function shouldBeSame(a: {}, b: {}) {
    let c = patch(a, b);
    expect(c).to.equal(a);
    if (a !== b) {
        expect(c).to.not.equal(b);
    }
    expect(c).to.deep.equal(b)
}
