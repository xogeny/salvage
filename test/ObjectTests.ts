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
    it("should mix values from both side when possible", () => {
        shouldEqual({
            x: { field1: "Same" },      
        }, {
            x: { field1: "Same", field2: "New" },
        }, {
            x: { field1: "Same", field2: "New" },      
        }, [], []);
    })
    it("should handle null objects as the first value", () => {
        shouldBeSecond(null, { msg: "Second"});
    })
    it("should handle null objects as the second value", () => {
        shouldBeSecond({ msg: "Second" }, null);
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