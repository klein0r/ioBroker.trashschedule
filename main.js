/* jshint -W097 */
/* jshint strict: false */
/* jslint node: true */
'use strict';

const utils = require('@iobroker/adapter-core');

class Trashschedule extends utils.Adapter {

    constructor(options) {
        super({
            ...options,
            name: 'trashschedule',
            useFormatDate: true
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    async onReady() {
        const self = this;
        const iCalInstance = this.config.ical;
        const trashTypesConfig = this.config.trashtypes;

        // Create states and channels
        if (trashTypesConfig && Array.isArray(trashTypesConfig)) {
            for (const t in trashTypesConfig) {
                const trashType = trashTypesConfig[t];
                const trashName = trashType.name.trim();

                this.setObjectNotExists('type.' + trashName, {
                    type: 'channel',
                    common: {
                        name: 'Type ' + trashName
                    },
                    native: {}
                });

                this.setObjectNotExists('type.' + trashName + '.nextdate', {
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

                this.setObjectNotExists('type.' + trashName + '.nextdateformat', {
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

                this.setObjectNotExists('type.' + trashName + '.nextweekday', {
                    type: 'state',
                    common: {
                        name: 'Next week day',
                        type: 'string',
                        role: 'value',
                        read: true,
                        write: false
                    },
                    native: {}
                });

                this.setObjectNotExists('type.' + trashName + '.daysleft', {
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

    getDateWithoutTime(date, offset) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (offset != 0) {
            d.setTime(d.getTime() +  (offset * 24 * 60 * 60 * 1000));
        }
        return d;
    }

    updateByCalendarTable(data) {
        this.log.debug('updating data');

        // Array should be sorted by date (done by ical)
        if (data && Array.isArray(data)) {
            this.setState('info.connection', true, true);

            const dateNow = this.getDateWithoutTime(new Date(), 0);
            const hourNow = (new Date()).getHours();

            const trashTypesConfig = this.config.trashtypes;
            const globalOffset = this.config.globaloffset || 0;
            const skipsamedayathour = this.config.skipsamedayathour || 18;

            let jsonSummary = [];
            let minDays = 999;
            let minDate = null;
            const minTypes = [];
            const filledTypes = [];

            for (const i in data) {
                const entry = data[i];
                const date = this.getDateWithoutTime(new Date(entry._date), globalOffset);

                this.log.debug('parsing event ' + JSON.stringify(entry));

                // Just future events
                if (date.getTime() >= dateNow.getTime()) {
                    const dayDiff = Math.round((date.getTime() - dateNow.getTime()) / (1000 * 3600 * 24));

                    // Check if event matches trash type and fill information
                    for (const t in trashTypesConfig) {
                        const trashType = trashTypesConfig[t];
                        const trashName = trashType.name.trim();

                        if (dayDiff > 0 || hourNow < skipsamedayathour) {
                            // Fill type if event matches
                            if (
                                !filledTypes.includes(trashName) &&
                                (
                                    (!trashType.exactmatch && entry.event.indexOf(trashType.match) > -1) || 
                                    (trashType.exactmatch && entry.event == trashType.match)
                                )
                                ) {
                                filledTypes.push(trashName);

                                this.setState('type.' + trashName + '.nextdate', {val: date, ack: true});
                                this.setState('type.' + trashName + '.nextdateformat', {val: this.formatDate(date), ack: true});
                                this.setState('type.' + trashName + '.nextweekday', {val: date.getDay(), ack: true});
                                this.setState('type.' + trashName + '.daysleft', {val: dayDiff, ack: true});

                                jsonSummary.push(
                                    {
                                        type: trashName,
                                        daysleft: dayDiff
                                    }
                                );

                                // Set next type
                                if (minTypes.length == 0) {
                                    minDays = dayDiff;
                                    minDate = date;
                                }

                                if (minDays == dayDiff) {
                                    minTypes.push(trashName);
                                }
                            }
                        }
                    }
                }

                this.setState('type.json', {val: JSON.stringify(jsonSummary), ack: true});
            }

            if (minDays < 999 && minTypes.length > 0) {
                this.setState('next.daysleft', {val: minDays, ack: true});
                this.setState('next.date', {val: minDate, ack: true});
                this.setState('next.dateformat', {val: this.formatDate(minDate), ack: true});
                this.setState('next.weekday', {val: minDate.getDay(), ack: true});
                this.setState('next.types', {val: minTypes.join(','), ack: true});
                this.setState('next.typestext', {val: minTypes.join(' ' + this.config.nextseparator + ' '), ack: true});
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