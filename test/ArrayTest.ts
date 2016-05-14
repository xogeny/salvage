import { shouldBeSame, shouldBeNew } from './utils';

describe("Basic tests", () => {
    it("should not change for empty arrays", () => {
        shouldBeSame({ a: [] }, { a: [] });
    });
})