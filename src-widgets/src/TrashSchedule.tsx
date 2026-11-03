import React from 'react';

import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';

import '../../widgets/trashschedule/css/style.css';
import { formatNextDate, getBackgroundImage, toBool, toInt, visibleTrashTypes } from './trashTypes';

// Same attribute names as the vis-1 widget, so projects that used it in vis-2 keep their settings
interface TrashScheduleRxData {
    oid: string;
    size: number | string;
    limit: number | string;
    glow: boolean | string;
    glowLimit: number | string;
    showName: boolean | string;
    showDate: boolean | string;
    dateLocale: string;
    dateWeekday: string;
}

const BaseVisWidget: typeof VisRxWidget<TrashScheduleRxData, VisRxWidgetState> = window.visRxWidget;

const PREVIEW =
    '<div style="position: relative; text-align: initial; padding: 4px"><div class="trashschedule-widget" style="width: 105px; height: 275px;"><div class="trashtypes"><div class="trashtype" style="margin: 0"><span class="name">Restabfall</span><div class="dumpster"><span class="daysleft">3</span></div><span class="nextdate">Di., 10.3.</span></div></div></div></div>';

export default class TrashSchedule extends BaseVisWidget {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            // id of the vis-1 widget: vis-2 loads this widget instead of the vis-1 one for existing projects
            id: 'tplTrashscheduleHelper',
            visSet: 'trashschedule',
            visSetLabel: 'Trash schedule',
            visSetColor: '#8a8a8a',
            visName: 'TrashSchedule',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        { name: 'oid', type: 'id', label: 'oid', default: 'trashschedule.0.type.json' },
                        {
                            name: 'size',
                            type: 'slider',
                            min: 0,
                            max: 100,
                            step: 1,
                            default: 100,
                            label: 'trashschedule_size',
                        },
                        {
                            name: 'limit',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'trashschedule_limit',
                        },
                        { name: 'glow', type: 'checkbox', label: 'trashschedule_glow' },
                        {
                            name: 'glowLimit',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 1,
                            label: 'trashschedule_glowLimit',
                        },
                        { name: 'showName', type: 'checkbox', default: true, label: 'trashschedule_showName' },
                        { name: 'showDate', type: 'checkbox', default: true, label: 'trashschedule_showDate' },
                        {
                            name: 'dateLocale',
                            type: 'select',
                            options: ['de-DE', 'en-US'],
                            default: 'de-DE',
                            label: 'trashschedule_dateLocale',
                        },
                        {
                            name: 'dateWeekday',
                            type: 'select',
                            options: [
                                { value: 'hide', label: 'trashschedule_hide' },
                                { value: 'long', label: 'trashschedule_long' },
                                { value: 'short', label: 'trashschedule_short' },
                            ],
                            default: 'long',
                            label: 'trashschedule_dateWeekday',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 575,
                height: 275,
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: PREVIEW,
        };
    }

    getWidgetInfo(): RxWidgetInfo {
        return TrashSchedule.getWidgetInfo();
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const data = this.state.rxData;
        const oid = data.oid || 'trashschedule.0.type.json';
        const size = toInt(data.size, 100);
        const glowLimit = toInt(data.glowLimit, 1);
        const glow = toBool(data.glow, false);
        const showName = toBool(data.showName, true);
        const showDate = toBool(data.showDate, false);
        const dateLocale = data.dateLocale || 'de-DE';
        const dateWeekday = data.dateWeekday || 'long';

        const trashTypes = visibleTrashTypes(this.state.values[`${oid}.val`], toInt(data.limit, 0));

        return (
            <div
                className="trashschedule-widget"
                style={{ overflow: 'visible', width: '100%', height: '100%' }}
            >
                <div
                    className="trashtypes"
                    style={size < 100 && size > 0 ? { transform: `scale(${size / 100})` } : undefined}
                >
                    {trashTypes.map((trashType, i) => {
                        const classes = ['trashtype'];
                        if (trashType.daysLeft == 1) {
                            classes.push('trash-tomorrow');
                        }
                        if (trashType.daysLeft == 0) {
                            classes.push('trash-today');
                        }
                        if (glow && trashType.daysLeft <= glowLimit) {
                            classes.push('trash-glow');
                        }
                        const backgroundImage = getBackgroundImage(trashType._color);

                        return (
                            <div
                                key={i}
                                className={classes.join(' ')}
                            >
                                {showName ? <span className="name">{trashType.name}</span> : null}
                                <div
                                    className="dumpster"
                                    style={backgroundImage ? { backgroundImage } : undefined}
                                >
                                    <span className="daysleft">{trashType.daysLeft}</span>
                                </div>
                                {showDate ? (
                                    <span className="nextdate">
                                        {formatNextDate(trashType.nextDate, dateLocale, dateWeekday)}
                                    </span>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
