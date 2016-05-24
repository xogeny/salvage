import { shouldBeFirst, shouldBeSecond, shouldEqual, shouldContain } from './utils';

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
        shouldContain([1, 2, 3], [1, 2], [1, 2], [0, 1], []);
    })
    it("should handle prepended items", () => {
        shouldContain([2, 3], [1, 2, 3], [1, 2, 3], [1, 2], [0]);
    })
    it("should handle appended items", () => {
        shouldContain([1, 2], [1, 2, 3], [1, 2, 3], [0, 1], [2]);
    })
    it("should handle inserted items", () => {
        // This is tricky...
        shouldContain([1, 3], [1, 2, 3], [1, 2, 3], [0, 2], [1]);  
    })
    it("should handle dropped items", () => {
        shouldEqual({
            a: [1, 2, 3],
        }, {
            a: [1, 2],
        }, {
            a: [1, 2]
        }, [""], ["a"]);
    })
})