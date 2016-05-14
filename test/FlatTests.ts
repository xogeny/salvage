import { expect } from 'chai';
import mocha = require('mocha');

import { patch } from '../src';
import { shouldBeNew, shouldBeSame } from './utils';

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
    });
    it("should not change equal properties", () => {
        shouldBeSame({
            x: "foo",
        }, {
            x: "foo",
        })
    })
    it("should change if property disappears", () => {
        shouldBeNew({
            x: 5,
        }, {})
    })
    it("should not change numbers", () => {
        shouldBeSame({
            x: 5,
        }, {
            x: 5,
        })
    })
    it("should change for new properties", () => {
        shouldBeNew({
            x: 5,
        }, {
            x: 5,
            y: 6,
        })
    })
    it("should handle complex chnages", () => {
        shouldBeNew({
            x: 5,
            y: 6,
        }, {
            y: 6,
            z: 7,
        })
    })
    it("should handle booleans", () => {
        shouldBeSame({
            x: true,
        }, {
            x: true,
        })
        shouldBeSame({
            x: false,
        }, {
            x: false,
        })
        shouldBeNew({
            x: true,
        }, {
            x: false,
        })
    })
})