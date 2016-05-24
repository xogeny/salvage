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
    it("should handle strings", () => {
        shouldBeFirst("Hello", "Hello");
        shouldChange("Hello", "Bye");
        shouldChange("Hello", null);
        shouldChange(null, "Bye");
    })
    it("should handle dates", () => {
        shouldBeFirst(new Date(2016, 5, 24, 7, 0, 0, 0), new Date(2016, 5, 24, 7, 0, 0, 0));
        shouldChange(new Date(2016, 5, 24, 7, 0, 0, 0), new Date(2016, 5, 24, 7, 0, 0, 1));
        shouldChange(null, new Date(2016, 5, 24, 7, 0, 0, 1));
        shouldChange(new Date(2016, 5, 24, 7, 0, 0, 0), null);
        let x = new Date(2016, 5, 24, 7, 0, 0, 0);
        shouldChange(x, x.getTime());
    })
    it("should handle functions", () => {
        let f = (x: number, y: number) => x*y;
        shouldBeFirst(f, f);
        shouldChange((x: number, y: number) => x+y, (x: number, y: number) => x+y);
        shouldChange(null, (x: number, y: number) => x+y);
        shouldChange((x: number, y: number) => x+y, null);
    })
});