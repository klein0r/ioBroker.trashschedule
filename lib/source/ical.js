'use strict';

const BaseSource = require('./base');

class SourceIcal extends BaseSource {
    constructor(adapter) {
        super(adapter);
    }

    async validate() {
        const iCalInstance = this.adapter.config.ical;
        if (iCalInstance) {
            await this.adapter.subscribeForeignStatesAsync(`${iCalInstance}.data.table`);

            try {
                // Check ical configuration
                const instanceObject = await this.adapter.getForeignObjectAsync(`system.adapter.${iCalInstance}`);

                if (instanceObject && typeof instanceObject === 'object') {
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
}

module.exports = SourceIcal;
