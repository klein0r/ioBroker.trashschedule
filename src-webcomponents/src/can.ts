/**
 * The trash can of the vis widget (`widgets/trashschedule/css/style.css`), colored like the vis widget does it
 * (`widgets/trashschedule/js/trashschedule.js`, `getBackgroundImage`): every gray of the drawing becomes a lighter or
 * darker shade of the color of the trash type.
 */

/** The SVG of the can as a data URL; its grays are `%23<rrggbb>` */
const CAN_SVG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 372.57144 611.88544'%3E%3Cdefs%3E%3Cfilter id='d'%3E%3CfeGaussianBlur stdDeviation='1.88219'/%3E%3C/filter%3E%3Cfilter id='e' x='-.13781' y='-.04479' width='1.2756' height='1.0896'%3E%3CfeGaussianBlur stdDeviation='.79176'/%3E%3C/filter%3E%3ClinearGradient id='a'%3E%3Cstop stop-color='%23363636' offset='0'/%3E%3Cstop stop-color='%23363636' stop-opacity='0' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b'%3E%3Cstop stop-color='%23666666' offset='0'/%3E%3Cstop stop-color='%23595959' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='c'%3E%3Cstop stop-color='%23707070' offset='0'/%3E%3Cstop stop-color='%23595959' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='l' x1='174.29' x2='183.57' y1='335' y2='577.86' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%236e6e6e' offset='0'/%3E%3Cstop stop-color='%238a8a8a' offset='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='m' x2='0' y1='230.07' y2='401.07' gradientUnits='userSpaceOnUse' xlink:href='%23c'/%3E%3ClinearGradient id='k' x2='0' y1='108.98' y2='-102.96' gradientUnits='userSpaceOnUse' xlink:href='%23c'/%3E%3ClinearGradient id='j' x1='171.99' x2='193.73' y1='96.159' y2='56.561' gradientUnits='userSpaceOnUse' xlink:href='%23b'/%3E%3ClinearGradient id='i' x1='171.99' x2='193.73' y1='513.74' y2='474.14' gradientUnits='userSpaceOnUse' xlink:href='%23b'/%3E%3ClinearGradient id='h' x2='0' y1='165.39' y2='25.449' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3ClinearGradient id='g' x2='0' y1='283.54' y2='205.98' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3ClinearGradient id='f' x2='0' y1='282.84' y2='205.27' gradientUnits='userSpaceOnUse' xlink:href='%23a'/%3E%3C/defs%3E%3Cpath d='m61.143 176h254.29c20.577 0 31.143-18.053 37.143-46.036l20-83.928c0-25.504-16.566-46.036-37.143-46.036h-294.29c-20.577 0-37.143 20.532-37.143 46.036l20 83.928c8 27.363 16.566 46.036 37.143 46.036z' fill='url(%23k)'/%3E%3Cpath d='m76.467 165.39h223.64c18.097 0 27.389-15.877 32.666-40.488l17.589-73.812c0-22.43-14.569-40.488-32.666-40.488h-258.82c-18.097 0-32.666 18.057-32.666 40.488l17.589 73.812c7.0358 24.065 14.569 40.488 32.666 40.488z' fill='url(%23h)' opacity='.25'/%3E%3Cpath d='m358.9 289.24-41.378 291.4c0 14.882-11.98 26.862-26.862 26.862h-212.83c-14.881 0-26.862-11.98-26.862-26.862l-42.739-290.04 350.67-1.362z' fill='url(%23l)'/%3E%3Cpath d='m20.977 290.54-12.75 0.03101 42.75 290.06c0 11.835 7.572 21.844 18.157 25.437-2.415-4.3701-3.813-9.412-3.813-14.781l-44.344-300.75z' fill='%23a3a3a3'/%3E%3Cpath d='m29.019 291.84-12.75 0.03119 42.75 290.06c0 7.9506 3.0632 17.905 8.5147 22.816 2.6639 2.3997 6.1672 1.442 9.6416 2.6215-2.4143-4.3704-3.8125-9.4116-3.8125-14.781l-44.344-300.75v6.1e-5z' fill='%23a3a3a3' filter='url(%23d)'/%3E%3Cpath d='m340.42 293.96 12.75 0.03119-42.75 290.06c0 8.6726-4.0655 16.364-10.403 21.27-2.3113 1.7891-4.2178 1.0863-7.0465 2.0466 2.4143-4.3704 3.1054-7.2903 3.1054-12.66l44.344-300.75v6.1e-5z' fill='%23a3a3a3' filter='url(%23d)'/%3E%3Cpath d='m348.11 290.54 12.75 0.03101-42.75 290.06c0 11.835-7.572 21.844-18.156 25.437 2.414-4.3701 3.812-9.412 3.812-14.781l44.344-300.75z' fill='%23a3a3a3'/%3E%3Cpath d='m1.089 282.9 10.375 70.406c6.7593 7.2021 16.385 11.688 27.094 11.688h294.31c9.9557 0 18.974-3.8856 25.625-10.219l9.0312-63.531c-5.3515 13.922-18.805 23.75-34.656 23.75h-294.31c-18.866 0-34.335-13.918-36.781-32.094h-0.6875z' fill='%238a8a8a'/%3E%3Cpath d='m57.143 176h254.29c20.577 0 31.143 14.566 37.143 37.143l20 67.714c0 20.577-16.566 37.143-37.143 37.143h-294.29c-20.577 0-37.143-16.566-37.143-37.143l20-67.714c8-22.077 16.566-37.143 37.143-37.143z' fill='url(%23m)'/%3E%3Cpath d='m12.375 314.02 8.4062 56.969c5.6076 3.3926 12.189 5.3438 19.25 5.3438h294.31c5.2941 0 10.326-1.1125 14.875-3.0938l7.7188-54.562c-6.2503 4.7925-14.07 7.6562-22.594 7.6562h-294.31c-11.016 0-20.873-4.7451-27.656-12.312z' fill='%23363636' opacity='.17857'/%3E%3Cpath d='m57.652 177.99c-20.577 0-29.156 15.079-37.156 37.156l-20 67.719c0 20.577 16.579 37.125 37.156 37.125h294.28c20.577 0 37.125-16.548 37.125-37.125l-20-67.719c-6-22.577-16.548-37.156-37.125-37.156h-254.28zm6.375 2.5h243.53c19.708 0 29.816 13.757 35.562 35.062l19.156 63.906c0 19.418-15.855 35.031-35.562 35.031h-281.84c-19.708 0-35.594-15.613-35.594-35.031l19.156-63.906c7.662-20.833 15.886-35.062 35.594-35.062z' fill='%23a6a6a6'/%3E%3Cpath d='m313.17 139.57-234.19-101.05c-3.0598-1.2988-6.5686 0.11888-7.8674 3.1786s0.11887 6.5686 3.1786 7.8674l234.19 101.05c3.0598 1.2988 6.5686-0.11887 7.8674-3.1786s-0.1189-6.5686-3.1786-7.8674z' fill='url(%23j)'/%3E%3Cpath d='m75.652 37.522c-2.3386-6e-3 -4.5572 1.3927-5.5312 3.6875-0.0892 0.21005-0.15485 0.41158-0.21875 0.625 1.664-1.3259 3.9902-1.7054 6.0938-0.8125l234.19 101.03c2.8378 1.2046 4.2506 4.3335 3.4062 7.2188 0.74124-0.59937 1.3501-1.4017 1.75-2.3438 1.2988-3.0598-0.0965-6.5762-3.1562-7.875l-234.19-101.03c-0.76494-0.32471-1.5642-0.49808-2.3438-0.5z' fill='%23363636' opacity='.38929'/%3E%3Cg transform='matrix(1 0 0 -1 -6.8583e-8 606.2)'%3E%3Cpath d='m313.17 557.15-234.19-101.05c-3.0598-1.2988-6.5686 0.11887-7.8674 3.1786s0.11887 6.5686 3.1786 7.8674l234.19 101.05c3.0598 1.2988 6.5686-0.11884 7.8674-3.1786s-0.1189-6.5686-3.1786-7.8674z' fill='url(%23i)'/%3E%3Cpath d='m72.526 464.7c-1.5827-1.7216-2.048-4.3027-1.012-6.5702 0.0948-0.20758 0.1992-0.392 0.31355-0.58322 0.1447 2.1227 1.4345 4.0954 3.5131 5.045l232.61 104.62c2.8041 1.281 6.0664 0.21179 7.6256-2.3585 0.05801 0.95154-0.12311 1.9423-0.54837 2.8732-1.3813 3.0234-4.9178 4.3671-7.9412 2.9858l-232.61-104.62c-0.75586-0.34531-1.4232-0.81808-1.9508-1.392z' fill='%23363636' opacity='.38929'/%3E%3C/g%3E%3Cpath d='m34.882 312.83c-9.2018-2.9784-16.709-8.7598-20.74-15.972-2.3966-4.2879-4.7158-11.761-4.7158-15.196 0-3.4583 18.785-65.742 22.308-73.962 1.489-3.4748 3.7672-8.132 5.0628-10.349 2.7296-4.6716 9.0225-11.761 9.7795-11.017 0.47365 0.46518 13.004 121.44 13.039 125.89l0.0154 1.9445-10.43-0.03796c-7.992-0.02911-11.339-0.33227-14.319-1.2969z' fill='url(%23g)' opacity='.25'/%3E%3Cpath d='m335.4 312.13c9.2018-2.9784 16.709-8.7598 20.74-15.972 2.3966-4.2879 4.7158-11.761 4.7158-15.196 0-3.4583-18.785-65.742-22.308-73.962-1.489-3.4748-3.7672-8.132-5.0628-10.349-2.7296-4.6716-9.0225-11.761-9.7795-11.017-0.47363 0.46518-13.004 121.44-13.039 125.89l-0.01538 1.9446 10.43-0.03803c7.992-0.02911 11.339-0.33227 14.319-1.2969z' fill='url(%23f)' opacity='.25'/%3E%3Cpath d='m1.089 282.9 10.375 70.406c6.7593 7.2021 16.385 11.688 27.094 11.688h294.31c9.9557 0 18.974-3.8856 25.625-10.219l9.0312-63.531c-5.3515 13.922-18.805 23.75-34.656 23.75h-294.31c-18.866 0-34.335-13.918-36.781-32.094h-0.6875z' fill='%238a8a8a'/%3E%3Cpath d='m5.4681 293.44s8.1317 15.556 22.981 19.445l3.182 49.498c-14.142 1.0607-19.445-8.8388-19.445-8.8388l-6.7175-60.104z' fill='%239e9e9e' filter='url(%23e)'/%3E%3Cpath d='m366.63 293.44s-8.1317 15.556-22.981 19.445l-3.182 49.498c14.142 1.0607 19.445-8.8388 19.445-8.8388l6.7175-60.104z' fill='%239e9e9e' filter='url(%23e)'/%3E%3C/svg%3E";

/** The base gray of the drawing; the color of a can without one */
const BASE_COLOR = '8a8a8a';

/** How much lighter (+) or darker (-) each gray of the drawing is than the base gray, in HSL lightness */
const SHADES = new Map<string, number>([
    ['363636', -0.33],
    ['595959', -0.19],
    ['666666', -0.14],
    ['6e6e6e', -0.11],
    ['707070', -0.1],
    ['9e9e9e', 0.08],
    ['a3a3a3', 0.1],
    ['a6a6a6', 0.11],
]);

type Triple = [number, number, number];

function rgbToHsl([r, g, b]: Triple): Triple {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) {
        return [0, 0, l];
    }
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h: number;
    if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
        h = (b - r) / d + 2;
    } else {
        h = (r - g) / d + 4;
    }
    return [h / 6, s, l];
}

function hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}

function hslToRgb([h, s, l]: Triple): Triple {
    let rgb: Triple;
    if (s === 0) {
        rgb = [l, l, l];
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        rgb = [hueToRgb(p, q, h + 1 / 3), hueToRgb(p, q, h), hueToRgb(p, q, h - 1 / 3)];
    }
    return rgb.map(v => Math.max(0, Math.min(Math.round(v * 255), 255))) as Triple;
}

function toRgb(hex: string): Triple {
    return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)) as Triple;
}

function toHex(rgb: Triple): string {
    return rgb.map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * A color, lighter or darker
 *
 * @param hex `rrggbb`
 * @param shift added to the HSL lightness
 */
function shiftLightness(hex: string, shift: number): string {
    const [h, s, l] = rgbToHsl(toRgb(hex));
    return toHex(hslToRgb([h, s, l + shift]));
}

/**
 * The color of a trash type as `rrggbb`
 *
 * @param color `#rrggbb`, `#rgb` or `#rrggbbaa` of the configuration
 * @returns e.g. `545454`, or null if it is no such color
 */
export function toHexColor(color: string | undefined): string | null {
    const match = (color || '').trim().match(/^#?([a-f\d]{3}|[a-f\d]{6}|[a-f\d]{8})$/i);
    if (!match) {
        return null;
    }
    const hex = match[1].toLowerCase();
    return hex.length === 3 ? hex.replace(/./g, c => c + c) : hex.slice(0, 6);
}

const images = new Map<string, string>();

/**
 * The can in the color of a trash type, for `background-image`
 *
 * @param color the color of the trash type; gray if it has none
 * @returns `url("data:image/svg+xml,...")`
 */
export function getCanImage(color: string | undefined): string {
    const hex = toHexColor(color) || BASE_COLOR;
    let image = images.get(hex);
    if (!image) {
        // too dark or too light colors would lose the shades: the vis widget corrects them the same way
        const lightness = rgbToHsl(toRgb(hex))[2];
        let base = hex;
        if (lightness < 0.33) {
            base = shiftLightness(hex, 0.33 - lightness);
        } else if (lightness > 0.89) {
            base = shiftLightness(hex, 0.89 - lightness);
        }
        const svg = CAN_SVG.replace(/%23([a-f\d]{6})/gi, (all: string, gray: string) => {
            const name = gray.toLowerCase();
            if (name === BASE_COLOR) {
                return `%23${base}`;
            }
            const shade = SHADES.get(name);
            return shade === undefined ? all : `%23${shiftLightness(base, shade)}`;
        });
        // spaces, quotes and brackets encoded as well: every CSS parser takes the URL then
        image = `url("${svg.replace(/[ '()]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)}")`;
        images.set(hex, image);
    }
    return image;
}
