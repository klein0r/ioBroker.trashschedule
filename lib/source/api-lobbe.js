'use strict';

const BaseSource = require('./base');

const PROVIDERS = {
    lobbe: {
        title: 'Lobbe.app',
        url: 'https://lobbe.app',
    },
};

const AJAX_URL = 'https://lobbe.app/wp-admin/admin-ajax.php';
const LOBBE_TYPES = [
    { id: 'gelber', title: 'Gelber Sack / Wertstofftonne' },
    { id: 'biobfall', title: 'Bioabfall' },
    { id: 'restabfall', title: 'Restabfall' },
    { id: 'altpapier', title: 'Altpapier' },
    { id: 'additional_types', title: 'Weitere Abfaelle' },
];

class SourceApiLobbe extends BaseSource {
    constructor(adapter) {
        super(adapter, 'api-lobbe');
    }

    async validate() {
        const stateId = this.adapter.config.apiLobbeStateId;
        const cityId = this.adapter.config.apiLobbeCityId;
        const streetId = this.adapter.config.apiLobbeStreetId;

        if (stateId && cityId && streetId) {
            return true;
        }

        this.adapter.log.info('[api-lobbe] stateId or cityId or streetId not configured');
        return false;
    }

    async getPickupDates() {
        const stateId = this.adapter.config.apiLobbeStateId;
        const cityId = this.adapter.config.apiLobbeCityId;
        const streetId = this.adapter.config.apiLobbeStreetId;

        this.adapter.log.debug(
            `(0) [api-lobbe] update started by api - stateId: "${stateId}" - cityId: "${cityId}" - streetId: "${streetId}"`,
        );

        try {
            const years = await this.getApiYears();
            const states = await this.getApiCities('lobbe');
            const cities = await this.getApiDistricts('lobbe', stateId);
            const streets = await this.getApiStreets('lobbe', stateId, cityId);

            const state = states.find(entry => `${entry.id}` === `${stateId}`);
            const city = cities.find(entry => `${entry.id}` === `${cityId}`);
            const street = streets.find(entry => `${entry.id}` === `${streetId}`);

            if (!state || !city || !street) {
                throw new Error(
                    `[api-lobbe] unable to resolve configured address - state: ${stateId}, city: ${cityId}, street: ${streetId}`,
                );
            }

            const data = [];
            for (const year of years) {
                const icalData = await this.getIcal(state, city, street, year);
                data.push(...this.parseIcal(icalData));
            }

            return data;
        } catch (err) {
            this.adapter.log.error(`(0) [api-lobbe] unable to parse api data: ${err.toString()}`);
            return [];
        }
    }

    async getApiProviders() {
        return Object.keys(PROVIDERS).map(id => ({ id, ...PROVIDERS[id] }));
    }

    async getApiCities(provider) {
        if (provider) {
            return await this.getAjaxItems(
                {
                    action: 'state',
                },
                'lobbe-states.json',
            );
        }

        throw new Error('[api-lobbe] Unable to get states - empty provider');
    }

    async getApiDistricts(provider, stateId) {
        if (provider && stateId) {
            return await this.getAjaxItems(
                {
                    action: 'place',
                    id: stateId,
                },
                `lobbe-cities-${stateId}.json`,
            );
        }

        throw new Error('[api-lobbe] Unable to get cities - empty provider or stateId');
    }

    async getApiStreets(provider, stateId, cityId) {
        if (provider && stateId && cityId) {
            return await this.getAjaxItems(
                {
                    action: 'street',
                    id: cityId,
                },
                `lobbe-streets-${stateId}-${cityId}.json`,
            );
        }

        throw new Error('[api-lobbe] Unable to get streets - empty provider or stateId or cityId');
    }

    async getApiTypes(provider, stateId, cityId, streetId) {
        if (provider && stateId && cityId && streetId) {
            return LOBBE_TYPES;
        }

        throw new Error('[api-lobbe] Unable to get types - empty provider or stateId or cityId or streetId');
    }

    async getApiYears() {
        const yearsData = JSON.parse(
            await this.getApi({
                baseURL: `${AJAX_URL}?action=year`,
            }),
        );

        if (!Array.isArray(yearsData) || yearsData.length === 0) {
            throw new Error('[api-lobbe] Unable to get years');
        }

        return yearsData
            .map(year => ({
                id: year.id,
                text: year.text,
            }))
            .sort((a, b) => Number(a.text) - Number(b.text));
    }

    async getAjaxItems(params, cacheKey) {
        const response = await this.getApiCached(
            {
                baseURL: `${AJAX_URL}?${new URLSearchParams(params).toString()}`,
            },
            cacheKey,
        );

        const items = JSON.parse(response);
        return Array.isArray(items)
            ? items.map(item => ({
                  id: item.id,
                  name: item.text,
              }))
            : [];
    }

    async getIcal(state, city, street, year) {
        const params = new URLSearchParams();
        params.set('action', 'create_ical');
        params.set('year[id]', `${year.id}`);
        params.set('year[text]', `${year.text}`);
        params.set('state[id]', `${state.id}`);
        params.set('state[text]', `${state.name}`);
        params.set('place[id]', `${city.id}`);
        params.set('place[text]', `${city.name}`);
        params.set('street[id]', `${street.id}`);
        params.set('street[text]', `${street.name}`);
        params.set('days', '1');
        params.set('hours', '18');
        params.set('minutes', '0');

        for (const type of LOBBE_TYPES) {
            params.set(type.id, '1');
        }

        const createIcalData = JSON.parse(
            await this.getApiCached(
                {
                    baseURL: `${AJAX_URL}?${params.toString()}`,
                },
                `lobbe-ical-url-${year.text}-${state.id}-${city.id}-${street.id}.json`,
            ),
        );

        if (!createIcalData?.url) {
            throw new Error('[api-lobbe] Unable to create iCal file');
        }

        return await this.getApiCached(
            {
                baseURL: createIcalData.url,
            },
            `lobbe-ical-${year.text}-${state.id}-${city.id}-${street.id}.ics`,
        );
    }

    parseIcal(icalData) {
        const unfoldedData = icalData.replace(/\r?\n[ \t]/g, '');
        const events = unfoldedData.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/gm) ?? [];
        const pickupData = [];

        for (const event of events) {
            const name = this.getIcalField(event, 'SUMMARY');
            const description = this.stripHtml(this.getIcalField(event, 'DESCRIPTION'));
            const dateValue = this.getIcalDateValue(event);
            const date = this.parseIcalDate(dateValue);

            if (name && date) {
                pickupData.push({
                    date,
                    name: this.decodeIcalText(name),
                    description: this.decodeIcalText(description),
                });
            }
        }

        return pickupData;
    }

    getIcalField(event, fieldName) {
        const match = event.match(new RegExp(`^${fieldName}(?:;[^:]+)?:([^\\r\\n]+)$`, 'm'));
        return match?.[1] ?? '';
    }

    getIcalDateValue(event) {
        const match = event.match(/^DTSTART(?:;[^:]+)?:([^\r\n]+)$/m);
        return match?.[1] ?? '';
    }

    parseIcalDate(value) {
        const match = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?(Z)?$/);

        if (!match) {
            return null;
        }

        const year = Number(match[1]);
        const month = Number(match[2]) - 1;
        const day = Number(match[3]);
        const hour = Number(match[4] ?? 0);
        const minute = Number(match[5] ?? 0);
        const second = Number(match[6] ?? 0);

        if (match[7] === 'Z') {
            return new Date(Date.UTC(year, month, day, hour, minute, second));
        }

        return new Date(year, month, day, hour, minute, second);
    }

    decodeIcalText(value) {
        return value
            .replace(/\\n/gi, ' ')
            .replace(/\\,/g, ',')
            .replace(/\\;/g, ';')
            .replace(/\\\\/g, '\\')
            .trim();
    }

    stripHtml(value) {
        return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
}

module.exports = SourceApiLobbe;
