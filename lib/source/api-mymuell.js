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

    async getApi(cachePath, url) {
        let values = '';
        if (!fs.existsSync(cachePath)) {
            const citiesResponse = await axios.get(url, { responseType: 'json', timeout: 2000 });
            if (citiesResponse.status === 200) {
                values = citiesResponse.data;
                fs.writeFileSync(cachePath, JSON.stringify(values, null, 2));
            } else {
                throw new Error(`Unable to get ${url}`);
            }
        } else {
            values = JSON.parse(String(fs.readFileSync(cachePath)));
        }

        return values;
    }

    async getApiCities() {
        const cachePath = path.join(this.adapter.adapterDir, `cache-mymuell-getApiCities.json`);

        const cities = await this.getApi(cachePath, 'https://mymuell.jumomind.com/mmapp/api.php?r=cities');
        return cities;
    }

    async getApiStreets(cityId) {
        const cachePath = path.join(this.adapter.adapterDir, `cache-mymuell-getApiStreets-${cityId}.json`);

        const streets = await this.getApi(cachePath, `https://mymuell.jumomind.com/mmapp/api.php?r=streets&city_id=${cityId}`);
        return streets;
    }
}

module.exports = SourceApiMymuell;
