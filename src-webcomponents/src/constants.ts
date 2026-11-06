/** Tag of the custom element; a host checks that the module defines exactly this one */
export const TAG = 'iob-trashschedule-pickups';

/** The built module, next to its manifest */
export const MODULE_FILE = 'trashschedule-pickups.js';

/** The manifest the build writes next to the module; `common.webComponents` names this one */
export const MANIFEST_FILE = 'trashschedule-pickups.json';

/** Where `tasks.js` puts the module in the admin folder */
export const MODULE_PATH = `webcomponents/${MODULE_FILE}`;

/** The devices widget whose label and description the component takes over (`common.deviceWidgets`) */
export const DEVICES_WIDGET = 'TrashScheduleComponent';

/** The layouts of the element: the cans of the vis widget, or one line per trash type */
export type Layout = 'cans' | 'list';

/** How the date shows the weekday - the options of the vis widget */
export type Weekday = 'hide' | 'long' | 'short';

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

/** One trash type of `type.json` as the adapter writes it (`main.js`, `updateAll`) */
export interface PickupJson {
    name: string;
    daysLeft: number;
    /** ms, the day of the pickup at 00:00 */
    nextDate: number;
    _completed?: boolean;
    _description?: string;
    /** `#rrggbb` of the configuration of the trash type */
    _color?: string;
}

/** What the element shows of one trash type */
export interface Pickup {
    name: string;
    daysLeft: number;
    nextDate: number;
    description: string;
    color: string;
}

/** Where the element reads its trash types */
export interface PickupsSource {
    /** The JSON state: `trashschedule.<n>.type.json` for all, `trashschedule.<n>.type.<name>.json` for one */
    id: string | null;
    /** Why there is none: no instance chosen, or the chosen trash type is none */
    problem?: 'chooseInstance' | 'notType';
}

/** The states of `trashschedule.<n>.type` that are no trash type */
const TYPE_STATES = [
    'json',
    'jsonNotFound',
    'lastRefresh',
    'nextRefresh',
    'resetCompleted',
    'completedToday',
    'completedTomorrow',
    'completedAll',
];

/**
 * The number of the adapter instance a setting names
 *
 * @param instance `trashschedule.0`, `system.adapter.trashschedule.0` or `0`
 * @returns `0`, or null if the setting names no instance of trashschedule
 */
export function getInstance(instance: string | number | undefined): number | null {
    const text = instance === undefined || instance === null ? '' : String(instance).trim();
    const match = text.match(/^(?:(?:system\.adapter\.)?trashschedule\.)?(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
}

/**
 * The JSON state the settings name. A trash type wins over the instance: its ID carries the instance.
 *
 * @param settings the settings of the element
 */
export function getSource(settings: PickupsSettings): PickupsSource {
    const trashType = (settings.trashType || '').trim();
    if (trashType) {
        // the channel itself or one of its states: trashschedule.0.type.paper(.daysLeft)
        const match = trashType.match(/^(trashschedule\.\d+\.type)(?:\.([^.]+))?(?:\.|$)/);
        if (!match) {
            return { id: null, problem: 'notType' };
        }
        return {
            id: !match[2] || TYPE_STATES.includes(match[2]) ? `${match[1]}.json` : `${match[1]}.${match[2]}.json`,
        };
    }
    const instance = getInstance(settings.instance);
    return instance === null ? { id: null, problem: 'chooseInstance' } : { id: `trashschedule.${instance}.type.json` };
}

/**
 * The trash types of a JSON state that are not done yet, in the order of the adapter (by days left)
 *
 * @param val the value of `type.json` or `type.<name>.json`
 * @returns the trash types, or null if the value is no such list
 */
export function parsePickups(val: ioBroker.StateValue | undefined): Pickup[] | null {
    if (typeof val !== 'string' || !val) {
        return null;
    }
    let list: unknown;
    try {
        list = JSON.parse(val);
    } catch {
        return null;
    }
    if (!Array.isArray(list)) {
        return null;
    }
    const pickups: Pickup[] = [];
    for (const item of list as Partial<PickupJson>[]) {
        if (!item || typeof item !== 'object' || item._completed) {
            continue;
        }
        const daysLeft = Number(item.daysLeft);
        if (!Number.isFinite(daysLeft)) {
            continue;
        }
        pickups.push({
            name: typeof item.name === 'string' ? item.name : '',
            daysLeft,
            nextDate: Number(item.nextDate) || 0,
            description: typeof item._description === 'string' ? item._description : '',
            color: typeof item._color === 'string' ? item._color : '',
        });
    }
    return pickups;
}

/**
 * The date of a pickup as the vis widget shows it: day and month, with the weekday if wanted
 *
 * @param ts the date in ms
 * @param locale e.g. `de-DE`; empty for the default of the browser
 * @param weekday `hide`, `long` or `short`
 */
export function formatDate(ts: number, locale: string, weekday: Weekday): string {
    if (!ts) {
        return '';
    }
    const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' };
    if (weekday !== 'hide') {
        options.weekday = weekday;
    }
    try {
        return new Date(ts).toLocaleDateString(locale || undefined, options);
    } catch {
        // an unknown locale
        return new Date(ts).toLocaleDateString(undefined, options);
    }
}

/**
 * The locale of a language of ioBroker
 *
 * @param lang e.g. `de` or `zh-cn`
 */
export function getLocale(lang: string): string {
    return lang === 'zh-cn' ? 'zh-CN' : lang;
}
