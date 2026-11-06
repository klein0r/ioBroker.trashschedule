/**
 * The styles of the shadow root. The element fills the box of the host; it has a transparent background and
 * inherits `color` and `font`, so it follows the theme of the host. The cans keep the colors of their trash types;
 * the days on a can are drawn on the can, the rest takes the colors of the theme.
 *
 * Nothing is measured: the box is a size container (`trashschedule`), and the cans arrange themselves in it by
 * container queries. For every number of cans there is the grid of rows and columns that gives each can the most
 * room at the aspect ratio of the box, see `getGridRules()`. Every cell and every line of the list is a size
 * container of its own, so the texts and the can scale with it.
 */

/** Width : height of a can with its name and date that looks right - the can alone is 0.61 */
const ITEM_ASPECT = 0.55;

/** For more cans the grid is fixed by `getGridSize()`; a host never shows that many trash types side by side */
export const MAX_GRID_COUNT = 12;

/**
 * Rows and columns for a number of cans, as the vis widget shows them: in one row
 *
 * @param count the number of cans
 * @param aspect width : height of the box
 */
function getBestGrid(count: number, aspect: number): { rows: number; cols: number } {
    let best = { rows: count, cols: 1 };
    let bestSize = -1;
    // more rows first: the same size with more rows fills a square box better
    for (let rows = count; rows >= 1; rows--) {
        const cols = Math.ceil(count / rows);
        if (Math.ceil(count / cols) !== rows) {
            // the same columns with fewer rows
            continue;
        }
        // the height of a can relative to the box, limited by the width or by the height of its cell
        const size = Math.min(aspect / (ITEM_ASPECT * cols), 1 / rows);
        if (size > bestSize + 1e-9) {
            best = { rows, cols };
            bestSize = size;
        }
    }
    return best;
}

/**
 * The grid for more cans than `MAX_GRID_COUNT`, for a box of the default size
 *
 * @param count the number of cans
 */
export function getGridSize(count: number): { rows: number; cols: number } {
    return getBestGrid(count, 2);
}

/**
 * The container queries that choose the grid: for each number of cans, from the narrowest box to the widest. A later
 * rule wins over an earlier one, so each one needs a lower limit only.
 */
function getGridRules(): string {
    const rules: string[] = [];
    for (let count = 2; count <= MAX_GRID_COUNT; count++) {
        let last = '';
        // from 1 : 20 to 20 : 1, in steps of 0.5 %
        for (let step = 0; step <= 1200; step++) {
            const aspect = Math.exp(Math.log(0.05) + (step * Math.log(400)) / 1200);
            const { rows, cols } = getBestGrid(count, aspect);
            const grid = `--rows: ${rows}; --cols: ${cols};`;
            if (grid !== last) {
                const selector = `.cans.n${count}`;
                rules.push(
                    last
                        ? `@container trashschedule (aspect-ratio >= ${Math.round(aspect * 1000)} / 1000) { ${selector} { ${grid} } }`
                        : `${selector} { ${grid} }`,
                );
                last = grid;
            }
        }
    }
    return rules.join('\n');
}

export const STYLES = `
:host {
    display: block;
    width: 100%;
    height: 100%;
}
.mount {
    width: 100%;
    height: 100%;
    /* the size of the box does not depend on what is in it */
    container-type: size;
    container-name: trashschedule;
}
.pickups {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}
.edit {
    pointer-events: none;
}
.name,
.date {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25;
}
.name {
    font-weight: 700;
}
.date {
    color: var(--iob-text-secondary);
}

/* the cans of the vis widget */
.cans {
    display: grid;
    grid-template-columns: repeat(var(--cols, 1), minmax(0, 1fr));
    grid-template-rows: repeat(var(--rows, 1), minmax(0, 1fr));
    gap: clamp(2px, 2cqmin, 12px);
    padding: clamp(2px, 2cqmin, 8px);
}
.item {
    container-type: size;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.item .name {
    flex: none;
    margin-bottom: 2cqh;
    font-size: max(8px, min(11cqw, 8.5cqh));
}
.item .date {
    flex: none;
    margin-top: 2cqh;
    font-size: max(7px, min(9cqw, 7cqh));
}
.can-area {
    flex: 1 1 0;
    min-height: 0;
    width: 100%;
    container-type: size;
    display: flex;
    align-items: center;
    justify-content: center;
}
.can {
    position: relative;
    flex: none;
    /* the proportions of the drawing: 372.57 x 611.89 */
    width: min(100cqw, 60.89cqh);
    height: min(100cqh, 164.23cqw);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}
.days {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}
.can .days {
    position: absolute;
    left: 50%;
    top: 63%;
    transform: translateX(-50%);
    width: 42%;
    height: 25%;
    border-radius: 30%;
    /* on the can, not on the page: the same in a light and a dark theme */
    background: rgba(255, 255, 255, 0.4);
    color: #1e1e1e;
    font-size: max(8px, min(12cqh, 19.7cqw));
}

/* one line per trash type */
.list {
    --gap: 2cqh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--gap);
    padding: 2cqh 2cqw;
}
.row {
    container-type: size;
    flex: none;
    width: 100%;
    height: min(calc((96cqh - (var(--count) - 1) * var(--gap)) / var(--count)), 30cqw, 120px);
    display: flex;
    align-items: center;
}
.mini {
    flex: none;
    height: 86cqh;
    width: 52.37cqh;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}
.text {
    flex: 1 1 0;
    min-width: 0;
    /* the room beside the can and the days, by the height of the line: cq units of the row reach its children only */
    padding: 0 max(4px, 25cqh);
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.row .name {
    font-size: max(8px, min(32cqh, 9cqw));
}
.row .date {
    font-size: max(7px, min(25cqh, 7cqw));
}
/* a line too low for the name above the date (a flat tile): the date goes beside the name */
@container (height < 26px) {
    .row .text {
        flex-direction: row;
        align-items: baseline;
        justify-content: flex-start;
        gap: 0.6em;
    }
    .row .name {
        flex: 0 1 auto;
    }
    .row .date {
        flex: 0 100 auto;
    }
}
.row .days {
    flex: none;
    min-width: 2em;
    height: 1.7em;
    padding: 0 0.4em;
    border-radius: var(--iob-border-radius);
    background: color-mix(in srgb, currentColor 12%, transparent);
    font-size: max(8px, min(38cqh, 10cqw));
}

/* the days glow when the pickup is near, like in the vis widget */
@keyframes glow {
    0% {
        box-shadow: 0 0 0 0 var(--iob-error);
    }
    100% {
        box-shadow: 0 0 10px 8px transparent;
    }
}
.glow .days {
    animation: glow 2s ease infinite;
}
@media (prefers-reduced-motion: reduce) {
    .glow .days {
        animation: none;
        box-shadow: 0 0 0 2px var(--iob-error);
    }
}

.hint {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    color: var(--iob-text-secondary);
    font-size: clamp(11px, 6cqmin, 15px);
}
.hint .mini {
    height: clamp(24px, 24cqmin, 64px);
    width: calc(clamp(24px, 24cqmin, 64px) * 0.6089);
    opacity: 0.5;
}

${getGridRules()}
`;
