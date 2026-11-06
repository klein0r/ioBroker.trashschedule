/** Tag of the custom element; a host checks that the module defines exactly this one */
export const TAG = 'iob-trashschedule-pickups';

/** The built module, next to its manifest */
export const MODULE_FILE = 'trashschedule-pickups.js';

/** The manifest the build writes next to the module; `common.webComponents` names this one */
export const MANIFEST_FILE = 'trashschedule-pickups.json';

/** Where `tasks.js` puts the module in the admin folder */
export const MODULE_PATH = `webcomponents/${MODULE_FILE}`;

/** The layouts of the element: the cans of the vis widget, or one line per trash type */
export type Layout = 'cans' | 'list';

/** The values of the settings of the manifest; a setting without a value is missing */
export type PickupsSettings = {
    /** Instance of the adapter: `trashschedule.0` (JSON-Config), also `0` or `system.adapter.trashschedule.0` */
    instance?: string;
    /** Optional: the channel of one trash type, `trashschedule.0.type.<name>` - then only this one is shown */
    trashType?: string;
    layout?: string;
    /** How many trash types at most; 0 or missing: all */
    limit?: number;
    showName?: boolean;
    showDate?: boolean;
    dateWeekday?: string;
    /** `de-DE`, `en-US`; empty: the language of the system */
    dateLocale?: string;
    /** The days left glow when there are `glowLimit` days or fewer */
    glow?: boolean;
    glowLimit?: number;
};
