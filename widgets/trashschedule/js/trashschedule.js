/*
    ioBroker.vis TrashSchedule Widget-Set

    version: "0.0.4"

    Copyright 2020 Matthias Kleine info@haus-automatisierung.com
*/
'use strict';

// add translations for edit mode
$.get('adapter/trashschedule/words.js', function(script) {
    let translation = script.substring(script.indexOf('{'), script.length);
    translation = translation.substring(0, translation.lastIndexOf(';'));
    $.extend(systemDictionary, JSON.parse(translation));
});

// this code can be placed directly in trashschedule.html
vis.binds['trashschedule'] = {
    version: '0.0.4',
    showVersion: function () {
        if (vis.binds['trashschedule'].version) {
            console.log('Version trashschedule: ' + vis.binds['trashschedule'].version);
            vis.binds['trashschedule'].version = null;
        }
    },
    createWidget: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['trashschedule'].createWidget(widgetID, view, data, style);
            }, 100);
        }

        // update based on current value
        vis.binds['trashschedule'].redraw($div.find('.trashtypes'), vis.states[data.oid + '.val']);

        // subscribe on updates of value
        if (data.oid) {
            vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                vis.binds['trashschedule'].redraw($div.find('.trashtypes'), newVal);
            });
        }
    },
    redraw: function(target, json) {

        const dateOptions = { weekday: 'long', month: 'numeric', day: 'numeric' };

        target.empty();

        $.each(JSON.parse(json), function(i, trashType) {
            var newItem = $('<div class="trashtype"></div>');

            $('<span class="name"></span>').html(trashType.name).appendTo(newItem);
            $('<div class="dumpster"></div>').html(trashType.daysleft).wrapInner('<span class="daysleft"></span>').appendTo(newItem);
            $('<span class="nextdate"></span>').html(new Date(trashType.nextdate).toLocaleDateString('de-DE', dateOptions)).appendTo(newItem);

            if (trashType._color) {
                newItem.css(
                    {
                        "background-color": "red !important"
                    }
                );
            }

            target.append(newItem);
        });

    }
};

vis.binds['trashschedule'].showVersion();