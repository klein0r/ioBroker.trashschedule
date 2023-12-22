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

    async getApiCached(url, cacheKey, everyMonth) {
        let cachePath = `${cacheKey}.json`;

        if (everyMonth === true) {
            // will create a new file every month
            const d = new Date();
            const m = String(d.getUTCMonth() + 1).padStart(2, '0');
            const y = d.getUTCFullYear();

            cachePath = `${cacheKey}-${y}_${m}_.json`;
        }

        const fileExists = await this.adapter.fileExistsAsync(this.adapter.namespace, cacheKey);

        let values = '';
        if (!fileExists) {
            values = await this.getApi(url);
            this.adapter.writeFileAsync(this.adapter.namespace, cachePath, JSON.stringify(values, null, 2));
            this.adapter.log.debug(`[getApi] Cached data to ${cachePath}`);
        } else {
            this.adapter.log.debug(`[getApi] Loading cached data from ${cachePath}`);

            const cacheFile = await this.adapter.readFileAsync(this.adapter.namespace, cacheKey);
            values = JSON.parse(cacheFile.file.toString());
        }

        return values;
    }

    async removeOldCacheFiles() {
        const files = await this.adapter.readDirAsync(this.adapter.namespace, '/');
        const d = new Date();

        for (const file of files) {
            if (!file.isDir && file.modifiedAt && file.file.endsWith('.json')) {
                const dModified = new Date(file.modifiedAt);

                // Delete files created in another month
                if (dModified.getUTCMonth() !== d.getUTCMonth() && dModified.getUTCFullYear() !== d.getUTCFullYear()) {
                    await this.adapter.delFileAsync(this.adapter.namespace, file.file);
                    this.adapter.log.info(`[removeOldCacheFiles] Deleted cached file: ${file.file}`);
                }
            }
        }
    }
}

module.exports = BaseSource;
