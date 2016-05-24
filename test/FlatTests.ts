import { expect } from 'chai';
import mocha = require('mocha');

import { ConsoleLogger } from '../src/logger';

import { shouldEqual, shouldBeFirst } from './utils';

describe("Flat tests", () => {
    it("should not change empty objects", () => {
        shouldBeFirst({}, {});
    });
    it("should not change identical properties", () => {
        let x = "foo";
        shouldBeFirst({
            x: x,
        }, {
            x: x,
        })
    });
    it("should not change equal properties", () => {
        shouldBeFirst({
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
        shouldBeFirst({
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
        shouldBeFirst({
            x: true,
        }, {
            x: true,
        })
        shouldBeFirst({
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