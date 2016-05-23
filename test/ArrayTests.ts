import { shouldBeSame, shouldEqual } from './utils';

xdescribe("Basic tests", () => {
    it("should not change for empty arrays", () => {
        shouldBeSame({ a: [] }, { a: [] });
    });
})