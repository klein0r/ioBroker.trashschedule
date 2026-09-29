'use strict';

const { expect } = require('chai');
const SourceApiMuellabfuhrde = require('../lib/source/api-muellabfuhrde');

const PROVIDER = '35';
const CITY = '11111111-1111-4111-8111-111111111111';
const DISTRICT = '22222222-2222-4222-8222-222222222222';
const STREET_A = '33333333-3333-4333-8333-333333333333';
const STREET_B = '44444444-4444-4444-8444-444444444444';
const VILLAGE = '55555555-5555-4555-8555-555555555555';

function createSource(config = {}, responses = {}) {
    const requested = [];
    const source = new SourceApiMuellabfuhrde({
        config,
        log: { debug: () => {}, info: () => {}, error: () => {} },
    });
    const respond = async url => {
        requested.push(url);
        if (!(url in responses)) {
            throw new Error(`unexpected request ${url}`);
        }
        return JSON.stringify(responses[url]);
    };
    source.getApi = respond;
    source.getApiCached = respond;
    return { source, requested };
}

const location = id =>
    `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${PROVIDER}/cal/location/${id}?includeChildren=true`;
const pickups = id => `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${PROVIDER}/cal/location/${id}/pickups`;

describe('SourceApiMuellabfuhrde', () => {
    describe('validate', () => {
        const valid = { apiMuellabfuhrdeProvider: PROVIDER, apiMuellabfuhrdeCityId: CITY, apiMuellabfuhrdeStreetId: STREET_A };

        it('accepts a complete configuration', async () => {
            expect(await createSource(valid).source.validate()).to.equal(true);
        });

        for (const [key, value] of [
            ['apiMuellabfuhrdeProvider', ''],
            ['apiMuellabfuhrdeProvider', '../35'],
            ['apiMuellabfuhrdeCityId', ''],
            ['apiMuellabfuhrdeStreetId', ''],
            ['apiMuellabfuhrdeStreetId', 'err'],
            ['apiMuellabfuhrdeStreetId', `${STREET_A}/../x`],
        ]) {
            it(`rejects ${key} = "${value}"`, async () => {
                expect(await createSource({ ...valid, [key]: value }).source.validate()).to.equal(false);
            });
        }
    });

    describe('getApiStreets', () => {
        it('collects final locations of every depth and prefixes the district name', async () => {
            const { source } = createSource(
                {},
                {
                    [location(CITY)]: {
                        id: CITY,
                        name: 'Merseburg',
                        isFinal: false,
                        children: [
                            { id: DISTRICT, name: 'Merseburg', isFinal: false, children: [] },
                            { id: VILLAGE, name: 'Atzendorf', isFinal: true, children: [] },
                            { id: 'not-a-uuid', name: 'Broken', isFinal: true },
                        ],
                    },
                    [location(DISTRICT)]: {
                        id: DISTRICT,
                        name: 'Merseburg',
                        isFinal: false,
                        children: [
                            { id: STREET_B, name: 'Zeitzer Straße', isFinal: true, children: [] },
                            { id: STREET_A, name: 'Alter Ahornweg', isFinal: true, children: [] },
                        ],
                    },
                },
            );

            expect(await source.getApiStreets(PROVIDER, CITY)).to.deep.equal([
                { id: VILLAGE, name: 'Atzendorf' },
                { id: STREET_A, name: 'Merseburg / Alter Ahornweg' },
                { id: STREET_B, name: 'Merseburg / Zeitzer Straße' },
            ]);
        });

        it('returns the city itself when it is a pickup location', async () => {
            const { source } = createSource(
                {},
                { [location(CITY)]: { id: CITY, name: 'Eisfeld', isFinal: true, children: [] } },
            );

            expect(await source.getApiStreets(PROVIDER, CITY)).to.deep.equal([{ id: CITY, name: 'Eisfeld' }]);
        });

        it('stops descending at the depth limit', async () => {
            const chain = [CITY, DISTRICT, STREET_A, STREET_B, VILLAGE, '66666666-6666-4666-8666-666666666666'];
            const responses = {};
            chain.forEach((id, i) => {
                responses[location(id)] = {
                    id,
                    name: `level ${i}`,
                    isFinal: false,
                    children: chain[i + 1] ? [{ id: chain[i + 1], name: `level ${i + 1}`, isFinal: false }] : [],
                };
            });
            const { source, requested } = createSource({}, responses);

            expect(await source.getApiStreets(PROVIDER, CITY)).to.deep.equal([]);
            expect(requested).to.have.length(5);
        });

        it('refuses ids that are not safe for urls and cache files', async () => {
            const { source, requested } = createSource();

            for (const [provider, cityId] of [
                ['../35', CITY],
                [PROVIDER, '../../x'],
                [PROVIDER, undefined],
            ]) {
                let error;
                await source.getApiStreets(provider, cityId).catch(e => (error = e));
                expect(error, `${provider} ${cityId}`).to.be.an('error');
            }
            expect(requested).to.deep.equal([]);
        });
    });

    describe('getPickupDates', () => {
        const config = { apiMuellabfuhrdeProvider: PROVIDER, apiMuellabfuhrdeCityId: CITY, apiMuellabfuhrdeStreetId: STREET_A };

        it('maps pickups of the configured street and skips malformed entries', async () => {
            const { source } = createSource(config, {
                [pickups(STREET_A)]: [
                    { date: '2026-10-05', fraction: { id: '35003', name: 'Papiertonne', shortname: 'Papier' } },
                    { date: '2026-10-06', fraction: { id: '35002', name: 'Restabfall' } },
                    { date: '2026-10-07' },
                    { fraction: { id: '35004', name: 'Bio' } },
                    null,
                ],
            });

            expect(await source.getPickupDates()).to.deep.equal([
                { date: '2026-10-05', name: 'Papiertonne', description: 'Papier' },
                { date: '2026-10-06', name: 'Restabfall', description: '' },
            ]);
        });

        it('returns no dates when the response is not a list', async () => {
            const { source } = createSource(config, { [pickups(STREET_A)]: { error: 'Invalid UUID string' } });

            expect(await source.getPickupDates()).to.deep.equal([]);
        });
    });

    describe('getApiTypes', () => {
        it('lists every fraction once', async () => {
            const { source } = createSource(
                {},
                {
                    [pickups(STREET_A)]: [
                        { date: '2026-10-05', fraction: { id: '7001', name: 'Gelbe Tonne' } },
                        { date: '2026-10-19', fraction: { id: '7001', name: 'Gelbe Tonne' } },
                        { date: '2026-10-06', fraction: { id: '7004', name: 'Biomüll' } },
                    ],
                },
            );

            expect(await source.getApiTypes(PROVIDER, CITY, undefined, STREET_A)).to.deep.equal([
                { id: '7001', title: 'Gelbe Tonne' },
                { id: '7004', title: 'Biomüll' },
            ]);
        });
    });
});
