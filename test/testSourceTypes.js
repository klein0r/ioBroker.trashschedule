'use strict';

const { expect } = require('chai');

// getType() is written to the "source" state and must match the key of the source in main.js
const SOURCES = {
    ical: require('../lib/source/ical'),
    'api-jumomind': require('../lib/source/api-jumomind'),
    'api-abfallio': require('../lib/source/api-abfallio'),
    'api-awido': require('../lib/source/api-awido'),
    'api-lobbe': require('../lib/source/api-lobbe'),
};

describe('source types', () => {
    for (const [type, Source] of Object.entries(SOURCES)) {
        it(`${type} reports its own type`, () => {
            expect(new Source({ config: {}, log: {} }).getType()).to.equal(type);
        });
    }
});
