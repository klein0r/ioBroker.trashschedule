/*
    ioBroker.vis TrashSchedule Widget-Set

    version: "0.0.7"

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
    version: '0.0.7',
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
    rgbToHsl: function(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }

        return [ h, s, l ];
    },
    hslToRgb: function(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [
            Math.max(0, Math.min(Math.round(r * 255), 255)),
            Math.max(0, Math.min(Math.round(g * 255), 255)),
            Math.max(0, Math.min(Math.round(b * 255), 255))
        ];
    },
    getRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);

        return [r, g, b];
    },
    getHsl: function(hex) {
        var result = this.getRgb(hex);

        var r = result[0];
        var g = result[1];
        var b = result[2];

        return this.rgbToHsl(r, g, b);
    },
    getShiftedColor: function(hex, lightnessShift) {
        var hsl = this.getHsl(hex);
        var rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2] + lightnessShift);

        return rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
    },
    getBackgroundImage: function(color) {

        const newColor = /^#?([a-f\d]{6})$/i.exec(color);
        let rgb = newColor[1];

        // Ausgangsfarbe: #8a8a8a

        /*
            #8a8a8a -> 0°, 0%, 54%

            #363636 -> 0°, 0%, 21% -> -33 (MIN 33% required for correction - not lower)
            #595959 -> 0°, 0%, 35% -> -19
            #666666 -> 0°, 0%, 40% -> -14
            #6e6e6e -> 0°, 0%, 43% -> -11
            #707070 -> 0°, 0%, 44% -> -10
            #9e9e9e -> 0°, 0%, 62% -> + 8
            #a3a3a3 -> 0°, 0%, 64% -> +10
            #a6a6a6 -> 0°, 0%, 65% -> +11 (MAX 89% required for correction - not higher)
        */

        // Color correction (if source is too light or too dark)
        var hsl = this.getHsl(rgb);
        if (hsl[2] < .33) {
            rgb = this.getShiftedColor(rgb, (.33 - hsl[2]));
        } else if (hsl[2] > .89) {
            rgb = this.getShiftedColor(rgb, -(hsl[2] - .89));
        }

        let svg = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 372.57144 611.88544'%3E%3Cdefs%3E%3Cfilter id='d'%3E%3CfeGaussianBlur stdDeviation='1.88219'/%3E%3C/filter%3E%3Cfilter id='e' x='-.13781' y='-.04479' width='1.2756' height='1.0896'%3E%3CfeGaussianBlur stdDeviation='.79176'/%3E%3C/filter%3E%3ClinearGradient id='a'%3E%3Cstop stop-color='%23363636' offset='0'/%3E%3Cstop stop-color='%23363636' stop-opacity='0' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b'%3E%3Cstop stop-color='%23666666' offset='0'/%3E%3Cstop stop-color='%23595959' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='c'%3E%3Cstop stop-color='%23707070' offset='0'/%3E%3Cstop stop-color='%23595959' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='l' x1='174.29' x2='183.57' y1='335' y2='577.86' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%236e6e6e' offset='0'/%3E%3Cstop stop-color='%238a8a8a' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='m' x2='0' y1='230.07' y2='401.07' gradientUnits='userSpaceOnUse' xlink:href='%23c'/%3E%3ClinearGradient id='k' x2='0' y1='108.98' y2='-102.96' gradientUnits='userSpaceOnUse' xlink:href='%23c'/%3E%3ClinearGradient id='j' x1='171.99' x2='193.73' y1='96.159' y2='56.561' gradientUnits='userSpaceOnUse' xlink:href='%23b'/%3E%3ClinearGradient id='i' x1='171.99' x2='193.73' y1='513.74' y2='474.14' gradientUnits='userSpaceOnUse' xlink:href='%23b'/%3E%3ClinearGradient id='h' x2='0' y1='165.39' y2='25.449' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3ClinearGradient id='g' x2='0' y1='283.54' y2='205.98' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3ClinearGradient id='f' x2='0' y1='282.84' y2='205.27' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3C/defs%3E%3Cpath d='m61.143 176h254.29c20.577 0 31.143-18.053 37.143-46.036l20-83.928c0-25.504-16.566-46.036-37.143-46.036h-294.29c-20.577 0-37.143 20.532-37.143 46.036l20 83.928c8 27.363 16.566 46.036 37.143 46.036z' fill='url(%23k)'/%3E%3Cpath d='m76.467 165.39h223.64c18.097 0 27.389-15.877 32.666-40.488l17.589-73.812c0-22.43-14.569-40.488-32.666-40.488h-258.82c-18.097 0-32.666 18.057-32.666 40.488l17.589 73.812c7.0358 24.065 14.569 40.488 32.666 40.488z' fill='url(%23h)' opacity='.25'/%3E%3Cpath d='m358.9 289.24-41.378 291.4c0 14.882-11.98 26.862-26.862 26.862h-212.83c-14.881 0-26.862-11.98-26.862-26.862l-42.739-290.04 350.67-1.362z' fill='url(%23l)'/%3E%3Cpath d='m20.977 290.54-12.75 0.03101 42.75 290.06c0 11.835 7.572 21.844 18.157 25.437-2.415-4.3701-3.813-9.412-3.813-14.781l-44.344-300.75z' fill='%23a3a3a3'/%3E%3Cpath d='m29.019 291.84-12.75 0.03119 42.75 290.06c0 7.9506 3.0632 17.905 8.5147 22.816 2.6639 2.3997 6.1672 1.442 9.6416 2.6215-2.4143-4.3704-3.8125-9.4116-3.8125-14.781l-44.344-300.75v6.1e-5z' fill='%23a3a3a3' filter='url(%23d)'/%3E%3Cpath d='m340.42 293.96 12.75 0.03119-42.75 290.06c0 8.6726-4.0655 16.364-10.403 21.27-2.3113 1.7891-4.2178 1.0863-7.0465 2.0466 2.4143-4.3704 3.1054-7.2903 3.1054-12.66l44.344-300.75v6.1e-5z' fill='%23a3a3a3' filter='url(%23d)'/%3E%3Cpath d='m348.11 290.54 12.75 0.03101-42.75 290.06c0 11.835-7.572 21.844-18.156 25.437 2.414-4.3701 3.812-9.412 3.812-14.781l44.344-300.75z' fill='%23a3a3a3'/%3E%3Cpath d='m1.089 282.9 10.375 70.406c6.7593 7.2021 16.385 11.688 27.094 11.688h294.31c9.9557 0 18.974-3.8856 25.625-10.219l9.0312-63.531c-5.3515 13.922-18.805 23.75-34.656 23.75h-294.31c-18.866 0-34.335-13.918-36.781-32.094h-0.6875z' fill='%238a8a8a'/%3E%3Cpath d='m57.143 176h254.29c20.577 0 31.143 14.566 37.143 37.143l20 67.714c0 20.577-16.566 37.143-37.143 37.143h-294.29c-20.577 0-37.143-16.566-37.143-37.143l20-67.714c8-22.077 16.566-37.143 37.143-37.143z' fill='url(%23m)'/%3E%3Cpath d='m12.375 314.02 8.4062 56.969c5.6076 3.3926 12.189 5.3438 19.25 5.3438h294.31c5.2941 0 10.326-1.1125 14.875-3.0938l7.7188-54.562c-6.2503 4.7925-14.07 7.6562-22.594 7.6562h-294.31c-11.016 0-20.873-4.7451-27.656-12.312z' fill='%23363636' opacity='.17857'/%3E%3Cpath d='m57.652 177.99c-20.577 0-29.156 15.079-37.156 37.156l-20 67.719c0 20.577 16.579 37.125 37.156 37.125h294.28c20.577 0 37.125-16.548 37.125-37.125l-20-67.719c-6-22.577-16.548-37.156-37.125-37.156h-254.28zm6.375 2.5h243.53c19.708 0 29.816 13.757 35.562 35.062l19.156 63.906c0 19.418-15.855 35.031-35.562 35.031h-281.84c-19.708 0-35.594-15.613-35.594-35.031l19.156-63.906c7.662-20.833 15.886-35.062 35.594-35.062z' fill='%23a6a6a6'/%3E%3Cpath d='m313.17 139.57-234.19-101.05c-3.0598-1.2988-6.5686 0.11888-7.8674 3.1786s0.11887 6.5686 3.1786 7.8674l234.19 101.05c3.0598 1.2988 6.5686-0.11887 7.8674-3.1786s-0.1189-6.5686-3.1786-7.8674z' fill='url(%23j)'/%3E%3Cpath d='m75.652 37.522c-2.3386-6e-3 -4.5572 1.3927-5.5312 3.6875-0.0892 0.21005-0.15485 0.41158-0.21875 0.625 1.664-1.3259 3.9902-1.7054 6.0938-0.8125l234.19 101.03c2.8378 1.2046 4.2506 4.3335 3.4062 7.2188 0.74124-0.59937 1.3501-1.4017 1.75-2.3438 1.2988-3.0598-0.0965-6.5762-3.1562-7.875l-234.19-101.03c-0.76494-0.32471-1.5642-0.49808-2.3438-0.5z' fill='%23363636' opacity='.38929'/%3E%3Cg transform='matrix(1 0 0 -1 -6.8583e-8 606.2)'%3E%3Cpath d='m313.17 557.15-234.19-101.05c-3.0598-1.2988-6.5686 0.11887-7.8674 3.1786s0.11887 6.5686 3.1786 7.8674l234.19 101.05c3.0598 1.2988 6.5686-0.11884 7.8674-3.1786s-0.1189-6.5686-3.1786-7.8674z' fill='url(%23i)'/%3E%3Cpath d='m72.526 464.7c-1.5827-1.7216-2.048-4.3027-1.012-6.5702 0.0948-0.20758 0.1992-0.392 0.31355-0.58322 0.1447 2.1227 1.4345 4.0954 3.5131 5.045l232.61 104.62c2.8041 1.281 6.0664 0.21179 7.6256-2.3585 0.05801 0.95154-0.12311 1.9423-0.54837 2.8732-1.3813 3.0234-4.9178 4.3671-7.9412 2.9858l-232.61-104.62c-0.75586-0.34531-1.4232-0.81808-1.9508-1.392z' fill='%23363636' opacity='.38929'/%3E%3C/g%3E%3Cpath d='m34.882 312.83c-9.2018-2.9784-16.709-8.7598-20.74-15.972-2.3966-4.2879-4.7158-11.761-4.7158-15.196 0-3.4583 18.785-65.742 22.308-73.962 1.489-3.4748 3.7672-8.132 5.0628-10.349 2.7296-4.6716 9.0225-11.761 9.7795-11.017 0.47365 0.46518 13.004 121.44 13.039 125.89l0.0154 1.9445-10.43-0.03796c-7.992-0.02911-11.339-0.33227-14.319-1.2969z' fill='url(%23g)' opacity='.25'/%3E%3Cpath d='m335.4 312.13c9.2018-2.9784 16.709-8.7598 20.74-15.972 2.3966-4.2879 4.7158-11.761 4.7158-15.196 0-3.4583-18.785-65.742-22.308-73.962-1.489-3.4748-3.7672-8.132-5.0628-10.349-2.7296-4.6716-9.0225-11.761-9.7795-11.017-0.47363 0.46518-13.004 121.44-13.039 125.89l-0.01538 1.9446 10.43-0.03803c7.992-0.02911 11.339-0.33227 14.319-1.2969z' fill='url(%23f)' opacity='.25'/%3E%3Cpath d='m1.089 282.9 10.375 70.406c6.7593 7.2021 16.385 11.688 27.094 11.688h294.31c9.9557 0 18.974-3.8856 25.625-10.219l9.0312-63.531c-5.3515 13.922-18.805 23.75-34.656 23.75h-294.31c-18.866 0-34.335-13.918-36.781-32.094h-0.6875z' fill='%238a8a8a'/%3E%3Cpath d='m5.4681 293.44s8.1317 15.556 22.981 19.445l3.182 49.498c-14.142 1.0607-19.445-8.8388-19.445-8.8388l-6.7175-60.104z' fill='%239e9e9e' filter='url(%23e)'/%3E%3Cpath d='m366.63 293.44s-8.1317 15.556-22.981 19.445l-3.182 49.498c14.142 1.0607 19.445-8.8388 19.445-8.8388l6.7175-60.104z' fill='%239e9e9e' filter='url(%23e)'/%3E%3C/svg%3E\")";

        return svg.replace(/%23([a-f\d]{6})/gi, function (x) {
            switch (x) {
                case '%238a8a8a':
                    return '%23' + rgb;
                    break;
                case '%23363636':
                    return '%23' + vis.binds['trashschedule'].getShiftedColor(rgb, -.33);
                    break;
                case '%23595959':
                    return '%23' + vis.binds['trashschedule'].getShiftedColor(rgb, -.19);
                    break;
                case '%23666666':
                    return '%23' + vis.binds['trashschedule'].getShiftedColor(rgb, -.14);
                    break;
                case '%236e6e6e':
                    return '%23' + vis.binds['trashschedule'].getShiftedColor(rgb, -.11);
                    break;
                case '%23707070':
                    return '%23' + vis.binds['trashschedule'].getShiftedColor(rgb, -.10);
                    break;
                case '%239e9e9e':
                    return '%23' + vis.binds['trashschedule'].getShiftedColor(rgb, .08);
                    break;
                case '%23a3a3a3':
                    return '%23' + vis.binds['trashschedule'].getShiftedColor(rgb, .1);
                    break;
                case '%23a6a6a6':
                    return '%23' + vis.binds['trashschedule'].getShiftedColor(rgb, .11);
                    break;
            }
            return x;
        });
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
                newItem.find('.dumpster').css('background-image', vis.binds['trashschedule'].getBackgroundImage(trashType._color));
            }

            target.append(newItem);
        });

    }
};

vis.binds['trashschedule'].showVersion();