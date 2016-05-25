import { expect } from 'chai';
import mocha = require('mocha');

import { ConsoleLogger } from '../src/logger';
import { salvage, SalvageOptions, sameIndex, jsonKey, sameKey } from '../src';
import fs = require('fs');
import _ = require('lodash');

import { shouldEqual, shouldBeFirst } from './utils';

describe("Performance tests", () => {
    it("should compare favorably to _.isEqual", function () {
        // This is large because this specific test can take
        // quite a while during coverage analysis.
        this.timeout(1000000);

        let si: SalvageOptions = {
            //log: new ConsoleLogger(false),
            keyFunction: sameIndex,
        };
        let sk: SalvageOptions = {
            keyFunction: sameKey,
        };
        let id: SalvageOptions = {
            keyIds: ["_id"],
        };
        let jk: SalvageOptions = {
            keyFunction: jsonKey,
        };

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

        let using = (desc: string, withOpts: SalvageOptions) => {
            let eq = "salvage ["+desc+"] (are equal)";
            let df = "salvage ["+desc+"] (are diff)";
            console.time(eq);
            let x = salvage(base, same, withOpts);
            console.timeEnd(eq);
            expect(x).to.equal(base);
            
            console.time(df);
            let y = salvage(base, diff, withOpts);
            console.timeEnd(df);
            for (let i = 1; i < base.length; i++) {
                expect(y[i]).to.equal(base[i]);
            }
            expect(y).to.not.equal(base);
            expect(y).to.not.equal(diff);
            expect(y).to.deep.equal(diff);
        }
        
        using("default", {});
        using("jsonKey", jk);
        using("sameIndex", si);
        using("use _id", id);
        using("sameKey", sk);
    })
});