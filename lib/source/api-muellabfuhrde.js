'use strict';

const BaseSource = require('./base');

class SourceApiMuellabfuhrde extends BaseSource {
    constructor(adapter) {
        super(adapter, 'api-muellabfuhrde');
    }

    async validate() {
        const mandator = this.adapter.config.apiMuellabfuhrdeProvider;
        const cityId = this.adapter.config.apiMuellabfuhrdeCityId;

        if (mandator && cityId) {
            return true;
        }

        this.adapter.log.info('[api-muellabfuhrde] configuration incomplete');
        return false;
    }

    async getPickupDates() {

        const mandator = this.adapter.config.apiMuellabfuhrdeProvider;
        const locationId = this.adapter.config.apiMuellabfuhrdeStreetId ?? this.adapter.config.apiMuellabfuhrdeCityId;

        try {
            const raw = await this.getApi(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandator}/cal/location/${locationId}/pickups`,
            );

            const pickups = JSON.parse(raw);

            return pickups.map(p => ({
                date: p.date,
                name: p.fraction.name,
                description: p.fraction.shortname,
            }));
        } catch (err) {
            this.adapter.log.error(
                `[api-muellabfuhrde] unable to load pickups: ${err}`,
            );

            return [];
        }
    }

    async getApiProviders() {
        const data = await this.getApiCached(
            'https://portal.muellabfuhr-deutschland.de/api-portal/mandators',
            'muellabfuhrde-mandators.json',
        );

        return JSON.parse(data);
    }

    async getApiCities(mandatorId) {
        const config = JSON.parse(
            await this.getApiCached(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/config`,
                `muellabfuhrde-config-${mandatorId}.json`,
            ),
        );

        const rootId = config.calendarRootLocationId;

        const cities = JSON.parse(
            await this.getApiCached(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/cal/location/${rootId}?includeChildren=true`,
                `muellabfuhrde-cities-${mandatorId}.json`,
            ),
        );

        return cities.children || [];
    }

    async getApiStreets(mandatorId, cityId) {
        const streets = JSON.parse(
            await this.getApiCached(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/cal/location/${cityId}?includeChildren=true`,
                `muellabfuhrde-streets-${mandatorId}-${cityId}.json`,
            ),
        );

        if (!streets.children || streets.children.length === 0) {
            return [streets];
        }
        return streets.children;
    }

    async getApiTypes(mandatorId, cityId, districtId, streetId, houseNumber) {
        const locationId = streetId || cityId;
        const pickups = JSON.parse(
            await this.getApi(
                `https://portal.muellabfuhr-deutschland.de/api-portal/mandators/${mandatorId}/cal/location/${locationId}/pickups`,
            ),
        );

        const types = {};

        pickups.forEach(p => {
            types[p.fraction.id] = {
                id: p.fraction.id,
                name: p.fraction.name,
                shortname: p.fraction.shortname
            };
        });

        return Object.values(types);
    }
}

module.exports = SourceApiMuellabfuhrde;