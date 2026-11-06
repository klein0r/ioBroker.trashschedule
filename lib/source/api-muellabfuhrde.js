'use strict';

const BaseSource = require('./base');

const API_URL = 'https://portal.muellabfuhr-deutschland.de/api-portal/mandators';
const PROVIDER_ID = /^\d+$/;
const LOCATION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Below a city, providers nest up to 2 more levels (district > street)
const MAX_DEPTH = 4;

class SourceApiMuellabfuhrde extends BaseSource {
    constructor(adapter) {
        super(adapter, 'api-muellabfuhrde');
    }

    async validate() {
        const provider = this.adapter.config.apiMuellabfuhrdeProvider;
        const cityId = this.adapter.config.apiMuellabfuhrdeCityId;
        const streetId = this.adapter.config.apiMuellabfuhrdeStreetId;

        if (PROVIDER_ID.test(provider) && LOCATION_ID.test(cityId) && LOCATION_ID.test(streetId)) {
            return true;
        }

        this.adapter.log.info('[api-muellabfuhrde] provider or cityId or streetId not configured');
        return false;
    }

    async getPickupDates() {
        const provider = this.adapter.config.apiMuellabfuhrdeProvider;
        const streetId = this.adapter.config.apiMuellabfuhrdeStreetId;

        this.adapter.log.debug(
            `(0) [api-muellabfuhrde] update started by api - provider: "${provider}" - streetId: "${streetId}"`,
        );

        try {
            return (await this.getApiPickups(provider, streetId)).map(pickup => ({
                date: pickup.date,
                name: pickup.fraction.name,
                description: pickup.fraction.shortname ?? '',
            }));
        } catch (err) {
            this.adapter.log.error(`(0) [api-muellabfuhrde] unable to parse api data: ${err.toString()}`);
            return [];
        }
    }

    async getApiProviders() {
        const providers = JSON.parse(await this.getApiCached(API_URL, 'muellabfuhrde-providers.json'));

        return (Array.isArray(providers) ? providers : [])
            .filter(p => PROVIDER_ID.test(p?.id))
            .map(p => ({ id: p.id, title: p.name, url: 'https://portal.muellabfuhr-deutschland.de' }));
    }

    async getApiCities(provider) {
        if (!PROVIDER_ID.test(provider)) {
            throw new Error(`[api-muellabfuhrde] invalid provider "${provider}"`);
        }

        const config = JSON.parse(
            await this.getApiCached(`${API_URL}/${provider}/config`, `muellabfuhrde-config-${provider}.json`),
        );
        const root = await this.getApiLocation(provider, config?.calendarRootLocationId);

        return this.sortByName(root.children);
    }

    /**
     * Returns every pickup location (isFinal) below the city - or the city itself, if it has no streets
     *
     * @param {string} provider
     * @param {string} cityId
     */
    async getApiStreets(provider, cityId) {
        const city = await this.getApiLocation(provider, cityId);
        if (city.isFinal) {
            return [{ id: city.id, name: city.name }];
        }

        const streets = [];
        const collect = async (location, path) => {
            for (const child of location.children) {
                if (child.isFinal) {
                    streets.push({ id: child.id, name: [...path, child.name].join(' / ') });
                } else if (path.length < MAX_DEPTH) {
                    await collect(await this.getApiLocation(provider, child.id), [...path, child.name]);
                }
            }
        };
        await collect(city, []);

        return this.sortByName(streets);
    }

    async getApiTypes(provider, cityId, districtId, streetId) {
        if (!streetId) {
            throw new Error('[api-muellabfuhrde] Unable to get types - empty streetId');
        }

        const types = new Map();
        for (const pickup of await this.getApiPickups(provider, streetId)) {
            types.set(pickup.fraction.id, { id: pickup.fraction.id, title: pickup.fraction.name });
        }

        return [...types.values()];
    }

    async getApiLocation(provider, locationId) {
        this.checkIds(provider, locationId);

        const location = JSON.parse(
            await this.getApiCached(
                `${API_URL}/${provider}/cal/location/${locationId}?includeChildren=true`,
                `muellabfuhrde-location-${provider}-${locationId}.json`,
            ),
        );

        if (!location?.id || !Array.isArray(location.children)) {
            throw new Error(`[api-muellabfuhrde] invalid location response for "${locationId}"`);
        }

        location.children = location.children.filter(c => LOCATION_ID.test(c?.id) && c.name);
        return location;
    }

    async getApiPickups(provider, locationId) {
        this.checkIds(provider, locationId);

        const pickups = JSON.parse(await this.getApi(`${API_URL}/${provider}/cal/location/${locationId}/pickups`));

        return (Array.isArray(pickups) ? pickups : []).filter(p => p?.date && p.fraction?.id && p.fraction.name);
    }

    // ids end up in request URLs and cache file names
    checkIds(provider, locationId) {
        if (!PROVIDER_ID.test(provider) || !LOCATION_ID.test(locationId)) {
            throw new Error(`[api-muellabfuhrde] invalid provider "${provider}" or location "${locationId}"`);
        }
    }

    sortByName(items) {
        return items.sort((a, b) => `${a.name}`.localeCompare(`${b.name}`, 'de'));
    }
}

module.exports = SourceApiMuellabfuhrde;
