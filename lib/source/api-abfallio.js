'use strict';

const BaseSource = require('./base');
const providers = require('../provider/api-abfallio');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const ical = require('ical');

class SourceApiAbfallIo extends BaseSource {
    async validate() {
        const provider = this.adapter.config.apiAbfallioProvider;
        const cityId = this.adapter.config.apiAbfallioCityId;
        const districtId = this.adapter.config.apiAbfallioDistrictId;
        const streetId = this.adapter.config.apiAbfallioStreetId;
        const houseNumber = this.adapter.config.apiAbfallioHouseNumber;

        if (provider && cityId && districtId && streetId && houseNumber) {
            return true;
        } else {
            this.adapter.log.info(`[api-abfallio] no city configured`);
            return false;
        }
    }

    async getPickupDates() {
        const provider = this.adapter.config.apiAbfallioProvider;
        const cityId = this.adapter.config.apiAbfallioCityId;
        const districtId = this.adapter.config.apiAbfallioDistrictId;
        const streetId = this.adapter.config.apiAbfallioStreetId;
        const houseNumber = this.adapter.config.apiAbfallioHouseNumber;

        this.adapter.log.debug(
            `(0) [api-abfallio] update started by api - provider: ${provider} - cityId: "${cityId}" - districtId: ${districtId} streetId: "${streetId}" - houseNumber: "${houseNumber}"`,
        );

        try {
            const apiTypes = await this.getApiTypes(provider, cityId, districtId, streetId, houseNumber);
            const apiPickups = await this.getApiPickups(
                provider,
                cityId,
                streetId,
                districtId,
                houseNumber,
                apiTypes.map((t) => t.id),
            );

            //this.adapter.log.debug(`(0) received api data: ${JSON.stringify(apiPickups)}`);

            const data = [];
            for (const pickup of apiPickups) {
                data.push({
                    date: pickup.date,
                    name: pickup.wasteType.name,
                    description: pickup.note,
                });
            }

            return data;
        } catch (err) {
            this.adapter.log.error(`(0) [api-abfallio] unable to parse api data: ${err.toString()}`);

            return [];
        }
    }

    async getApiProviders() {
        return Object.keys(providers).map((id) => ({ id, ...providers[id] }));
    }

    async getApiCities(provider) {
        try {
            if (providers[provider].api === 'graphQl') {
                return await this.graphQlGetCities(provider);
            } else if (providers[provider].api === 'httpApi') {
                return await this.httpApiGetCities(provider);
            }
        } catch (err) {
            this.adapter.log.warn(`Error getting cities: ${err.data}`);
        }
    }

    async getApiDistricts(provider, cityId) {
        try {
            if (providers[provider].api === 'graphQl') {
                return await this.graphQlGetDistricts(provider, cityId);
            } else if (providers[provider].api === 'httpApi') {
                return await this.httpApiGetDistricts(provider, cityId);
            }
        } catch (err) {
            this.adapter.log.warn(`Error getting districts: ${err.data}`);
        }
    }

    async getApiStreets(provider, cityId, districtId) {
        if (cityId && districtId) {
            try {
                if (providers[provider].api === 'graphQl') {
                    return await this.graphQlGetStreets(provider, cityId, districtId);
                } else if (providers[provider].api === 'httpApi') {
                    return await this.httpApiGetStreets(provider, cityId, districtId);
                }
            } catch (err) {
                this.adapter.log.warn(`Error getting streets: ${err.data}`);
            }
        } else {
            throw new Error('[api-abfallio] Unable to get streets - empty cityId or districtId');
        }
    }

    async getApiHouseNumbers(provider, cityId, districtId, streetId) {
        if (cityId && districtId && streetId) {
            if (providers[provider].api === 'graphQl') {
                return await this.graphQlGetHouseNumbers(provider, cityId, districtId, streetId);
            } else if (providers[provider].api === 'httpApi') {
                return await this.httpApiGetHouseNumbers(provider, cityId, districtId, streetId);
            }
        } else {
            throw new Error('[api-abfallio] Unable to get streets - empty cityId or districtId');
        }
    }

    async getApiTypes(provider, cityId, districtId, streetId, houseNumber) {
        if (houseNumber) {
            if (providers[provider].api === 'graphQl') {
                return await this.graphQlGetTypes(provider, houseNumber);
            } else if (providers[provider].api === 'httpApi') {
                return await this.httpApiGetTypes(provider, cityId, streetId, houseNumber);
            }
        } else {
            throw new Error('[api-abfallio] Unable to get types - empty houseNumber');
        }
    }

    async getApiPickups(provider, cityId, streetId, districtId, houseNumber, wasteTypes) {
        if (houseNumber) {
            if (providers[provider].api === 'graphQl') {
                return await this.graphQlGetPickups(provider, houseNumber, wasteTypes);
            } else if (providers[provider].api === 'httpApi') {
                return await this.httpApiGetPickups(provider, cityId, streetId, districtId, houseNumber, wasteTypes);
            }
        } else {
            throw new Error('[api-abfallio] Unable to get types - empty houseNumber');
        }
    }

    /* GraphQL API functions */
    async graphQlGetCities(provider) {
        const citiesData = await this.getApiCached(
            {
                method: 'post',
                baseURL: 'https://widgets.abfall.io/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    Origin: providers[provider].url,
                    'x-abfallplus-api-key': providers[provider].apiKey,
                },
                data: JSON.stringify({
                    query: 'query GetCities($query: String) {\ncities(query: $query) {\nid\nname\nidHouseNumber\ndistrictsCount\nappointmentsSupported\n}\n}\n',
                    variables: { query: null },
                }),
            },
            `abfallio-cities-${provider}.json`,
        );

        return JSON.parse(citiesData)?.data?.cities;
    }

    async graphQlGetDistricts(provider, cityId) {
        const districtsData = await this.getApiCached(
            {
                method: 'post',
                baseURL: 'https://widgets.abfall.io/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    Origin: providers[provider].url,
                    'x-abfallplus-api-key': providers[provider].apiKey,
                },
                data: JSON.stringify({
                    query: 'query GetStreets($cityId: ID!, $query: String) {\ncity(id: $cityId) {\ndistricts(query: $query) {\nid\nname\nidHouseNumber\n}\n}\n}\n',
                    variables: { cityId: String(cityId), query: null },
                }),
            },
            `abfallio-districts-${provider}-${cityId}.json`,
        );

        return JSON.parse(districtsData)?.data?.city?.districts;
    }

    async graphQlGetStreets(provider, cityId, districtId) {
        const streetsData = await this.getApiCached(
            {
                method: 'post',
                baseURL: 'https://widgets.abfall.io/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    Origin: providers[provider].url,
                    'x-abfallplus-api-key': providers[provider].apiKey,
                },
                data: JSON.stringify({
                    query: 'query GetStreets($id: ID!, $query: String) {\ndistrict(id: $id) {\nstreets(query: $query) {\nid\nname\nidHouseNumber\n}\n}\n}\n',
                    variables: { id: String(districtId), query: null },
                }),
            },
            `abfallio-streets-${provider}-${cityId}-${districtId}.json`,
        );

        return JSON.parse(streetsData)?.data?.district?.streets;
    }

    async graphQlGetHouseNumbers(provider, cityId, districtId, streetId) {
        const streetsData = await this.getApiCached(
            {
                method: 'post',
                baseURL: 'https://widgets.abfall.io/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    Origin: providers[provider].url,
                    'x-abfallplus-api-key': providers[provider].apiKey,
                },
                data: JSON.stringify({
                    query: 'query GetHouseNumbers($streetId: ID!, $idDistrict: ID, $query: String) {\nstreet(id: $streetId) {\nhouseNumbers(query: $query, idDistrict: $idDistrict) {\nid\nname\n}\n}\n}\n',
                    variables: { streetId: String(streetId), query: null, idDistrict: String(districtId) },
                }),
            },
            `abfallio-housenumbers-${provider}-${cityId}-${districtId}-${streetId}.json`,
        );

        return JSON.parse(streetsData)?.data?.street?.houseNumbers;
    }

    async graphQlGetTypes(provider, houseNumber) {
        const streetsData = await this.getApiCached(
            {
                method: 'post',
                baseURL: 'https://widgets.abfall.io/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    Origin: providers[provider].url,
                    'x-abfallplus-api-key': providers[provider].apiKey,
                },
                data: JSON.stringify({
                    query: 'query HouseNumber($houseNumberId: ID!) {\nhouseNumber(id: $houseNumberId) {\nwasteTypes {\nid\nname\ninternals {\npdfLegend\n}\n}\n}\n}\n',
                    variables: { houseNumberId: String(houseNumber) },
                }),
            },
            `abfallio-types-${provider}-${houseNumber}.json`,
        );
        return JSON.parse(streetsData)?.data?.houseNumber?.wasteTypes;
    }

    async graphQlGetPickups(provider, houseNumber, wasteTypes) {
        const now = new Date();
        const pickupData = await this.getApiCached(
            {
                method: 'post',
                baseURL: 'https://widgets.abfall.io/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    Origin: providers[provider].url,
                    'x-abfallplus-api-key': providers[provider].apiKey,
                },
                data: JSON.stringify({
                    query: 'query Query($idHouseNumber: ID!, $wasteTypes: [ID], $dateMin: Date, $dateMax: Date, $showInactive: Boolean) {\nappointments(idHouseNumber: $idHouseNumber, wasteTypes: $wasteTypes, dateMin: $dateMin, dateMax: $dateMax, showInactive: $showInactive) {\nid\ndate\ntime\nlocation\nnote\nwasteType {\nid\nname\ncolor\ninternals {\npdfLegend\niconLow\n}\n}\n}\n}\n',
                    variables: {
                        idHouseNumber: String(houseNumber),
                        wasteTypes,
                        dateMin: `${now.getFullYear()}-01-01`,
                        dateMax: `${now.getFullYear()}-12-31`,
                        showInactive: false,
                    },
                }),
            },
            `abfallio-pickups-${provider}-${houseNumber}.json`,
        );

        return JSON.parse(pickupData)?.data?.appointments;
    }

    /* Http API functions */
    async httpApiGetCities(provider) {
        const citiesData = await this.getApiCached(
            {
                method: 'get',
                baseURL: `https://api.abfall.io/?key=${providers[provider].apiKey}&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=init`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
                },
            },
            `abfallio-cities-${provider}.json`,
        );

        const dom = new JSDOM(citiesData);
        const doc = dom.window.document;

        return Array.from(doc.querySelectorAll('select[name="f_id_kommune"] option'))
            .map((option) => ({
                id: option.value,
                name: option.textContent.trim(),
            }))
            .filter((option) => option.id !== '0');
    }

    async httpApiGetDistricts(provider, cityId) {
        const districtsData = await this.getApiCached(
            {
                method: 'post',
                baseURL: `https://api.abfall.io/?key=${providers[provider].apiKey}&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=auswahl_kommune_set`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                data: {
                    '31038f3146a0da582405fdc291437261': '63665c30d23bb0fed8889027f0fc762a',
                    f_id_kommune: cityId,
                },
            },
            `abfallio-districts-${provider}-${cityId}.json`,
        );

        const dom = new JSDOM(districtsData);
        const doc = dom.window.document;

        const districts = Array.from(doc.querySelectorAll('select[name="f_id_bezirk"] option'))
            .map((option) => ({
                id: option.value,
                name: option.textContent.trim(),
            }))
            .filter((option) => option.id !== '0');

        return districts.length > 0 ? districts : [{ id: '0', name: '--' }];
    }

    async httpApiGetStreets(provider, cityId, districtId) {
        // If there is no district the id is 0
        const streetsData = await this.getApiCached(
            {
                method: 'post',
                baseURL: `https://api.abfall.io/?key=${providers[provider].apiKey}&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=${districtId === '0' ? 'auswahl_kommune_set' : 'auswahl_bezirk_set'}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                data: {
                    '31038f3146a0da582405fdc291437261': '63665c30d23bb0fed8889027f0fc762a',
                    f_id_kommune: cityId,
                    f_id_bezirk: districtId,
                },
            },
            `abfallio-streets-${provider}-${cityId}-${districtId}.json`,
        );

        const dom = new JSDOM(streetsData);
        const doc = dom.window.document;

        const streets = Array.from(doc.querySelectorAll('select[name="f_id_strasse"] option'))
            .map((option) => ({
                id: option.value,
                name: option.textContent.trim(),
            }))
            .filter((option) => option.id !== '0');

        return streets;
    }

    async httpApiGetHouseNumbers(provider, cityId, districtId, streetId) {
        const houseNumbersData = await this.getApiCached(
            {
                method: 'post',
                baseURL: `https://api.abfall.io/?key=${providers[provider].apiKey}&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=auswahl_strasse_set}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                data: {
                    '31038f3146a0da582405fdc291437261': '63665c30d23bb0fed8889027f0fc762a',
                    f_id_kommune: cityId,
                    f_id_strasse: streetId,
                },
            },
            `abfallio-houseNumbers-${provider}-${cityId}-${districtId}-${streetId}.json`,
        );

        const dom = new JSDOM(houseNumbersData);
        const doc = dom.window.document;

        const houseNumbers = Array.from(doc.querySelectorAll('select[name="f_id_strasse_hnr"] option'))
            .map((option) => ({
                id: option.value,
                name: option.textContent.trim(),
            }))
            .filter((option) => option.id !== '0');
        return houseNumbers.length > 0 ? houseNumbers : [{ id: '0', name: 'Alle Hausnummern' }];
    }

    async httpApiGetTypes(provider, cityId, streetId, houseNumber) {
        const streetsData = await this.getApiCached(
            {
                method: 'post',
                baseURL: `https://api.abfall.io/?key=${providers[provider].apiKey}&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=${houseNumber === '0' ? 'auswahl_strasse_set' : 'auswahl_hnr_set'}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                data: {
                    '31038f3146a0da582405fdc291437261': '63665c30d23bb0fed8889027f0fc762a',
                    f_id_kommune: cityId,
                    f_id_strasse: streetId,
                    f_id_strasse_hnr: houseNumber,
                },
            },
            `abfallio-types-${provider}-${cityId}-${streetId}.json`,
        );

        const dom = new JSDOM(streetsData);
        const doc = dom.window.document;

        const types = Array.from(doc.querySelectorAll('label[for^="f_id_abfalltyp_"]'))
            .map((label) => {
                const checkbox = doc.getElementById(label.getAttribute('for'));
                return {
                    name: label.textContent.trim().replace('Abfallart ', '').replace(' verwenden?', ''),
                    id: checkbox ? checkbox.value : null,
                };
            })
            .filter((label) => label.id !== '0');

        return types;
    }

    async httpApiGetPickups(provider, cityId, streetId, districtId, houseNumber, wasteTypes) {
        const init = await axios({
            method: 'POST',
            url: `https://api.abfall.io/?key=${providers[provider].apiKey}&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=init`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
            },
        });

        const dom = new JSDOM(init.data);
        const doc = dom.window.document;

        const currentYear = new Date().getFullYear();
        const zeitraum = `${currentYear}0101-${currentYear}1231`;
        let config = {
            method: 'post',
            baseURL: `https://api.abfall.io/?key=${providers[provider].apiKey}&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=export_ics`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            data: {
                f_id_kommune: cityId,
                f_id_strasse: streetId,
                f_abfallarten_index_max: wasteTypes.length.toString(),
                f_abfallarten: wasteTypes.toString(),
                f_zeitraum: zeitraum,
                f_export_als: JSON.stringify({ action: `https://api.abfall.io/?key=${providers[provider].apiKey}&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=export_ics`, target: '' }),
            },
        };

        const input = doc.querySelectorAll('input[type="hidden"]')[1];

        if (input) {
            config.data[input.getAttribute('name')] = input.getAttribute('value');
        }

        if (districtId && districtId !== '0') {
            config.data['f_id_bezirk'] = districtId;
        }
        if (houseNumber && houseNumber !== '0') {
            config.data['f_id_strasse_hnr'] = houseNumber;
        }
        for (let type in wasteTypes) {
            config.data[`f_id_abfalltyp_${type}`] = wasteTypes[type];
        }
        const pickupData = await this.getApiCached(config, `abfallio-pickups-${provider}-${cityId}.ics`);

        const wasteTypeMap = {
            Restmüll: { id: '333', name: 'Restmüll 120l/240l', color: '#242425' },
            Biomüll: { id: '50', name: 'Biomüll', color: '#824300' },
            'Gelbe Tonne': { id: '299', name: 'Wertstoffe', color: '#f4b324' },
            Altpapier: { id: '53', name: 'Papier 120l/240l', color: '#2d76ba' },
        };

        const events = ical.parseICS(pickupData);

        const appointments = [];

        for (const key in events) {
            const event = events[key];
            if (event.type === 'VEVENT') {
                const summary = event.summary || '';

                const localDate = new Date(event.start).toLocaleDateString('en-CA');
                const description = event.description || '';

                const wasteType = wasteTypeMap[summary] || {};

                const appointment = {
                    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    date: localDate,
                    time: null,
                    location: null,
                    note: description,
                    wasteType: {
                        id: wasteType.id || '',
                        name: wasteType.name || '',
                        color: wasteType.color || '',
                        internals: {
                            pdfLegend: null,
                            iconLow: null,
                        },
                    },
                };

                appointments.push(appointment);
            }
        }

        const outputJSON = { data: { appointments } };

        return outputJSON?.data?.appointments;
    }
}

module.exports = SourceApiAbfallIo;
