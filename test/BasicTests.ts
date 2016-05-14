import { expect } from 'chai';
import mocha = require('mocha');

import { patch } from '../src';

function shouldBeNew(a: {}, b: {}) {
    let c = patch(a, b);
    expect(c).to.not.equal(a);
    expect(c).to.not.equal(b);
    expect(c).to.deep.equal(b);
}

function shouldBeSame(a: {}, b: {}) {
    let c = patch(a, b);
    expect(c).to.equal(a);
    if (a !== b) {
        expect(c).to.not.equal(b);
    }
    expect(c).to.deep.equal(b)
}
describe("Basic tests", () => {
    it("should not change empty objects", () => {
        shouldBeSame({}, {});
    });
    it("should not change identical properties", () => {
        let x = "foo";
        shouldBeSame({
            x: x,
        }, {
            x: x,
        })
    })
    it("should change if property disappears", () => {
        shouldBeNew({
            x: 5,
        }, {})
    })
})