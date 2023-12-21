'use strict';

const BaseSource = require('./base');

class SourceIcal extends BaseSource {
    constructor(adapter) {
        super(adapter, 'ical');
    }

    async validate() {
        const iCalInstance = this.adapter.config.ical;
        if (iCalInstance) {
            try {
                // Check ical configuration
                const instanceObject = await this.adapter.getForeignObjectAsync(`system.adapter.${iCalInstance}`);

                if (instanceObject && typeof instanceObject === 'object') {
                    await this.adapter.subscribeForeignStatesAsync(`${iCalInstance}.data.table`);

                    if (typeof instanceObject.common === 'object') {
                        this.adapter.log.debug(`[ical] current ical version: ${instanceObject.common.version}`);
                    }

                    if (typeof instanceObject.native === 'object') {
                        const daysPreview = instanceObject.native.daysPreview;

                        const maximumPreviewDate = new Date();
                        maximumPreviewDate.setDate(maximumPreviewDate.getDate() + daysPreview);

                        const maximumPreviewDateFormat = this.adapter.formatDate(maximumPreviewDate);
                        this.adapter.log.info(`[ical] configurured ical preview is ${daysPreview} days (until ${maximumPreviewDateFormat}) - increase this value to find more events in the future`);

                        // check for events
                        if (Array.isArray(instanceObject.native.events) && instanceObject.native.events.length > 0) {
                            for (const e in instanceObject.native.events) {
                                const event = instanceObject.native.events[e];
                                this.adapter.log.debug(`[ical] found ical event(s): ${JSON.stringify(event)}`);

                                // check for display flag
                                if (!event.display) {
                                    this.adapter.log.info(
                                        `[ical] found configured ical event "${event.name}" without "display" flag. Activate the display flag on this entry if this is a relevant "trash event".`,
                                    );
                                }
                            }
                        }
                    }

                    return true;
                }
            } catch (err) {
                this.adapter.log.error(JSON.stringify(err));
            }
        } else {
            this.adapter.log.error(`no ical instance configured. Check instance configuration and retry.`);
        }

        return false;
    }

    async getPickupDates() {
        const iCalInstance = this.adapter.config.ical;

        const iCalDataState = await this.adapter.getForeignStateAsync(`${iCalInstance}.data.table`);
        if (iCalDataState && iCalDataState.val) {
            this.adapter.log.debug(`(0) update started by foreign state value - lc: ${new Date(iCalDataState.lc).toISOString()} - ts: ${new Date(iCalDataState.ts).toISOString()}`);

            let stateVal = iCalDataState.val;

            // Added compatibility with iCal >= 1.10.0
            if (typeof stateVal === 'string') {
                try {
                    stateVal = JSON.parse(stateVal);
                } catch (err) {
                    this.adapter.log.error(`(0) unable to parse iCal json: ${err.toString()}`);

                    return [];
                }
            }

            const data = [];
            if (stateVal && Array.isArray(stateVal) && stateVal.length > 0) {
                for (const entry of stateVal) {
                    data.push({
                        date: entry._date,
                        name: entry.event,
                        description: typeof entry._section !== 'object' ? entry._section : '',
                    });
                }
            }

            return data;
        }

        return [];
    }
}

module.exports = SourceIcal;
