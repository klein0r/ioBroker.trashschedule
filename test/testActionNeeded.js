'use strict';

const { expect } = require('chai');
const { isActionNeeded } = require('../lib/action-needed');

describe('actionNeeded', () => {
    it('is true on the last day of the configured range', () => {
        expect(isActionNeeded(1, 1, false)).to.equal(true);
        expect(isActionNeeded(0, 0, false)).to.equal(true);
    });

    it('is true on the pickup day', () => {
        expect(isActionNeeded(0, 1, false)).to.equal(true);
    });

    it('is false one day before the configured range starts', () => {
        expect(isActionNeeded(2, 1, false)).to.equal(false);
        expect(isActionNeeded(1, 0, false)).to.equal(false);
    });

    it('is false again once the pickup has passed and the next one is out of range (#292)', () => {
        // Pickup was today, the next event of this type is 14 days away
        expect(isActionNeeded(14, 1, false)).to.equal(false);
    });

    it('is false when the type is completed', () => {
        expect(isActionNeeded(0, 1, true)).to.equal(false);
        expect(isActionNeeded(1, 1, true)).to.equal(false);
    });

    it('is false for an invalid configuration', () => {
        expect(isActionNeeded(0, NaN, false)).to.equal(false);
        // @ts-expect-error a missing config value arrives as undefined
        expect(isActionNeeded(0, undefined, false)).to.equal(false);
    });
});
