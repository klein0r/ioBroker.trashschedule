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

    async getApi(cacheKey, url) {
        const cachePath = path.join(this.adapter.adapterDir, cacheKey);

        let values = '';
        if (!fs.existsSync(cachePath)) {
            const citiesResponse = await axios.get(url, { responseType: 'json', timeout: 2000 });
            if (citiesResponse.status === 200) {
                values = citiesResponse.data;
                fs.writeFileSync(cachePath, JSON.stringify(values, null, 2));

                this.adapter.log.debug(`[getApi] Cached data to ${cachePath}`);
            } else {
                throw new Error(`Unable to get ${url}`);
            }
        } else {
            this.adapter.log.debug(`[getApi] Loading cached data from ${cachePath}`);

            values = JSON.parse(String(fs.readFileSync(cachePath)));
        }

        return values;
    }

    async getApiCities() {
        return await this.getApi(`cache-mymuell-getApiCities.json`, 'https://mymuell.jumomind.com/mmapp/api.php?r=cities');
    }

    async getApiStreets(cityId) {
        if (cityId) {
            return await this.getApi(`cache-mymuell-getApiStreets-${cityId}.json`, `https://mymuell.jumomind.com/mmapp/api.php?r=streets&city_id=${cityId}`);
        } else {
            throw new Error('Unable to get streets - empty cityId');
        }
    }

    async getApiTypes(cityId) {
        if (cityId) {
            return await this.getApi(`cache-mymuell-getApiTypes-${cityId}.json`, `https://mymuell.jumomind.com/mmapp/api.php?r=trash&city_id=${cityId}`);
        } else {
            throw new Error('Unable to get types - empty cityId');
        }
    }
}

module.exports = SourceApiMymuell;
