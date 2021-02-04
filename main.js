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

        this.refreshEverythingTimeout = null;

        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    async onReady() {
        const iCalInstance = this.config.ical;
        const trashTypesConfig = this.config.trashtypes;

        this.getChannelsOf(
            'type',
            async (err, states) => {

                const typesAll = [];
                const typesKeep = [];

                // Collect all types
                if (states) {
                    for (let i = 0; i < states.length; i++) {
                        const id = this.removeNamespace(states[i]._id);

                        // Check if the state is a direct child (e.g. type.YourTrashType)
                        if (id.split('.').length === 2) {
                            typesAll.push(id);
                        }
                    }
                }

                // Create states and channels
                if (trashTypesConfig && Array.isArray(trashTypesConfig)) {
                    for (const t in trashTypesConfig) {
                        const trashType = trashTypesConfig[t];
                        const trashName = trashType.name.trim();
                        const trashNameClean = this.cleanNamespace(trashName);

                        if (trashNameClean && !!trashType.match) {
                            typesKeep.push('type.' + trashNameClean);
                            this.log.debug('Trash type found: "' + trashName + '"');

                            if (trashType.match != trashType.match.trim()) {
                                this.log.info('Attention: Trash type "' + trashName + '" contains leading or trailing whitespaces in the match pattern. This could lead to an unexpected behavior! -> "' + trashType.match + '"');
                            }

                            await this.setObjectNotExistsAsync('type.' + trashNameClean, {
                                type: 'channel',
                                common: {
                                    name: trashName
                                },
                                native: {}
                            });

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.nextDate', {
                                type: 'state',
                                common: {
                                    name: 'Next date ' + trashName,
                                    type: 'number',
                                    role: 'date',
                                    read: true,
                                    write: false
                                },
                                native: {}
                            });

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.nextDateFormat', {
                                type: 'state',
                                common: {
                                    name: 'Next date format ' + trashName,
                                    type: 'string',
                                    role: 'value',
                                    read: true,
                                    write: false
                                },
                                native: {}
                            });

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.nextDescription', {
                                type: 'state',
                                common: {
                                    name: 'Next description ' + trashName,
                                    type: 'string',
                                    role: 'value',
                                    read: true,
                                    write: false
                                },
                                native: {}
                            });

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.nextWeekday', {
                                type: 'state',
                                common: {
                                    name: 'Next week day ' + trashName,
                                    type: 'string',
                                    role: 'value',
                                    read: true,
                                    write: false
                                },
                                native: {}
                            });

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.daysLeft', {
                                type: 'state',
                                common: {
                                    name: 'Days left ' + trashName,
                                    type: 'number',
                                    role: 'value',
                                    unit: 'days',
                                    read: true,
                                    write: false
                                },
                                native: {}
                            });

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.nextDateFound', {
                                type: 'state',
                                common: {
                                    name: 'Date found ' + trashName,
                                    type: 'boolean',
                                    role: 'value',
                                    def: false,
                                    read: true,
                                    write: false
                                },
                                native: {}
                            });

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.color', {
                                type: 'state',
                                common: {
                                    name: 'Color ' + trashName,
                                    type: 'string',
                                    role: 'level.color.rgb',
                                    read: true,
                                    write: false
                                },
                                native: {}
                            });

                        } else {
                            this.log.warn('Skipping invalid/empty trash name or match: ' + trashName);
                        }
                    }
                } else {
                    this.log.warn('No trash types configured');
                }

                // Delete non existent trash types
                for (let i = 0; i < typesAll.length; i++) {
                    const id = typesAll[i];

                    if (typesKeep.indexOf(id) === -1) {
                        this.delObject(id, {recursive: true}, () => {
                            this.log.debug('Trash type deleted: "' + id + '"');
                        });
                    }
                }

                if (iCalInstance) {
                    this.subscribeForeignStates(iCalInstance + '.data.table');

                    this.refreshEverything();
                } else {
                    this.setState('info.connection', false, true);
                }
            }
        );
    }

    refreshEverything() {
        const iCalInstance = this.config.ical;

        this.getForeignState(iCalInstance + '.data.table', (err, state) => {
            // state can be null!
            if (state) {
                this.updateByCalendarTable(state.val);
            }
        });

        // Next Timeout
        const nexTimeoutMilli = this.getMillisecondsToNextFullHour();

        this.log.debug('re-creating refresh timeout in ' + nexTimeoutMilli + 'ms (' + this.convertMillisecondsToDuration(nexTimeoutMilli) + ')');
        this.refreshEverythingTimeout = this.refreshEverythingTimeout || setTimeout(() => {
            this.log.debug('started automatic refresh (every full hour)');

            this.refreshEverythingTimeout = null;
            this.refreshEverything();
        }, nexTimeoutMilli);
    }

    onStateChange(id, state) {
        if (id && state && id == this.config.ical + '.data.table') {
            this.updateByCalendarTable(state.val);
        }
    }

    getMillisecondsToNextFullHour() {
        const now = new Date();
        const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 5, 0);  // add 5 seconds to ensure we are in the next hour

        return nextHour.getTime() - now.getTime();
    }

    convertMillisecondsToDuration(duration) {
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        return hours + ':' + minutes + ':' + seconds;
    }

    getDateWithoutTime(date, offset) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (offset != 0) {
            d.setTime(d.getTime() + (offset * 24 * 60 * 60 * 1000));
        }
        return d;
    }

    cleanNamespace(id) {
        return id
            .trim()
            .replace(/\s/g, '_') // Replace whitespaces with underscores
            .replace(/[^\p{Ll}\p{Lu}\p{Nd}]+/gu, '_') // Replace not allowed chars with underscore
            .replace(/[_]+$/g, '') // Remove underscores end
            .replace(/^[_]+/g, '') // Remove underscores beginning
            .replace(/_+/g, '_') // Replace multiple underscores with one
            .toLowerCase()
            .replace(/_([a-z])/g, (m, w) => {
                return w.toUpperCase();
            });
    }

    removeNamespace(id) {
        const re = new RegExp(this.namespace + '*\.', 'g');
        return id.replace(re, '');
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

            this.log.debug('(0) offset (config): ' + globalOffset);

            for (const i in data) {
                const entry = data[i];
                const date = this.getDateWithoutTime(new Date(entry._date), globalOffset);

                this.log.debug('(1) parsing next event ' + JSON.stringify(entry) + ' // originalDate: ' + entry._date + ' // calculated date (with offset): ' + date);

                // Just future events
                if (date.getTime() >= dateNow.getTime()) {
                    const dayDiff = Math.round((date.getTime() - dateNow.getTime()) / (24 * 60 * 60 * 1000));

                    this.log.debug('(2) processing: ' + entry.event + ' (' + date.getTime() + ') // dayDiff: ' + dayDiff + ' // current hour (date): ' + hourNow + ' (' + dateNow.getTime() + ') // skipsamedayathour (config): ' + skipsamedayathour);

                    // Check if event matches trash type and fill information
                    for (const t in trashTypesConfig) {
                        const trashType = trashTypesConfig[t];
                        const trashName = trashType.name.trim();
                        const trashNameClean = this.cleanNamespace(trashName);

                        if (trashNameClean && !!trashType.match) {
                            if (dayDiff > 0 || hourNow < skipsamedayathour) {
                                // Fill type if event matches
                                if ((!trashType.exactmatch && entry.event.indexOf(trashType.match) > -1) || (trashType.exactmatch && entry.event == trashType.match)) {

                                    this.log.debug('(3) event match: "' + entry.event + '" matches type "' + trashName + '" with pattern "' + trashType.match + (trashType.exactmatch ? ' (exact match)' : '') + '"');

                                    if (!filledTypes.includes(trashName)) {
                                        filledTypes.push(trashName);

                                        this.setState('type.' + trashNameClean + '.nextDate', {val: date.getTime(), ack: true});
                                        this.setState('type.' + trashNameClean + '.nextDateFormat', {val: this.formatDate(date), ack: true});
                                        this.setState('type.' + trashNameClean + '.nextDescription', {val: entry._section, ack: true});
                                        this.setState('type.' + trashNameClean + '.nextWeekday', {val: date.getDay(), ack: true});
                                        this.setState('type.' + trashNameClean + '.daysLeft', {val: dayDiff, ack: true});
                                        this.setState('type.' + trashNameClean + '.nextDateFound', {val: true, ack: true});
                                        this.setState('type.' + trashNameClean + '.color', {val: trashType.color, ack: true});

                                        jsonSummary.push(
                                            {
                                                name: trashName,
                                                daysLeft: dayDiff,
                                                nextDate: date.getTime(),
                                                _description: entry._section,
                                                _color: trashType.color
                                            }
                                        );

                                        this.log.debug('(4) filled type: "' + trashName + '"');
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
                    }
                } else {
                    this.log.debug('Skipped event (event is in the past) ' + JSON.stringify(entry));
                }
            }

            // Check for "unmatched" types
            for (const t in trashTypesConfig) {
                const trashType = trashTypesConfig[t];
                const trashName = trashType.name.trim();
                const trashNameClean = this.cleanNamespace(trashName);

                if (!filledTypes.includes(trashName) && !!trashType.match) {
                    this.log.warn('no events matches type "' + trashName + '" with match "' + trashType.match + '". Check configuration of iCal (increase preview) and trashschedule!');

                    // reset values
                    this.setState('type.' + trashNameClean + '.nextDate', {val: 0, ack: true});
                    this.setState('type.' + trashNameClean + '.nextDateFormat', {val: '', ack: true});
                    this.setState('type.' + trashNameClean + '.nextWeekday', {val: null, ack: true});
                    this.setState('type.' + trashNameClean + '.daysLeft', {val: null, ack: true});
                    this.setState('type.' + trashNameClean + '.nextDateFound', {val: false, ack: true});
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

        this.log.debug('(5) filling "' + statePrefix + '" event with data: ' + JSON.stringify(obj));

        if (obj.minDays < 999 && obj.minTypes.length > 0) {
            this.setState(statePrefix + '.date', {val: obj.minDate.getTime(), ack: true});
            this.setState(statePrefix + '.dateFormat', {val: this.formatDate(obj.minDate), ack: true});
            this.setState(statePrefix + '.weekday', {val: obj.minDate.getDay(), ack: true});
            this.setState(statePrefix + '.daysLeft', {val: obj.minDays, ack: true});
            this.setState(statePrefix + '.types', {val: obj.minTypes.join(','), ack: true});
            this.setState(statePrefix + '.typesText', {val: obj.minTypes.join(this.config.nextseparator), ack: true});
            this.setState(statePrefix + '.dateFound', {val: true, ack: true});
        } else {
            this.log.warn(statePrefix + ' has no entries. Check configuration of iCal and trashschedule!');

            this.setState(statePrefix + '.date', {val: 0, ack: true});
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

            if (this.refreshEverythingTimeout) {
                this.log.debug('clearing refresh timeout');
                clearTimeout(this.refreshEverythingTimeout);
            }

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
