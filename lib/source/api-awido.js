'use strict';

const BaseSource = require('./base');
const providers = require('../provider/api-awido');

class SourceApiAwido extends BaseSource {
    constructor(adapter) {
        super(adapter, 'api-awido');
    }

    /**
     * Validates the adapter configuration.
     * @return {Promise<boolean>} whether the adapter configuration is valid
     */
    async validate() {
        const provider = this.adapter.config.apiAwidoProvider;
        const cityId = this.adapter.config.apiAwidoCityId;
        const streetId = this.adapter.config.apiAwidoStreetId;
        if (provider && cityId && streetId) {
            return true;
        } else {
            this.adapter.log.info(`[api-awido] provider or cityId or streetId not configured`);
            return false;
        }
    }

    /**
     * Retrieves the pickup dates.
     * @return {Promise<*[]>}
     */
    async getPickupDates() {
        const provider = this.adapter.config.apiAwidoProvider;
        const cityId = this.adapter.config.apiAwidoCityId;
        const streetId = this.adapter.config.apiAwidoStreetId;

        this.adapter.log.debug(`(0) [api-awido] update started by api - cityId: "${cityId}" - streetId: "${streetId}"`);

        try {
            const apiTypes = await this.getApiTypes(provider, cityId, undefined, streetId);
            if (apiTypes && Array.isArray(apiTypes) && apiTypes.length !== 0) {
                let fractionIds = '[';
                apiTypes.forEach((/** @type {{ id: number; }} */ apiType) => {
                    if (fractionIds !== '[') {
                        fractionIds += ',';
                    }
                    fractionIds += '"' + apiType.id + '"';
                });
                fractionIds += ']';

                return await this.getApiPickups(provider, cityId, streetId, fractionIds);
            } else {
                this.adapter.log.error(`(0) [api-awido] unable to parse api data: '${apiTypes}'`);
                return [];
            }
        } catch (err) {
            this.adapter.log.error(`(0) [api-awido] unable to parse api data: ${err.toString()}`);
            return [];
        }
    }

    /**
     * Retrieves the API providers.
     * @return {Promise<(*&{id: *})[]>}
     */
    async getApiProviders() {
        return Object.keys(providers).map((id) => ({ id, ...providers[id] }));
    }

    /**
     * Requests available cities from the API.
     * @param {string} provider
     * @return {Promise<*[]>} city data
     */
    async getApiCities(provider) {
        if (provider) {
            const placeDataString = await this.getApiCached(
                {
                    method: 'GET',
                    baseURL: 'https://portal.awido.de/api/Customer/GetCustomerPlaces',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cache-Control': 'no-cache',
                        Connection: 'keep-alive',
                        Customer: providers[provider].customer,
                        Host: 'portal.awido.de',
                        Origin: 'https://portal.awido.de',
                        Referer: 'https://portal.awido.de/',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'cross-site',
                        'User-Agent': 'ioBroker/7.0',
                        'X-Requested-With': providers[provider].requestedWith,
                    },
                },
                `awido-cities-${provider}.json`,
            );
            //this.adapter.log.debug(`[api-awido] received place data: '${placeDataString}'`);

            const placeData = JSON.parse(placeDataString);
            const cityData = [];
            if (placeData && Array.isArray(placeData) && placeData.length !== 0) {
                placeData.forEach((/** @type {{ placeId: string; placeName: string }} */ place) => {
                    cityData.push({
                        id: place.placeId,
                        name: place.placeName,
                    });
                });
            }
            //this.adapter.log.debug(`[api-awido] generated city data from place data: '${JSON.stringify(cityData)}'`);
            return cityData;
        } else {
            throw new Error('[api-awido] Unable to get cities - empty provider');
        }
    }

    /**
     * Requests available streets from the API.
     * @param {string} provider
     * @param {string} cityId
     * @return {Promise<*[]>} street data
     */
    async getApiStreets(provider, cityId) {
        if (provider && cityId) {
            const districtDataString = await this.getApiCached(
                {
                    method: 'GET',
                    baseURL: `https://portal.awido.de/api/Customer/GetCustomerPlaceDistricts?placeId=${cityId}`,
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cache-Control': 'no-cache',
                        Connection: 'keep-alive',
                        Customer: providers[provider].customer,
                        Host: 'portal.awido.de',
                        Origin: 'https://portal.awido.de',
                        Referer: 'https://portal.awido.de/',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'cross-site',
                        'User-Agent': 'ioBroker/7.0',
                        'X-Requested-With': providers[provider].requestedWith,
                    },
                },
                `awido-streets-${provider}-${cityId}.json`,
            );
            //this.adapter.log.debug(`[api-awido] received district data: '${districtDataString}'`);

            const districtData = JSON.parse(districtDataString);
            const streetData = [];
            if (districtData && Array.isArray(districtData) && districtData.length !== 0) {
                districtData.forEach((/** @type {{ districtId: string; districtName: string }} */ street) => {
                    streetData.push({
                        id: street.districtId,
                        name: street.districtName,
                    });
                });
            }
            //this.adapter.log.debug(`[api-awido] generated street data from district data: '${JSON.stringify(streetData)}'`);
            return streetData;
        } else {
            throw new Error('[api-awido] Unable to get streets - empty provider or cityId');
        }
    }

    /**
     * Requests available types from the API.
     * @param {string} provider
     * @param {string} cityId
     * @param {undefined} districtId
     * @param {string} streetId
     * @return {Promise<*[]>} type data
     */
    async getApiTypes(provider, cityId, districtId, streetId) {
        if (provider && cityId && streetId) {
            const fractionDataString = await this.getApiCached(
                {
                    method: 'GET',
                    baseURL: `https://portal.awido.de/api/Customer/GetCustomerFractions?placeId=${cityId}&districtId=${streetId}`,
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cache-Control': 'no-cache',
                        Connection: 'keep-alive',
                        Customer: providers[provider].customer,
                        Host: 'portal.awido.de',
                        Origin: 'https://portal.awido.de',
                        Referer: 'https://portal.awido.de/',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'cross-site',
                        'User-Agent': 'ioBroker/7.0',
                        'X-Requested-With': providers[provider].requestedWith,
                    },
                },
                `awido-types-${provider}-${cityId}-${streetId}.json`,
            );
            //this.adapter.log.debug(`[api-awido] received fraction data: '${fractionDataString}'`);

            const fractionData = JSON.parse(fractionDataString);
            const typeData = [];
            if (fractionData && Array.isArray(fractionData) && fractionData.length !== 0) {
                fractionData.forEach((/** @type {{ fractionId: string; fractionName: string }} */ type) => {
                    typeData.push({
                        id: type.fractionId,
                        name: type.fractionName,
                    });
                });
            }
            //this.adapter.log.debug(`[api-awido] generated type data from fraction data: '${JSON.stringify(typeData)}'`);
            return typeData;
        } else {
            this.adapter.log.debug(`provider: '${provider}' cityId: '${cityId}' streetId: '${streetId}'`);
            throw new Error('[api-awido] Unable to get types - empty provider or cityId or streetId');
        }
    }

    /**
     * Requests available pickups from the API.
     * @param {string} provider
     * @param {string} cityId
     * @param {string} streetId
     * @param {string} typeIds
     * @return {Promise<*[]>} pickup data
     */
    async getApiPickups(provider, cityId, streetId, typeIds) {
        if (provider && cityId && streetId && typeIds) {
            const interestData = '[{"placeId":"' + cityId + '","districtId":"' + streetId + '","fractionIds":' + typeIds + ',"categoryIds":[]}]';
            const eventDataString = await this.getApiCached(
                {
                    method: 'GET',
                    baseURL: 'https://portal.awido.de/api/Calendar/GetNextEvents?amount=5&target=null',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cache-Control': 'no-cache',
                        Connection: 'keep-alive',
                        Customer: providers[provider].customer,
                        Host: 'portal.awido.de',
                        InterestData: interestData,
                        Origin: 'https://portal.awido.de',
                        Referer: 'https://portal.awido.de/',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'cross-site',
                        'User-Agent': 'ioBroker/7.0',
                        'X-Requested-With': providers[provider].requestedWith,
                    },
                },
                `awido-pickups-${provider}-${cityId}-${streetId}.json`,
            );
            //this.adapter.log.debug(`[api-awido] received event data: '${eventDataString}'`);

            const additionalEventDataString = await this.getApiCached(
                {
                    method: 'GET',
                    baseURL: 'https://portal.awido.de/api/Events/GetNextEventsAsCalendarEvents?amount=5&target=null',
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cache-Control': 'no-cache',
                        Connection: 'keep-alive',
                        Customer: providers[provider].customer,
                        Host: 'portal.awido.de',
                        InterestData: interestData,
                        Origin: 'https://portal.awido.de',
                        Referer: 'https://portal.awido.de/',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'cross-site',
                        'User-Agent': 'ioBroker/7.0',
                        'X-Requested-With': providers[provider].requestedWith,
                    },
                },
                `awido-pickups-additional-${provider}-${cityId}-${streetId}.json`,
            );
            //this.adapter.log.debug(`[api-awido] received additional event data: '${additionalEventDataString}'`);

            const eventData = JSON.parse(eventDataString);
            const additionalEventData = JSON.parse(additionalEventDataString);
            const pickupData = [];
            if (eventData && Array.isArray(eventData) && eventData.length !== 0) {
                eventData.forEach((/** @type {{ date: string; title: string; subtitle: string }} */ pickup) => {
                    pickupData.push({
                        date: pickup.date,
                        name: pickup.title,
                        description: pickup.subtitle,
                    });
                });
            }
            if (additionalEventData && Array.isArray(additionalEventData) && additionalEventData.length !== 0) {
                additionalEventData.forEach((/** @type {{ date: string; title: string; subtitle: string }} */ pickup) => {
                    pickupData.push({
                        date: pickup.date,
                        name: pickup.title,
                        description: pickup.subtitle,
                    });
                });
            }
            //this.adapter.log.debug(`[api-awido] generated pickup data from event data: '${JSON.stringify(pickupData)}'`);
            return pickupData;
        } else {
            throw new Error('[api-awido] Unable to get pickups - empty provider or cityId or streetId or typeIds');
        }
    }
}

module.exports = SourceApiAwido;
