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

                            if (trashType.color) {
                                this.extendObjectAsync('type.' + trashNameClean, {
                                    common: {
                                        color: trashType.color
                                    }
                                });
                            }

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.nextDate', {
                                type: 'state',
                                common: {
                                    name: {
                                        en: 'Next pickup - date (' + trashName + ')',
                                        de: 'Nächste Abholung - Datum (' + trashName + ')',
                                        ru: 'Следующий пикап - дата (' + trashName + ')',
                                        pt: 'Próxima coleta - data (' + trashName + ')',
                                        nl: 'Volgende afhaling - datum (' + trashName + ')',
                                        fr: 'Prochaine collecte - date (' + trashName + ')',
                                        it: 'Prossimo ritiro - data (' + trashName + ')',
                                        es: 'Próxima recogida: fecha (' + trashName + ')',
                                        pl: 'Następny odbiór — data (' + trashName + ')',
                                        'zh-cn': '下次取件 - 日期 (' + trashName + ')'
                                    },
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
                                    name: {
                                        en: 'Next pickup - date formatted (' + trashName + ')',
                                        de: 'Nächste Abholung - Datum formatiert (' + trashName + ')',
                                        ru: 'Следующее получение - дата в формате (' + trashName + ')',
                                        pt: 'Próxima coleta - data formatada (' + trashName + ')',
                                        nl: 'Volgende afhaling - datum geformatteerd (' + trashName + ')',
                                        fr: 'Prochaine collecte - date formatée (' + trashName + ')',
                                        it: 'Prossimo ritiro - data formattata (' + trashName + ')',
                                        es: 'Próxima recogida: fecha formateada (' + trashName + ')',
                                        pl: 'Następny odbiór — sformatowana data (' + trashName + ')',
                                        'zh-cn': '下次取件 - 日期格式化 (' + trashName + ')'
                                    },
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
                                    name: {
                                        en: 'Next pickup - description (' + trashName + ')',
                                        de: 'Nächste Abholung - Beschreibung (' + trashName + ')',
                                        ru: 'Следующий пикап - описание (' + trashName + ')',
                                        pt: 'Próxima coleta - descrição (' + trashName + ')',
                                        nl: 'Volgende afhaling - beschrijving (' + trashName + ')',
                                        fr: 'Prochain ramassage - description (' + trashName + ')',
                                        it: 'Prossimo ritiro - descrizione (' + trashName + ')',
                                        es: 'Próxima recogida - descripción (' + trashName + ')',
                                        pl: 'Następny odbiór — opis (' + trashName + ')',
                                        'zh-cn': '下次取件 - 描述 (' + trashName + ')'
                                    },
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
                                    name: {
                                        en: 'Next pickup - weekday (' + trashName + ')',
                                        de: 'Nächste Abholung - Wochentag (' + trashName + ')',
                                        ru: 'Следующий пикап - будний день (' + trashName + ')',
                                        pt: 'Próxima coleta - dia da semana (' + trashName + ')',
                                        nl: 'Volgende afhaling - weekdag (' + trashName + ')',
                                        fr: 'Prochain ramassage - jour de la semaine (' + trashName + ')',
                                        it: 'Prossimo ritiro - giorno della settimana (' + trashName + ')',
                                        es: 'Próxima recogida: día de la semana (' + trashName + ')',
                                        pl: 'Następny odbiór — dzień powszedni (' + trashName + ')',
                                        'zh-cn': '下一个取件 - 工作日 (' + trashName + ')'
                                    },
                                    type: 'number',
                                    role: 'value',
                                    read: true,
                                    write: false
                                },
                                native: {}
                            });

                            await this.setObjectNotExistsAsync('type.' + trashNameClean + '.daysLeft', {
                                type: 'state',
                                common: {
                                    name: {
                                        en: 'Next pickup - days left (' + trashName + ')',
                                        de: 'Nächste Abholung - verbleibende Tage (' + trashName + ')',
                                        ru: 'Следующий самовывоз - осталось дней (' + trashName + ')',
                                        pt: 'Próxima coleta - faltam dias (' + trashName + ')',
                                        nl: 'Volgende afhaling - resterende dagen (' + trashName + ')',
                                        fr: 'Prochain ramassage - jours restants (' + trashName + ')',
                                        it: 'Prossimo ritiro - giorni rimasti (' + trashName + ')',
                                        es: 'Próxima recogida: quedan días (' + trashName + ')',
                                        pl: 'Następny odbiór — pozostały dni (' + trashName + ')',
                                        'zh-cn': '下次取件 - 剩余天数 (' + trashName + ')'
                                    },
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
                                    name: {
                                        en: 'Next pickup - date found (' + trashName + ')',
                                        de: 'Nächste Abholung - Termin gefunden (' + trashName + ')',
                                        ru: 'Следующий пикап - дата нахождения (' + trashName + ')',
                                        pt: 'Próxima coleta - data encontrada (' + trashName + ')',
                                        nl: 'Volgende afhaling - datum gevonden (' + trashName + ')',
                                        fr: 'Prochain ramassage - date trouvée (' + trashName + ')',
                                        it: 'Prossimo ritiro - data trovata (' + trashName + ')',
                                        es: 'Próxima recogida: fecha encontrada (' + trashName + ')',
                                        pl: 'Następny odbiór — znaleziono datę (' + trashName + ')',
                                        'zh-cn': '下次取件 - 找到日期 (' + trashName + ')'
                                    },
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
                                    name: {
                                        en: 'Next pickup - color (' + trashName + ')',
                                        de: 'Nächste Abholung - Farbe (' + trashName + ')',
                                        ru: 'Следующий пикап - цвет (' + trashName + ')',
                                        pt: 'Próxima coleta - cor (' + trashName + ')',
                                        nl: 'Volgende afhaling - kleur (' + trashName + ')',
                                        fr: 'Prochain ramassage - couleur (' + trashName + ')',
                                        it: 'Prossimo ritiro - colore (' + trashName + ')',
                                        es: 'Siguiente recogida - color (' + trashName + ')',
                                        pl: 'Następny odbiór — kolor (' + trashName + ')',
                                        'zh-cn': '下一个拾音器 - 颜色 (' + trashName + ')'
                                    },
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
                    this.setStateAsync('info.connection', false, true);
                }
            }
        );
    }

    refreshEverything() {
        const iCalInstance = this.config.ical;

        this.getForeignState(iCalInstance + '.data.table', (err, state) => {
            // state can be null!
            if (state) {
                this.log.debug('(0) Update started by foreign state value - lc: ' + new Date(state.lc) + ' - ts: ' + new Date(state.ts));
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
            this.log.debug('(0) Update started by foreign state value - lc: ' + new Date(state.lc) + ' - ts: ' + new Date(state.ts));
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

    async updateByCalendarTable(data) {
        this.log.debug('(0) updating data');

        // Added compatibility with iCal 1.10.0
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                this.log.error('(0) unable to parse iCal json: ' + e.toString());
            }
        }

        // Array should be sorted by date (done by ical)
        if (data && Array.isArray(data) && data.length > 0) {
            await this.setStateAsync('info.connection', true, true);

            this.log.debug('(0) start processing ' + data.length + ' iCal events');

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

                                        await this.setStateAsync('type.' + trashNameClean + '.nextDate', {val: date.getTime(), ack: true});
                                        await this.setStateAsync('type.' + trashNameClean + '.nextDateFormat', {val: this.formatDate(date), ack: true});
                                        await this.setStateAsync('type.' + trashNameClean + '.nextWeekday', {val: date.getDay(), ack: true});
                                        await this.setStateAsync('type.' + trashNameClean + '.daysLeft', {val: dayDiff, ack: true});
                                        await this.setStateAsync('type.' + trashNameClean + '.nextDateFound', {val: true, ack: true});
                                        await this.setStateAsync('type.' + trashNameClean + '.color', {val: trashType.color, ack: true});

                                        // Do not store objects as value
                                        if (typeof entry._section !== 'object') {
                                            await this.setStateAsync('type.' + trashNameClean + '.nextDescription', {val: entry._section, ack: true});
                                        }

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
                    await this.setStateAsync('type.' + trashNameClean + '.nextDate', {val: 0, ack: true});
                    await this.setStateAsync('type.' + trashNameClean + '.nextDateFormat', {val: '', ack: true});
                    await this.setStateAsync('type.' + trashNameClean + '.nextWeekday', {val: null, ack: true});
                    await this.setStateAsync('type.' + trashNameClean + '.daysLeft', {val: null, ack: true});
                    await this.setStateAsync('type.' + trashNameClean + '.nextDateFound', {val: false, ack: true});
                    await this.setStateAsync('type.' + trashNameClean + '.nextDescription', {val: '', ack: true});
                }
            }

            // Sort summary by days left
            jsonSummary.sort((a, b) => {
                return a.daysLeft - b.daysLeft;
            });

            await this.setStateAsync('type.json', {val: JSON.stringify(jsonSummary), ack: true});

            await this.fillNext(next, 'next');
            await this.fillNext(nextAfter, 'nextAfter');

        } else {
            this.log.error('no events found in iCal instance - check configuration and restart adapter');

            await this.setStateAsync('info.connection', false, true);
        }
    }

    async fillNext(obj, statePrefix) {

        this.log.debug('(5) filling "' + statePrefix + '" event with data: ' + JSON.stringify(obj));

        if (obj.minDays < 999 && obj.minTypes.length > 0) {
            await this.setStateAsync(statePrefix + '.date', {val: obj.minDate.getTime(), ack: true});
            await this.setStateAsync(statePrefix + '.dateFormat', {val: this.formatDate(obj.minDate), ack: true});
            await this.setStateAsync(statePrefix + '.weekday', {val: obj.minDate.getDay(), ack: true});
            await this.setStateAsync(statePrefix + '.daysLeft', {val: obj.minDays, ack: true});
            await this.setStateAsync(statePrefix + '.types', {val: obj.minTypes.join(','), ack: true});
            await this.setStateAsync(statePrefix + '.typesText', {val: obj.minTypes.join(this.config.nextseparator), ack: true});
            await this.setStateAsync(statePrefix + '.dateFound', {val: true, ack: true});
        } else {
            this.log.warn(statePrefix + ' has no entries. Check configuration of iCal and trashschedule!');

            await this.setStateAsync(statePrefix + '.date', {val: 0, ack: true});
            await this.setStateAsync(statePrefix + '.dateFormat', {val: '', ack: true});
            await this.setStateAsync(statePrefix + '.weekday', {val: null, ack: true});
            await this.setStateAsync(statePrefix + '.daysLeft', {val: null, ack: true});
            await this.setStateAsync(statePrefix + '.types', {val: 'n/a', ack: true});
            await this.setStateAsync(statePrefix + '.typesText', {val: 'n/a', ack: true});
            await this.setStateAsync(statePrefix + '.dateFound', {val: false, ack: true});
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
