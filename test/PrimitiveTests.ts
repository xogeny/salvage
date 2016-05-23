import { expect } from 'chai';
import mocha = require('mocha');

import { shouldEqual, shouldBeSame, shouldChange } from './utils';

describe("Primitive tests", () => {
    it("should handle integers properly", () => {
        shouldBeSame(1, 1);
        shouldBeSame(2, 2);
        shouldChange(2, null);
        shouldChange(null, 2);
        shouldChange(1, 2);
    });
    it("should handle booleans", () => {
        shouldBeSame(true, true);
        shouldChange(true, false);
        shouldChange(false, true);
        shouldBeSame(false, false);
        shouldChange(false, null);
        shouldChange(null, false);
        shouldChange(true, null);
        shouldChange(null, true);
    })
});