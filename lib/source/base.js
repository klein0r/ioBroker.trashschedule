'use strict';

const axios = require('axios').default;

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

    /**
     * @returns {Promise<{ date: any; name: any; description: any; }[]>}
     */
    async getPickupDates() {
        return [];
    }

    getType() {
        return this.type;
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
        const cachePath = `${cacheKey}.json`;

        const fileExists = await this.adapter.fileExistsAsync(this.adapter.namespace, cacheKey);

        let values = '';
        if (!fileExists) {
            values = await this.getApi(url);
            this.adapter.writeFileAsync(this.adapter.namespace, cachePath, Buffer.from(JSON.stringify(values, null, 2)));
            this.adapter.log.debug(`[getApi] Cached data to ${cachePath}`);
        } else {
            this.adapter.log.debug(`[getApi] Loading cached data from ${cachePath}`);

            const cacheFile = await this.adapter.readFileAsync(this.adapter.namespace, cacheKey);
            values = JSON.parse(cacheFile.file.toString());
        }

        return values;
    }
}

module.exports = BaseSource;
