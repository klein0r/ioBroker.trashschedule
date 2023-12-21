'use strict';

const BaseSource = require('./base');
const axios = require('axios').default;
const fs = require('node:fs');
const path = require('node:path');

class SourceApiMymuell extends BaseSource {
    constructor(adapter) {
        super(adapter);
    }

    async validate() {
        return false;
    }

    async refresh() {
        const cityId = this.adapter.config.apiMymuellCityId;
        const [streetId, areaId] = this.adapter.config.apiMymuellStreetId.split('-');

        this.adapter.log.debug(`(0) update started by api - cityId: ${cityId} - streetId: ${streetId} - areaId: ${areaId}`);

        try {
            const apiTypes = await this.getApiTypes(cityId);
            const apiPickups = await this.getApiPickups(cityId, areaId);

            this.adapter.log.debug(`(0) received api data: ${JSON.stringify(apiPickups)}`);

            const data = [];
            for (const pickup of apiPickups[0]._data) {
                const name = apiTypes.find((t) => t.name === pickup.cal_garbage_type)?.title ?? pickup.cal_garbage_type;

                data.push({
                    date: pickup.cal_date,
                    name,
                    description: pickup.cal_comment,
                });
            }

            this.adapter.updateByCalendarTable(data);
        } catch (err) {
            this.adapter.log.error(`(0) unable to parse api data: ${err.toString()}`);
        }
    }

    async getApi(url) {
        this.adapter.log.debug(`Requesting ${url}`);
        const apiResponse = await axios.get(url, { responseType: 'json', timeout: 2000 });
        if (apiResponse.status === 200) {
            return apiResponse.data;
        } else {
            throw new Error(`Unable to get ${url}`);
        }
    }

    async getApiCached(url, cacheKey) {
        const cachePath = path.join(this.getCacheDir(), cacheKey);

        let values = '';
        if (!fs.existsSync(cachePath)) {
            values = await this.getApi(url);
            fs.writeFileSync(cachePath, JSON.stringify(values, null, 2));

            this.adapter.log.debug(`[getApi] Cached data to ${cachePath}`);
        } else {
            this.adapter.log.debug(`[getApi] Loading cached data from ${cachePath}`);

            values = JSON.parse(String(fs.readFileSync(cachePath)));
        }

        return values;
    }

    async getApiCities() {
        return await this.getApiCached('https://mymuell.jumomind.com/mmapp/api.php?r=cities', 'mymuell-getApiCities.json');
    }

    async getApiStreets(cityId) {
        if (cityId) {
            return await this.getApiCached(`https://mymuell.jumomind.com/mmapp/api.php?r=streets&city_id=${cityId}`, `mymuell-getApiStreets-${cityId}.json`);
        } else {
            throw new Error('Unable to get streets - empty cityId');
        }
    }

    async getApiTypes(cityId) {
        if (cityId) {
            return await this.getApiCached(`https://mymuell.jumomind.com/mmapp/api.php?r=trash&city_id=${cityId}`, `mymuell-getApiTypes-${cityId}.json`);
        } else {
            throw new Error('Unable to get types - empty cityId');
        }
    }

    async getApiPickups(cityId, areaId) {
        if (cityId) {
            return await this.getApiCached(`https://mymuell.jumomind.com/webservice.php?idx=termins&city_id=${cityId}&area_id=${areaId}&ws=3`, `mymuell-getApiPickups-${cityId}-${areaId}.json`);
        } else {
            throw new Error('Unable to get types - empty cityId');
        }
    }
}

module.exports = SourceApiMymuell;
