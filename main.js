/* jshint -W097 */
/* jshint strict: false */
/* jslint node: true */
'use strict';

const utils = require('@iobroker/adapter-core');

class Trashschedule extends utils.Adapter {

    constructor(options) {
        super({
            ...options,
            name: 'trashschedule'
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    async onReady() {
        let self = this;
        let iCalInstance = this.config.ical;
        let trashTypesConfig = this.config.trashtypes;

        // Create states and channels
        if (trashTypesConfig && Array.isArray(trashTypesConfig)) {
            for (let t in trashTypesConfig) {
                let trashType = trashTypesConfig[t];

                this.setObjectNotExists('type.' + trashType.name, {
                    type: 'channel',
                    common: {
                        name: 'Type ' + trashType.name
                    },
                    native: {}
                });

                this.setObjectNotExists('type.' + trashType.name + '.nextdate', {
                    type: 'state',
                    common: {
                        name: 'Next date',
                        type: 'string',
                        role: 'date.start',
                        read: true,
                        write: false
                    },
                    native: {}
                });

                this.setObjectNotExists('type.' + trashType.name + '.nextdateformat', {
                    type: 'state',
                    common: {
                        name: 'Next date format',
                        type: 'string',
                        role: 'value',
                        read: true,
                        write: false
                    },
                    native: {}
                });

                this.setObjectNotExists('type.' + trashType.name + '.daysleft', {
                    type: 'state',
                    common: {
                        name: 'Days left',
                        type: 'number',
                        role: 'value',
                        unit: 'days',
                        read: true,
                        write: false
                    },
                    native: {}
                });
            }
        }

        if (iCalInstance) {
            this.subscribeStates('*');
            this.subscribeForeignStates(this.config.ical + '.data.table');

            this.getForeignState(this.config.ical + '.data.table', function (err, state) {
                self.updateByCalendarTable(state.val);
            });
        } else {
            this.setState('info.connection', false, true);
        }
    }

    onStateChange(id, state) {
        if (id && state && id == this.config.ical + '.data.table') {
            this.updateByCalendarTable(state.val);
        }
    }

    getDateWithoutTime(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    updateByCalendarTable(data) {
        this.log.debug('updating data');

        // Array should be sorted by date (done by ical)
        if (data && Array.isArray(data)) {
            this.setState('info.connection', true, true);
            let dateNow = this.getDateWithoutTime(new Date());
            let trashTypesConfig = this.config.trashtypes;
            var minDays = 999;
            var minDate = null;
            var minTypes = [];
            var filledTypes = [];

            for (let i in data) {
                let entry = data[i];
                let date = this.getDateWithoutTime(new Date(entry._date));

                this.log.debug('parsing event ' + JSON.stringify(entry));

                // Just future events
                if (date.getTime() >= dateNow.getTime()) {
                    var dayDiff = (date.getTime() - dateNow.getTime()) / (1000 * 3600 * 24);

                    // Check if event matches trash type and fill information
                    for (let t in trashTypesConfig) {
                        let trashType = trashTypesConfig[t];

                        // Fill type if event matches
                        if (entry.event.indexOf(trashType.match) > -1 && !filledTypes.includes(trashType.name)) {
                            filledTypes.push(trashType.name);

                            this.setState('type.' + trashType.name + '.nextdate', {val: date, ack: true});
                            this.setState('type.' + trashType.name + '.nextdateformat', {val: entry.date, ack: true});
                            this.setState('type.' + trashType.name + '.daysleft', {val: dayDiff, ack: true});

                            // Set next type
                            if (minTypes.length == 0) {
                                minDays = dayDiff;
                                minDate = date;
                            }

                            if (minDays == dayDiff) {
                                minTypes.push(trashType.name);
                            }
                        }
                    }
                }
            }

            if (minDays < 999 && minTypes.length > 0) {
                this.setState('next.daysleft', {val: minDays, ack: true});
                this.setState('next.date', {val: minDate, ack: true});
                this.setState('next.types', {val: minTypes.join(','), ack: true});
            }
        } else {
            this.setState('info.connection', false, true);
        }
    }

    onUnload(callback) {
        try {
            this.log.info('cleaned everything up...');
            callback();
        } catch (e) {
            callback();
        }
    }
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new Trashschedule(options);
} else {
    // otherwise start the instance directly
    new Trashschedule();
}