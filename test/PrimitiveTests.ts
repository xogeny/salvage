import { expect } from 'chai';
import mocha = require('mocha');

import { shouldEqual, shouldBeFirst, shouldChange } from './utils';

describe("Primitive tests", () => {
    it("should handle integers properly", () => {
        shouldBeFirst(1, 1);
        shouldBeFirst(2, 2);
        shouldChange(2, null);
        shouldChange(null, 2);
        shouldChange(1, 2);
    });
    it("should handle booleans", () => {
        shouldBeFirst(true, true);
        shouldChange(true, false);
        shouldChange(false, true);
        shouldBeFirst(false, false);
        shouldChange(false, null);
        shouldChange(null, false);
        shouldChange(true, null);
        shouldChange(null, true);
    })
});