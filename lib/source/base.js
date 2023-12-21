'use strict';

const fs = require('node:fs');
const path = require('node:path');

class BaseSource {
    /**
     * @param {import('@iobroker/adapter-core').AdapterInstance} adapter ioBroker adapter instance
     */
    constructor(adapter) {
        this.adapter = adapter;
    }

    async validate() {
        return false;
    }

    async refresh() {
        return false;
    }

    getCacheDir() {
        const cacheDir = path.join(this.adapter.adapterDir, 'cache');

        // create cache dir
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        return cacheDir;
    }
}

module.exports = BaseSource;
