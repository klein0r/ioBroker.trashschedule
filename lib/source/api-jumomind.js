'use strict';

const BaseSource = require('./base');
const providers = require('../provider/api-jumomind');

class SourceApiJumomind extends BaseSource {
    constructor(adapter) {
        super(adapter, 'api-jumomind');
    }

    async validate() {
        const provider = this.adapter.config.apiJumomindProvider;
        const cityId = this.adapter.config.apiJumomindCityId;

        if (provider && cityId) {
            return true;
        } else {
            this.adapter.log.info(`[api-jumomind] provider or city not configured`);
            return false;
        }
    }

    async getPickupDates() {
        const provider = this.adapter.config.apiJumomindProvider;
        const cityId = this.adapter.config.apiJumomindCityId;

        let streetId = undefined;
        let areaId = cityId;

        if (this.adapter.config.apiJumomindStreetId) {
            const streetData = this.adapter.config.apiJumomindStreetId.split('-');
            if (streetData.length == 2) {
                streetId = streetData[0];
                areaId = streetData[1];
            }
        }

        this.adapter.log.debug(`(0) [api-jumomind] update started by api - cityId: "${cityId}" - streetId: "${streetId ?? 'n/a'}" - areaId: "${areaId}"`);

        try {
            const apiTypes = await this.getApiTypes(provider, cityId);
            const apiPickups = await this.getApiPickups(provider, cityId, areaId);

            //this.adapter.log.debug(`(0) received api data: ${JSON.stringify(apiPickups)}`);

            const data = [];
            for (const pickup of apiPickups) {
                const name = apiTypes.find((t) => t.name === pickup.cal_garbage_type)?.title ?? pickup.cal_garbage_type;

                data.push({
                    date: pickup.cal_date,
                    name,
                    description: pickup.cal_comment,
                });
            }

            return data;
        } catch (err) {
            this.adapter.log.error(`(0) [api-jumomind] unable to parse api data: ${err.toString()}`);

            return [];
        }
    }

    async getApiProviders() {
        return Object.keys(providers).map((id) => ({ id, ...providers[id] }));
    }

    async getApiCities(provider) {
        const citiesData = await this.getApiCached(`https://${provider}.jumomind.com/mmapp/api.php?r=cities`, `jumomind-cities-${provider}.json`);
        return JSON.parse(citiesData);
    }

    async getApiStreets(provider, cityId) {
        if (cityId) {
            const streetsData = await this.getApiCached(`https://${provider}.jumomind.com/mmapp/api.php?r=streets&city_id=${cityId}`, `jumomind-streets-${provider}-${cityId}.json`);

            const streets = JSON.parse(streetsData);
            streets.forEach((s) => (s.id = `${s.id}-${s.area_id}`));
            return streets;
        } else {
            throw new Error('[api-jumomind] Unable to get streets - empty cityId');
        }
    }

    async getApiTypes(provider, cityId) {
        if (cityId) {
            const typesData = await this.getApiCached(`https://${provider}.jumomind.com/mmapp/api.php?r=trash&city_id=${cityId}`, `jumomind-types-${provider}-${cityId}.json`);
            return JSON.parse(typesData);
        } else {
            throw new Error('[api-jumomind] Unable to get types - empty cityId');
        }
    }

    async getApiPickups(provider, cityId, areaId) {
        if (cityId) {
            const pickupData = await this.getApiCached(
                `https://${provider}.jumomind.com/webservice.php?idx=termins&city_id=${cityId}&area_id=${areaId}&ws=3`,
                `jumomind-pickups-${provider}-${cityId}-${areaId}.json`,
            );

            return JSON.parse(pickupData)?.[0]?._data ?? [];
        } else {
            throw new Error('[api-jumomind] Unable to get types - empty cityId');
        }
    }
}

module.exports = SourceApiJumomind;
