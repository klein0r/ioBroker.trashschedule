/**
 * The next trash pickups as a web component: `<iob-trashschedule-pickups>`.
 *
 * One module for every host - vis-2, devices, Aura, admin (`@iobroker/web-components`). Its manifest is a file of
 * its own (`trashschedule-pickups.json`, written by the build from `manifest.ts`), so a host loads this module only
 * when it shows the element. The host sets `socket` and `settings`, and if it has them `theme` and `editMode`.
 *
 * The element shows what the vis widgets (vis-1 and vis-2) show: a can per trash type in its color with the days
 * left, its name and the date of the pickup, read from the JSON state the adapter writes -
 * `trashschedule.<n>.type.json` for all trash types, `trashschedule.<n>.type.<name>.json` for one. Trash types that
 * are marked as completed are left out, as in the vis widgets. It writes nothing. The can, its coloring, the date
 * and the reading of the list are the code of the vis-2 widget (`pickups.ts`).
 *
 * Plain DOM, no framework: the module brings everything it needs.
 */
import { defineWebComponent, IobWebComponent } from '@iobroker/web-components/element';

import { TAG, type Layout, type PickupsSettings } from './constants';
import { formatDate, getCanImage, getLocale, getSource, parsePickups, type Pickup, type Weekday } from './pickups';
import { getWord, type WordKey } from './i18n';
import { getGridSize, MAX_GRID_COUNT, STYLES } from './styles';

/** One trash type as it is drawn */
interface ShownPickup {
    name: string;
    days: string;
    date: string;
    color: string;
    glow: boolean;
    title: string;
}

/** What the element draws: a hint, the trash types, or nothing while the data has not arrived */
type View =
    | { kind: 'hint'; text: string }
    | { kind: 'pickups'; layout: Layout; showName: boolean; showDate: boolean; pickups: ShownPickup[] }
    | { kind: 'empty' };

/** What the editor shows while there is no data yet */
const SAMPLE: { word: WordKey; daysLeft: number; color: string }[] = [
    { word: 'paper', daysLeft: 1, color: '#2a64c4' },
    { word: 'organic', daysLeft: 3, color: '#2ca850' },
    { word: 'recycling', daysLeft: 8, color: '#c8b820' },
    { word: 'residual', daysLeft: 15, color: '#545454' },
];

const DAY = 24 * 60 * 60 * 1000;

function element<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className: string,
    text?: string,
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    el.className = className;
    if (text !== undefined) {
        el.textContent = text;
    }
    return el;
}

function drawHint(text: string): HTMLElement {
    const hint = element('div', 'hint');
    const can = element('div', 'mini');
    can.style.backgroundImage = getCanImage(undefined);
    hint.append(can, element('div', 'message', text));
    return hint;
}

function drawCan(pickup: ShownPickup, showName: boolean, showDate: boolean): HTMLElement {
    const item = element('div', pickup.glow ? 'item glow' : 'item');
    // the can leaves room for the name and the date that are shown
    item.classList.toggle('with-name', showName);
    item.classList.toggle('with-date', showDate);
    item.title = pickup.title;
    if (showName) {
        item.append(element('div', 'name', pickup.name));
    }
    const area = element('div', 'can-area');
    const can = element('div', 'can');
    can.style.backgroundImage = getCanImage(pickup.color);
    can.append(element('span', 'days', pickup.days));
    area.append(can);
    item.append(area);
    if (showDate) {
        item.append(element('div', 'date', pickup.date));
    }
    return item;
}

function drawRow(pickup: ShownPickup, showName: boolean, showDate: boolean): HTMLElement {
    const row = element('div', pickup.glow ? 'row glow' : 'row');
    row.title = pickup.title;
    const can = element('div', 'mini');
    can.style.backgroundImage = getCanImage(pickup.color);
    const text = element('div', 'text');
    if (showName) {
        text.append(element('div', 'name', pickup.name));
    }
    if (showDate) {
        text.append(element('div', 'date', pickup.date));
    }
    row.append(can, text, element('div', 'days', pickup.days));
    return row;
}

function drawPickups(view: Extract<View, { kind: 'pickups' }>, editMode: boolean): HTMLElement {
    const count = view.pickups.length;
    const box = element('div', `pickups ${view.layout}${editMode ? ' edit' : ''}`);
    if (view.layout === 'list') {
        box.style.setProperty('--count', String(count));
        box.append(...view.pickups.map(pickup => drawRow(pickup, view.showName, view.showDate)));
    } else {
        // up to MAX_GRID_COUNT the container queries of the styles choose the grid
        box.classList.add(`n${count}`);
        if (count > MAX_GRID_COUNT) {
            const { rows, cols } = getGridSize(count);
            box.style.setProperty('--rows', String(rows));
            box.style.setProperty('--cols', String(cols));
        }
        box.append(...view.pickups.map(pickup => drawCan(pickup, view.showName, view.showDate)));
    }
    return box;
}

class TrashSchedulePickups extends IobWebComponent<PickupsSettings> {
    readonly #mount: HTMLDivElement;

    /** What is drawn now: the DOM is built again only when it changes, so a glow keeps running */
    #drawn = '';

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = STYLES;
        this.#mount = document.createElement('div');
        this.#mount.className = 'mount';
        shadow.append(style, this.#mount);
    }

    protected override getStateIds(settings: PickupsSettings): (string | null)[] {
        return [getSource(settings).id];
    }

    protected override render(): void {
        const view = this.#getView();
        const editMode = this.editMode;
        const key = JSON.stringify([view, editMode]);
        if (key === this.#drawn) {
            return;
        }
        this.#drawn = key;
        if (view.kind === 'hint') {
            this.#mount.replaceChildren(drawHint(view.text));
        } else if (view.kind === 'pickups') {
            this.#mount.replaceChildren(drawPickups(view, editMode));
        } else {
            this.#mount.replaceChildren();
        }
    }

    #getView(): View {
        const settings = this.settings;
        const lang = this.systemLang;
        const source = getSource(settings);
        if (!source.id) {
            return { kind: 'hint', text: getWord(lang, source.problem || 'chooseInstance') };
        }

        let pickups: Pickup[] | null = null;
        const state = this.states[source.id];
        if (state !== undefined) {
            pickups = parsePickups(state?.val);
        }
        if (!pickups && this.editMode) {
            // the editor shows how it will look
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            pickups = SAMPLE.map(sample => ({
                name: getWord(lang, sample.word),
                daysLeft: sample.daysLeft,
                nextDate: today.getTime() + sample.daysLeft * DAY,
                description: '',
                color: sample.color,
            }));
        }
        if (!pickups) {
            // nothing while the state has not arrived; no value: the instance never ran
            return state === undefined ? { kind: 'empty' } : { kind: 'hint', text: getWord(lang, 'noData') };
        }

        const limit = Math.max(0, Math.floor(Number(settings.limit) || 0));
        if (limit) {
            pickups = pickups.slice(0, limit);
        }
        if (!pickups.length) {
            return { kind: 'hint', text: getWord(lang, 'noPickups') };
        }

        const weekday: Weekday =
            settings.dateWeekday === 'hide' || settings.dateWeekday === 'short' ? settings.dateWeekday : 'long';
        const locale = settings.dateLocale || getLocale(lang);
        const glowLimit = settings.glowLimit ?? 1;
        const daysLeft = getWord(lang, 'daysLeft');

        return {
            kind: 'pickups',
            layout: settings.layout === 'list' ? 'list' : 'cans',
            showName: settings.showName !== false,
            showDate: settings.showDate !== false,
            pickups: pickups.map(pickup => {
                const date = formatDate(pickup.nextDate, locale, weekday);
                return {
                    name: pickup.name,
                    days: String(pickup.daysLeft),
                    date,
                    color: pickup.color,
                    glow: !!settings.glow && pickup.daysLeft <= glowLimit,
                    title: [
                        pickup.name,
                        formatDate(pickup.nextDate, locale, 'long'),
                        `${daysLeft}: ${pickup.daysLeft}`,
                        pickup.description,
                    ]
                        .filter(Boolean)
                        .join('\n'),
                };
            }),
        };
    }
}

defineWebComponent(TAG, TrashSchedulePickups);
