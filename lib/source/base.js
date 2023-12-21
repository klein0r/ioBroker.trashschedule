'use strict';

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
}

module.exports = BaseSource;
