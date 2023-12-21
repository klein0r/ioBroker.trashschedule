'use strict';

const axios = require('axios').default;
const fs = require('node:fs');
const path = require('node:path');

class BaseSource {
    /**
     * @param {import('@iobroker/adapter-core').AdapterInstance} adapter ioBroker adapter instance
     */
    constructor(adapter, type) {
        this.adapter = adapter;
        this.type = type;
    }

    async validate() {
        return false;
    }

    async getPickupDates() {
        return [];
    }

    getType() {
        return this.type;
    }

    getCacheDir() {
        const cacheDir = path.join(this.adapter.adapterDir, 'cache');

        // create cache dir
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        return cacheDir;
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
}

module.exports = BaseSource;
