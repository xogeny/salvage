import { expect } from 'chai';
import mocha = require('mocha');

import { ConsoleLogger } from '../src/logger';
import { salvage, SalvageOptions, sameIndex, jsonKey } from '../src';
import fs = require('fs');
import _ = require('lodash');

import { shouldEqual, shouldBeFirst } from './utils';

describe("Performance tests", () => {
    it("should compare favorably to _.isEqual", function() {
        // This is large because this specific test can take
        // quite a while during coverage analysis.
        this.timeout(1000000);
        
        let si: SalvageOptions = {
            //log: new ConsoleLogger(false),
            keyFunction: sameIndex,
        }
        let kf: SalvageOptions = {
            //log: new ConsoleLogger(false),
            keyFunction: (a: any, index: number) => a.hasOwnProerty("_id") ? a["_id"] : "any",
        }
        let jk: SalvageOptions = {
            keyFunction: jsonKey,
        }
        
        // I deliberately read this three times to create objects with different
        // identities...
        let base = JSON.parse(fs.readFileSync("samples/sample1.json").toString());
        let same = JSON.parse(fs.readFileSync("samples/sample1.json").toString());
        let diff = JSON.parse(fs.readFileSync("samples/sample1.json").toString());
        
        // Just a quick check on the data to make sure it is what I expect...
        expect(diff[0].name.last).to.equal("Austin");
        // Now mutate the "diff" version slightly.
        diff[0].name.last = "Tiller";

        console.time("isEqual (are equal)");
        _.isEqual(base, same);
        console.timeEnd("isEqual (are equal)");
        console.time("isEqual (are diff)");
        _.isEqual(base, diff);
        console.timeEnd("isEqual (are diff)");

        console.time("salvage (are equal)");
        let x = salvage(base, same);
        console.timeEnd("salvage (are equal)");
        expect(x).to.equal(base);
        console.time("salvage (are diff)");
        let y = salvage(base, diff);
        console.timeEnd("salvage (are diff)");
        expect(y).to.not.equal(base);
        expect(y).to.not.equal(diff);
        expect(y).to.deep.equal(diff);

        console.time("salvage [jsonKey] (are equal)");
        x = salvage(base, same, jk);
        console.timeEnd("salvage [jsonKey] (are equal)");
        expect(x).to.equal(base);
        console.time("salvage [jsonKey] (are diff)");
        y = salvage(base, diff, jk);
        console.timeEnd("salvage [jsonKey] (are diff)");
        expect(y).to.not.equal(base);
        expect(y).to.not.equal(diff);
        expect(y).to.deep.equal(diff);

        console.time("salvage [sameIndex] (are equal)");
        x = salvage(base, same, si);
        console.timeEnd("salvage [sameIndex] (are equal)");
        expect(x).to.equal(base);
        console.time("salvage [sameIndex] (are diff)");
        y = salvage(base, diff, si);
        console.timeEnd("salvage [sameIndex] (are diff)");
        expect(y).to.not.equal(base);
        expect(y).to.not.equal(diff);
        expect(y).to.deep.equal(diff);

        console.time("salvage [keyFunc] (are equal)");
        x = salvage(base, same, si);
        console.timeEnd("salvage [keyFunc] (are equal)");
        expect(x).to.equal(base);
        console.time("salvage [keyFunc] (are diff)");
        y = salvage(base, diff, si);
        console.timeEnd("salvage [keyFunc] (are diff)");
        expect(y).to.not.equal(base);
        expect(y).to.not.equal(diff);
        expect(y).to.deep.equal(diff);
    })
});