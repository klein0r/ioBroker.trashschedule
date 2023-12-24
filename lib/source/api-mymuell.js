'use strict';

const BaseSource = require('./base');

class SourceApiMymuell extends BaseSource {
    constructor(adapter) {
        super(adapter, 'api-mymuell');
    }

    async validate() {
        const cityId = this.adapter.config.apiMymuellCityId;

        if (cityId) {
            return true;
        } else {
            this.adapter.log.info(`[api-mymuell] no city configured`);
            return false;
        }
    }

    async getPickupDates() {
        const cityId = this.adapter.config.apiMymuellCityId;

        let streetId = undefined;
        let areaId = cityId;

        if (this.adapter.config.apiMymuellStreetId) {
            const streetData = this.adapter.config.apiMymuellStreetId.split('-');
            if (streetData.length == 2) {
                streetId = streetData[0];
                areaId = streetData[1];
            }
        }

        this.adapter.log.debug(`(0) [api-mymuell] update started by api - cityId: "${cityId}" - streetId: "${streetId ?? 'n/a'}" - areaId: "${areaId}"`);

        try {
            const apiTypes = await this.getApiTypes(cityId);
            const apiPickups = await this.getApiPickups(cityId, areaId);

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
            this.adapter.log.error(`(0) [api-mymuell] unable to parse api data: ${err.toString()}`);

            return [];
        }
    }

    async getApiCities() {
        return await this.getApiCached('https://mymuell.jumomind.com/mmapp/api.php?r=cities', 'mymuell-cities');
    }

    async getApiStreets(cityId) {
        if (cityId) {
            return await this.getApiCached(`https://mymuell.jumomind.com/mmapp/api.php?r=streets&city_id=${cityId}`, `mymuell-streets-${cityId}`);
        } else {
            throw new Error('[api-mymuell] Unable to get streets - empty cityId');
        }
    }

    async getApiTypes(cityId) {
        if (cityId) {
            return await this.getApiCached(`https://mymuell.jumomind.com/mmapp/api.php?r=trash&city_id=${cityId}`, `mymuell-types-${cityId}`);
        } else {
            throw new Error('[api-mymuell] Unable to get types - empty cityId');
        }
    }

    async getApiPickups(cityId, areaId) {
        if (cityId) {
            const pickupData = await this.getApiCached(`https://mymuell.jumomind.com/webservice.php?idx=termins&city_id=${cityId}&area_id=${areaId}&ws=3`, `mymuell-pickups-${cityId}-${areaId}`, true);

            return pickupData?.[0]?._data ?? [];
        } else {
            throw new Error('[api-mymuell] Unable to get types - empty cityId');
        }
    }
}

module.exports = SourceApiMymuell;
