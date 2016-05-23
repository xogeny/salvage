import { shouldBeSame, shouldEqual } from './utils';

describe("Basic tests", () => {
    it("should not change for empty arrays", () => {
        shouldBeSame({ a: [] }, { a: [] });
    });
})