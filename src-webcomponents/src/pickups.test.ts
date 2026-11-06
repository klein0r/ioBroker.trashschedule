import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getBackgroundImage } from '../../src-widgets/src/trashTypes.ts';
import { formatDate, getCanImage, getInstance, getSource, parsePickups } from './pickups.ts';

void test('the instance of a setting', () => {
    assert.equal(getInstance('trashschedule.0'), 0);
    assert.equal(getInstance('system.adapter.trashschedule.2'), 2);
    assert.equal(getInstance('1'), 1);
    assert.equal(getInstance(3 as unknown as string), 3);
    assert.equal(getInstance(''), null);
    assert.equal(getInstance(undefined), null);
    assert.equal(getInstance('ical.0'), null);
});

void test('the state the settings name', () => {
    assert.deepEqual(getSource({ instance: 'trashschedule.0' }), { id: 'trashschedule.0.type.json' });
    assert.deepEqual(getSource({}), { id: null, problem: 'chooseInstance' });
    // a trash type wins over the instance and carries its own
    assert.deepEqual(getSource({ instance: 'trashschedule.0', trashType: 'trashschedule.1.type.paper' }), {
        id: 'trashschedule.1.type.paper.json',
    });
    // a state of the trash type stands for the trash type
    assert.deepEqual(getSource({ trashType: 'trashschedule.0.type.paper.daysLeft' }), {
        id: 'trashschedule.0.type.paper.json',
    });
    // the channel `type` and its own states mean all trash types
    assert.deepEqual(getSource({ trashType: 'trashschedule.0.type' }), { id: 'trashschedule.0.type.json' });
    assert.deepEqual(getSource({ trashType: 'trashschedule.0.type.completedAll' }), {
        id: 'trashschedule.0.type.json',
    });
    assert.deepEqual(getSource({ trashType: 'hm-rpc.0.ABC' }), { id: null, problem: 'notType' });
});

void test('the trash types of the JSON state the adapter writes', () => {
    const json = JSON.stringify([
        {
            name: 'Paper',
            daysLeft: 0,
            nextDate: 1762383600000,
            _completed: false,
            _description: 'Blue',
            _color: '#2a64c4',
        },
        { name: 'Organic', daysLeft: 2, nextDate: 1762556400000, _completed: true, _color: '#2ca850' },
        { name: 'Residual', daysLeft: 9, nextDate: 1763161200000, _completed: false },
        { name: 'Broken', daysLeft: 'x' },
    ]);
    assert.deepEqual(parsePickups(json), [
        { name: 'Paper', daysLeft: 0, nextDate: 1762383600000, description: 'Blue', color: '#2a64c4' },
        { name: 'Residual', daysLeft: 9, nextDate: 1763161200000, description: '', color: '' },
    ]);
    // no value: the instance never ran
    assert.equal(parsePickups(null), null);
    assert.equal(parsePickups(''), null);
    // a value that is no list shows nothing, like the vis widgets
    assert.deepEqual(parsePickups('{"a":1}'), []);
    assert.deepEqual(parsePickups('not json'), []);
    assert.deepEqual(parsePickups('[]'), []);
});

void test('the date as the vis widgets show it', () => {
    const date = new Date(2026, 10, 10).getTime();
    assert.equal(formatDate(date, 'de-DE', 'hide'), '10.11.');
    assert.equal(formatDate(date, 'de-DE', 'short'), 'Di., 10.11.');
    assert.equal(formatDate(date, 'en-US', 'long'), 'Tuesday, 11/10');
    assert.equal(formatDate(0, 'de-DE', 'long'), '');
});

void test('the can is the one of the vis-2 widget, gray without a color', () => {
    assert.equal(getCanImage('#2a64c4'), getBackgroundImage('#2a64c4'));
    assert.equal(getCanImage(''), getBackgroundImage('#8a8a8a'));
    assert.equal(getCanImage(undefined), getBackgroundImage('#8a8a8a'));
    assert.match(getCanImage('#2a64c4'), /^url\("data:image\/svg\+xml,/);
});
