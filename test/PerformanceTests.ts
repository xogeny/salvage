import { expect } from 'chai';
import mocha = require('mocha');

import { ConsoleLogger } from '../src/logger';
import { salvage, SalvageOptions } from '../src';
import fs = require('fs');
import _ = require('lodash');

import { shouldEqual, shouldBeFirst } from './utils';

describe("Performance tests", () => {
    it("should compare favorably to _.isEqual", () => {
        let opts: SalvageOptions = {
            sameIndex: true,
        }
        let base = JSON.parse(fs.readFileSync("samples/sample1.json").toString());
        let same = JSON.parse(fs.readFileSync("samples/sample1.json").toString());
        let diff = JSON.parse(fs.readFileSync("samples/sample1.json").toString());
        expect(diff[0].name.last).to.equal("Austin");
        diff[0].name.last = "Tiller";
        
        console.time("isEqual (are equal)");
        _.isEqual(base,same);  
        console.timeEnd("isEqual (are equal)");
        console.time("isEqual (are diff)");
        _.isEqual(base,diff);  
        console.timeEnd("isEqual (are diff)");

        console.time("salvage (are equal)");
        let x = salvage(base,same);  
        console.timeEnd("salvage (are equal)");
        expect(x).to.equal(base);
        console.time("salvage (are diff)");
        let y = salvage(base,diff);  
        console.timeEnd("salvage (are diff)");
        expect(y).to.not.equal(base);
        expect(y).to.not.equal(diff);
        expect(y).to.deep.equal(diff);

        console.time("salvage [sameIndex] (are equal)");
        x = salvage(base,same, opts);  
        console.timeEnd("salvage [sameIndex] (are equal)");
        expect(x).to.equal(base);
        console.time("salvage [sameIndex] (are diff)");
        y = salvage(base,diff, opts);  
        console.timeEnd("salvage [sameIndex] (are diff)");
    })
});