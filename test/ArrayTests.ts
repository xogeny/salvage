import { shouldBeFirst, shouldBeSecond, shouldEqual, shouldContain } from './utils';

import { expect } from 'chai';
import { salvage, ConsoleLogger } from '../src';

describe("Basic tests", () => {
    it("should not change for empty arrays", () => {
        shouldBeFirst([], []);
    });
    it("should overwrite empty arrays", () => {
        shouldBeSecond([], ["hello"]);
    });
    it("should not overwrite the same array", () => {
        shouldBeFirst(["a"], ["a"]);
    })
    it("should handle dropped items", () => {
        shouldContain([1, 2, 3], [1, 2], [0, 1], []);
    })
    it("should handle prepended items", () => {
        shouldContain([2, 3], [1, 2, 3], [[1, 0], [2, 1]], [0]);
    })
    it("should handle appended items", () => {
        shouldContain([1, 2], [1, 2, 3], [0, 1], [2]);
    })
    it("should handle inserted items", () => {
        shouldContain([1, 3], [1, 2, 3], [0, [2, 1]], [1]);
    })
    it("should handle inserted dates", () => {
        let a = new Date(2016, 1);
        let b = new Date(2016, 2);
        let c = new Date(2016, 3);
        shouldContain([a, c], [a, b, c], [0, [2, 1]], [1]);
    })
    it("should handle inserted items", () => {
        // This is tricky...
        shouldContain([{ a: 1 }, { a: 3 }],
            [{ a: 1 }, { a: 2 }, { a: 3 }],
            [0, [2, 1]], [1]);
    })
    it("should handle out of order items", () => {
        // This is tricky...
        shouldContain([{ a: 1 }, { a: 2 }, { a: 3 }],
            [{ a: 2 }, { a: 3 }, { a: 1 }],
            [[0, 1], [1, 2], [2, 0]], []);
    })
    it("should use keys if provided", () => {
        let x = [{ a: 1 }, { a: 2 }, { a: 3 }];
        let y = [{ a: 2 }, { a: 3 }, { a: 1 }];
        let c = salvage(x, y, {
            keyIds: ["a"],
            //log: new ConsoleLogger(true),
        });
        expect(c[0]).to.equal(x[1]);
        expect(c[1]).to.equal(x[2]);
        expect(c[2]).to.equal(x[0]);
    })
})