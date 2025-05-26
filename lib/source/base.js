'use strict';

const axios = require('axios').default;

class BaseSource {
    /**
     * @param {import('@iobroker/adapter-core').AdapterInstance} adapter ioBroker adapter instance
     * @param type
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

    async getApi(config) {
        if (typeof config === 'string') {
            config = {
                baseURL: config,
            };
        }

        this.adapter.log.debug(`[getApi] Requesting ${JSON.stringify(config)}`);
        const apiResponse = await axios({
            method: 'get',
            responseType: 'text',
            transformResponse: res => res,
            timeout: 2000,
            ...config,
        });

        if (apiResponse.status === 200) {
            return apiResponse.data;
        }
        throw new Error(`Unable to get ${config}`);
    }

    async getApiCached(config, cacheKey) {
        const fileExists = await this.adapter.fileExistsAsync(this.adapter.namespace, cacheKey);

        let values = '';
        if (!fileExists) {
            values = await this.getApi(config);

            this.adapter.writeFileAsync(this.adapter.namespace, cacheKey, values);
            this.adapter.log.debug(`[getApiCached] Cached data to ${cacheKey}`);
        } else {
            this.adapter.log.debug(`[getApiCached] Loading cached data from ${cacheKey}`);

            const cacheFile = await this.adapter.readFileAsync(this.adapter.namespace, cacheKey);
            values = cacheFile.file.toString();
        }

        return values;
    }

    async removeOldCacheFiles() {
        try {
            this.adapter.log.debug(`[removeOldCacheFiles] Removing old cache files...`);

            const files = await this.adapter.readDirAsync(this.adapter.namespace, '/');
            const d = new Date();

            for (const file of files) {
                if (!file.isDir && file.modifiedAt) {
                    const dModified = new Date(file.modifiedAt);

                    // Delete files created in another month
                    if (
                        `${d.getUTCFullYear()}-${d.getUTCMonth()}` !==
                        `${dModified.getUTCFullYear()}-${dModified.getUTCMonth()}`
                    ) {
                        await this.adapter.delFileAsync(this.adapter.namespace, file.file);
                        this.adapter.log.info(`[removeOldCacheFiles] Deleted cached file: ${file.file}`);
                    } else {
                        this.adapter.log.debug(
                            `[removeOldCacheFiles] Keeping cached file: ${file.file} from ${dModified.toISOString()}`,
                        );
                    }
                }
            }
        } catch (err) {
            this.adapter.log.warn(`[removeOldCacheFiles] ${err}`);
        }
    }
}

module.exports = BaseSource;
