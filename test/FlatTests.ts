import { expect } from 'chai';
import mocha = require('mocha');

import { shouldEqual, shouldBeSame } from './utils';

describe("Flat tests", () => {
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
        shouldEqual({
            x: 5,
        }, {}, {}, [], [])
    })
    it("should not change equal numbers", () => {
        shouldBeSame({
            x: 5,
        }, {
            x: 5,
        })
    })
    it("should change unequal numbers", () => {
        shouldEqual({
            x: 5,
        }, {
            x: 6,
        }, {
            x: 6,
        }, [], ["x"]);
    })
    it("should change for new properties", () => {
        shouldEqual({
            x: 5,
        }, {
            x: 5,
            y: 6,
        }, {
            x: 5,
            y: 6,
        }, ["x"], ["y"])
    })
    it("should handle complex changes", () => {
        shouldEqual({
            x: 5,
            y: 6,
        }, {
            y: 6,
            z: 7,
        }, {
            y: 6,
            z: 7,
        }, ["y"], ["z"]);
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
        shouldEqual({
            x: true,
        }, {
            x: false,
        }, {
            x: false,
        }, [], ["x"]);
    })
})