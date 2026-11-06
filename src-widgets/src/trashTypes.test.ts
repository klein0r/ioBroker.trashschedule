import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { formatNextDate, getBackgroundImage, toBool, toInt, visibleTrashTypes } from './trashTypes.ts';

// The vis-1 widget itself is the reference for the look of the vis-2 widget
function loadVis1Binds(): { getBackgroundImage: (color: string) => string } {
    const vis = { binds: {} as Record<string, any>, states: {} };
    const source = readFileSync(new URL('../../widgets/trashschedule/js/trashschedule.js', import.meta.url), 'utf8');
    new Function('$', 'vis', 'systemDictionary', 'console', source)({ extend: () => {} }, vis, {}, { log: () => {} });
    return vis.binds.trashschedule;
}

void test('dumpster colors are identical to the vis-1 widget', () => {
    const vis1 = loadVis1Binds();
    for (const color of [
        '#8a8a8a',
        '#ff0000',
        '#0000FF',
        '#00ff00',
        '#ffff00',
        '#000000',
        '#ffffff',
        '#123456',
        '#f5f5f5',
    ]) {
        assert.equal(getBackgroundImage(color), vis1.getBackgroundImage(color), color);
    }
});

void test('dumpster keeps the css default for missing or invalid colors', () => {
    for (const color of [undefined, '', 'red', '#fff', '#12345g', '#1234567']) {
        assert.equal(getBackgroundImage(color), undefined, String(color));
    }
});

void test('visibleTrashTypes skips completed types and applies the limit', () => {
    const json = JSON.stringify([
        { name: 'Paper', daysLeft: 1 },
        { name: 'Bio', daysLeft: 2, _completed: true },
        { name: 'Rest', daysLeft: 3 },
        { name: 'Yellow', daysLeft: 4 },
    ]);

    assert.deepEqual(
        visibleTrashTypes(json, 0).map(t => t.name),
        ['Paper', 'Rest', 'Yellow'],
    );
    assert.deepEqual(
        visibleTrashTypes(json, 2).map(t => t.name),
        ['Paper', 'Rest'],
    );
});

void test('visibleTrashTypes renders nothing for missing or invalid state values', () => {
    for (const value of [undefined, null, '', 0, '{', '{"name":"x"}', 'null', '[null, 1, "x"]']) {
        assert.deepEqual(visibleTrashTypes(value, 0), [], String(value));
    }
});

void test('attribute values saved by vis-1 are read like vis-1 does', () => {
    assert.equal(toInt('80', 100), 80);
    assert.equal(toInt(80, 100), 80);
    assert.equal(toInt('', 100), 100);
    assert.equal(toInt(undefined, 1), 1);
    assert.equal(toInt('abc', 1), 1);

    assert.equal(toBool(true, false), true);
    assert.equal(toBool('true', false), true);
    assert.equal(toBool('false', true), false);
    assert.equal(toBool(false, true), false);
    assert.equal(toBool(undefined, true), true);
});

void test('formatNextDate follows the weekday setting and ignores invalid dates', () => {
    const date = new Date(2026, 9, 5).getTime();

    assert.equal(formatNextDate(date, 'de-DE', 'hide'), '5.10.');
    assert.equal(formatNextDate(date, 'de-DE', 'long'), 'Montag, 5.10.');
    assert.equal(formatNextDate(date, 'en-US', 'short'), 'Mon, 10/5');
    assert.equal(formatNextDate(undefined, 'de-DE', 'long'), '');
    assert.equal(formatNextDate('not a date', 'de-DE', 'long'), '');
});
