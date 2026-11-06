/**
 * What `<iob-trashschedule-pickups>` reads and how it draws a trash type - without DOM, so `pickups.test.ts` runs it
 * in Node.
 *
 * Reading the list, the date and the colored can are those of the vis-2 widget (`src-widgets/src/trashTypes.ts`),
 * which a test there compares with the vis-1 widget: the component, vis-1 and vis-2 show the same cans. Imported with
 * the extension, so Node runs it as it is.
 */
import { formatNextDate, getBackgroundImage, visibleTrashTypes } from '../../src-widgets/src/trashTypes.ts';

import type { PickupsSettings } from './constants.ts';

/** How the date shows the weekday - the options of the vis widget */
export type Weekday = 'hide' | 'long' | 'short';

/** What the element shows of one trash type */
export interface Pickup {
    name: string;
    daysLeft: number;
    /** ms, the day of the pickup at 00:00; 0 if unknown */
    nextDate: number;
    description: string;
    /** `#rrggbb` of the configuration of the trash type, empty if it has none */
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

/** The gray of the can of the vis widget: the can of a trash type without a color */
const GRAY = '#8a8a8a';

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
 * The trash types of a JSON state that are not done yet, in the order of the adapter (by days left) - as the vis
 * widget reads them
 *
 * @param val the value of `type.json` or `type.<name>.json`
 * @returns the trash types, or null if the state has no value
 */
export function parsePickups(val: ioBroker.StateValue | undefined): Pickup[] | null {
    if (typeof val !== 'string' || !val) {
        return null;
    }
    const pickups: Pickup[] = [];
    for (const item of visibleTrashTypes(val, 0)) {
        const daysLeft = Number(item.daysLeft);
        if (!Number.isFinite(daysLeft)) {
            continue;
        }
        const description = (item as { _description?: unknown })._description;
        pickups.push({
            name: typeof item.name === 'string' ? item.name : '',
            daysLeft,
            nextDate: Number(item.nextDate) || 0,
            description: typeof description === 'string' ? description : '',
            color: typeof item._color === 'string' ? item._color : '',
        });
    }
    return pickups;
}

/**
 * The date of a pickup as the vis widget shows it: day and month, with the weekday if wanted
 *
 * @param ts the date in ms; 0 gives an empty text
 * @param locale e.g. `de-DE`
 * @param weekday `hide`, `long` or `short`
 */
export function formatDate(ts: number, locale: string, weekday: Weekday): string {
    if (!ts) {
        return '';
    }
    try {
        return formatNextDate(ts, locale, weekday);
    } catch {
        // a locale the browser does not know
        return formatNextDate(ts, 'en-US', weekday);
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

/**
 * The can of the vis widget in the color of a trash type, for `background-image`
 *
 * @param color `#rrggbb` of the trash type; gray if it has none
 * @returns `url("data:image/svg+xml,...")`
 */
export function getCanImage(color: string | undefined): string {
    return getBackgroundImage(color) || getBackgroundImage(GRAY) || '';
}
