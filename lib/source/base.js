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
        const apiResponse = await axios.get(url, { responseType: 'text', transformResponse: (res) => res, timeout: 2000, headers: { 'User-Agent': 'Mozilla/5.0 (xxxx Windows NT 10.0; Win64; x64)' } });
        if (apiResponse.status === 200) {
            return apiResponse.data;
        } else {
            throw new Error(`Unable to get ${url}`);
        }
    }

    async getApiCached(url, cacheKey) {
        const fileExists = await this.adapter.fileExistsAsync(this.adapter.namespace, cacheKey);

        let values = '';
        if (!fileExists) {
            values = await this.getApi(url);

            this.adapter.writeFileAsync(this.adapter.namespace, cacheKey, values);
            this.adapter.log.debug(`[getApi] Cached data to ${cacheKey}`);
        } else {
            this.adapter.log.debug(`[getApi] Loading cached data from ${cacheKey}`);

            const cacheFile = await this.adapter.readFileAsync(this.adapter.namespace, cacheKey);
            values = cacheFile.file.toString();
        }

        return values;
    }

    async removeOldCacheFiles() {
        try {
            const dirExists = await this.adapter.fileExistsAsync(this.adapter.namespace, '/');
            if (dirExists) {
                this.adapter.log.debug(`[removeOldCacheFiles] Removing old cache files...`);

                const files = await this.adapter.readDirAsync(this.adapter.namespace, '/');
                const d = new Date();

                for (const file of files) {
                    if (!file.isDir && file.modifiedAt) {
                        const dModified = new Date(file.modifiedAt);

                        // Delete files created in another month
                        if (dModified.getUTCMonth() !== d.getUTCMonth() && dModified.getUTCFullYear() !== d.getUTCFullYear()) {
                            await this.adapter.delFileAsync(this.adapter.namespace, file.file);
                            this.adapter.log.info(`[removeOldCacheFiles] Deleted cached file: ${file.file}`);
                        }
                    }
                }
            }
        } catch (err) {
            this.adapter.log.warn(`[removeOldCacheFiles] ${err}`);
        }
    }
}

module.exports = BaseSource;
