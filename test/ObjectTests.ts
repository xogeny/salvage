import { expect } from 'chai';
import mocha = require('mocha');

import { shouldEqual, shouldBeSame } from './utils';

describe("Object tests", () => {
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