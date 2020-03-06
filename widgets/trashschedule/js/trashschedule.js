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
    toHSL: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);

        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        s = s * 100;
        s = Math.round(s);
        l = l * 100;
        l = Math.round(l);
        h = Math.round(360 * h);

        // Ausgangsfarbe: #00892c, HSL => 139°, 100%, 27%
        // Nach sepia: #3b3529, HSL => 40°, 18%, 20%

        return 'brightness(50%) sepia(1)  hue-rotate(' + (h - 40) + 'deg) saturate(' + (100 + (s - 18)) + '%) brightness(' + (100 + (l - 20)) + '%)';
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
                newItem.find('.dumpster').css('filter', vis.binds['trashschedule'].toHSL(trashType._color));
            }

            target.append(newItem);
        });

    }
};

vis.binds['trashschedule'].showVersion();