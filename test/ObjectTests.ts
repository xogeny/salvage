import { expect } from 'chai';
import mocha = require('mocha');

import { shouldEqual, shouldBeFirst, shouldBeSecond } from './utils';

describe("Object tests", () => {
    it("should not create new objects unnecessarily" , () => {
        shouldBeFirst({
            msg: "Same",
        }, {
            msg: "Same",
        });
        shouldBeSecond({
            msg: "First",
        }, {
            msg: "Second",
        });        
    })
    it("should handle deeply nested objects", () => {
        shouldEqual({
            x: { msg: "Hello" },
            y: { msg: "Bye" },
        }, {
            x: { msg: "Hello" },
            y: { msg: "Hello" },
        }, {
            x: { msg: "Hello" },
            y: { msg: "Hello" },
        }, ["x"], ["y"])
    })
});