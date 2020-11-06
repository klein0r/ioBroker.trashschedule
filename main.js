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

                this.setObjectNotExists('type.' + trashName + '.nextDate', {
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

                this.setObjectNotExists('type.' + trashName + '.nextDateEpoch', {
                    type: 'state',
                    common: {
                        name: 'Next date epoch',
                        type: 'number',
                        role: 'value',
                        read: true,
                        write: false
                    },
                    native: {}
                });

                this.setObjectNotExists('type.' + trashName + '.nextDateFormat', {
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

                this.setObjectNotExists('type.' + trashName + '.nextWeekday', {
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

                this.setObjectNotExists('type.' + trashName + '.daysLeft', {
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

                this.setObjectNotExists('type.' + trashName + '.nextDateFound', {
                    type: 'state',
                    common: {
                        name: 'Date found',
                        type: 'boolean',
                        role: 'value',
                        def: false,
                        read: true,
                        write: false
                    },
                    native: {}
                });

                this.setObjectNotExists('type.' + trashName + '.color', {
                    type: 'state',
                    common: {
                        name: 'Color',
                        type: 'string',
                        role: 'level.color.rgb',
                        read: true,
                        write: false
                    },
                    native: {}
                });
            }
        }

        if (iCalInstance) {
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
            d.setTime(d.getTime() + (offset * 24 * 60 * 60 * 1000));
        }
        return d;
    }

    updateByCalendarTable(data) {
        this.log.debug('updating data');

        // Array should be sorted by date (done by ical)
        if (data && Array.isArray(data) && data.length > 0) {
            this.setState('info.connection', true, true);

            this.log.debug('Start processing ' + data.length + ' iCal events');

            const dateNow = this.getDateWithoutTime(new Date(), 0);
            const hourNow = (new Date()).getHours();

            const trashTypesConfig = this.config.trashtypes;
            const globalOffset = this.config.globaloffset || 0;
            const skipsamedayathour = this.config.skipsamedayathour || 18;

            const jsonSummary = [];
            const filledTypes = [];

            const next = {
                minDays: 999,
                minDate: null,
                minTypes: []
            };

            const nextAfter = {
                minDays: 999,
                minDate: null,
                minTypes: []
            };

            for (const i in data) {
                const entry = data[i];
                const date = this.getDateWithoutTime(new Date(entry._date), globalOffset);

                this.log.debug('(1) parsing next event ' + JSON.stringify(entry));

                // Just future events
                if (date.getTime() >= dateNow.getTime()) {
                    const dayDiff = Math.round((date.getTime() - dateNow.getTime()) / (1000 * 3600 * 24));

                    // Check if event matches trash type and fill information
                    for (const t in trashTypesConfig) {
                        const trashType = trashTypesConfig[t];
                        const trashName = trashType.name.trim();

                        if (dayDiff > 0 || hourNow < skipsamedayathour) {
                            // Fill type if event matches
                            if ((!trashType.exactmatch && entry.event.indexOf(trashType.match) > -1) || (trashType.exactmatch && entry.event == trashType.match)) {

                                this.log.debug('(2) event match: "' + entry.event + '" matches trash type "' + trashName + '" with pattern "' + trashType.match + (trashType.exactmatch ? ' (exact match)' : '') + '"');

                                if (!filledTypes.includes(trashName)) {
                                    filledTypes.push(trashName);

                                    this.setState('type.' + trashName + '.nextDate', {val: date, ack: true});
                                    this.setState('type.' + trashName + '.nextDateEpoch', {val: Math.round(date.getTime() / 1000), ack: true});
                                    this.setState('type.' + trashName + '.nextDateFormat', {val: this.formatDate(date), ack: true});
                                    this.setState('type.' + trashName + '.nextWeekday', {val: date.getDay(), ack: true});
                                    this.setState('type.' + trashName + '.daysLeft', {val: dayDiff, ack: true});
                                    this.setState('type.' + trashName + '.nextDateFound', {val: true, ack: true});
                                    this.setState('type.' + trashName + '.color', {val: trashType.color, ack: true});

                                    jsonSummary.push(
                                        {
                                            name: trashName,
                                            daysLeft: dayDiff,
                                            nextDate: date,
                                            _color: trashType.color
                                        }
                                    );

                                    this.log.debug('(3) filled type: "' + entry.event + '" matches trash type ' + trashType.match + (trashType.exactmatch ? ' (exact match)' : ''));
                                }

                                // Set next type
                                if (next.minTypes.length == 0) {
                                    next.minDays = dayDiff;
                                    next.minDate = date;
                                } else if (nextAfter.minTypes.length == 0) {
                                    nextAfter.minDays = dayDiff;
                                    nextAfter.minDate = date;
                                }

                                if (!next.minTypes.includes(trashName) && next.minDays == dayDiff) {
                                    next.minTypes.push(trashName);
                                } else if (!nextAfter.minTypes.includes(trashName) && nextAfter.minDays == dayDiff) {
                                    nextAfter.minTypes.push(trashName);
                                }
                            }
                        }
                    }
                } else {
                    this.log.debug('Skipped event (event is in the past) ' + JSON.stringify(entry));
                }
            }

            // Check for "unmatched" types
            for (const t in trashTypesConfig) {
                const trashType = trashTypesConfig[t];
                const trashName = trashType.name.trim();

                if (!filledTypes.includes(trashName)) {
                    this.log.warn('no events matches type ' + trashType.name + '. Check configuration of iCal and trashschedule!');

                    // reset values
                    this.setState('type.' + trashName + '.nextDate', {val: '', ack: true});
                    this.setState('type.' + trashName + '.nextDateEpoch', {val: 0, ack: true});
                    this.setState('type.' + trashName + '.nextDateFormat', {val: '', ack: true});
                    this.setState('type.' + trashName + '.nextWeekday', {val: null, ack: true});
                    this.setState('type.' + trashName + '.daysLeft', {val: null, ack: true});
                    this.setState('type.' + trashName + '.nextDateFound', {val: false, ack: true});
                }
            }

            // Sort summary by days left
            jsonSummary.sort(function(a, b){
                return a.daysLeft - b.daysLeft;
            });

            this.setState('type.json', {val: JSON.stringify(jsonSummary), ack: true});

            this.fillNext(next, 'next');
            this.fillNext(nextAfter, 'nextAfter');

        } else {
            this.log.error('no events found in iCal instance - check configuration and restart adapter');

            this.setState('info.connection', false, true);
        }
    }

    fillNext(obj, statePrefix) {

        this.log.debug('fill ' + statePrefix + ' event with data ' + JSON.stringify(obj));

        if (obj.minDays < 999 && obj.minTypes.length > 0) {
            this.setState(statePrefix + '.date', {val: obj.minDate, ack: true});
            this.setState(statePrefix + '.dateEpoch', {val: Math.round(obj.minDate.getTime() / 1000), ack: true});
            this.setState(statePrefix + '.dateFormat', {val: this.formatDate(obj.minDate), ack: true});
            this.setState(statePrefix + '.weekday', {val: obj.minDate.getDay(), ack: true});
            this.setState(statePrefix + '.daysLeft', {val: obj.minDays, ack: true});
            this.setState(statePrefix + '.types', {val: obj.minTypes.join(','), ack: true});
            this.setState(statePrefix + '.typesText', {val: obj.minTypes.join(' ' + this.config.nextseparator + ' '), ack: true});
            this.setState(statePrefix + '.dateFound', {val: true, ack: true});
        } else {
            this.log.warn(statePrefix + ' has no entries. Check configuration of iCal and trashschedule!');

            this.setState(statePrefix + '.date', {val: '', ack: true});
            this.setState(statePrefix + '.dateEpoch', {val: 0, ack: true});
            this.setState(statePrefix + '.dateFormat', {val: '', ack: true});
            this.setState(statePrefix + '.weekday', {val: null, ack: true});
            this.setState(statePrefix + '.daysLeft', {val: null, ack: true});
            this.setState(statePrefix + '.types', {val: 'n/a', ack: true});
            this.setState(statePrefix + '.typesText', {val: 'n/a', ack: true});
            this.setState(statePrefix + '.dateFound', {val: false, ack: true});
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
