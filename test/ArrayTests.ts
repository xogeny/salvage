import { shouldBeFirst, shouldEqual } from './utils';

xdescribe("Basic tests", () => {
    it("should not change for empty arrays", () => {
        shouldBeFirst({ a: [] }, { a: [] });
    });
})