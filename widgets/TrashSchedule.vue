<!--
    ioBroker.vis-2 TrashSchedule Widget

    Version: '5.3.0'

    Copyright 2024 Matthias Kleine info@haus-automatisierung.com
-->
<template>
  <div :class="['trashschedule-widget-container', { 'vis-edit-mode': editMode }]" :style="containerStyle">
    <div class="trashtypes" :style="trashTypesStyle">
      <div
        v-for="(trashType, index) in filteredTrashTypes"
        :key="index"
        :class="getTrashTypeClasses(trashType)"
        class="trashtype"
      >
        <span v-if="showName" class="name">{{ trashType.name }}</span>
        <div :class="['dumpster', { 'trash-today': trashType.daysLeft === 0, 'trash-tomorrow': trashType.daysLeft === 1, 'trash-glow': glow && trashType.daysLeft <= glowLimit }]" :style="getDumpsterStyle(trashType)">
          <span class="daysleft">{{ trashType.daysLeft }}</span>
        </div>
        <span v-if="showDate" class="nextdate">{{ formatDate(trashType.nextDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TrashScheduleWidget',
  props: {
    id: {
      type: String,
      required: true,
    },
    oid: {
      type: String,
      default: 'trashschedule.0.type.json',
    },
    size: {
      type: [Number, String],
      default: 100,
    },
    limit: {
      type: [Number, String],
      default: 0,
    },
    glow: {
      type: Boolean,
      default: false,
    },
    glowLimit: {
      type: [Number, String],
      default: 1,
    },
    showName: {
      type: Boolean,
      default: true,
    },
    showDate: {
      type: Boolean,
      default: false,
    },
    dateLocale: {
      type: String,
      default: 'de-DE',
    },
    dateWeekday: {
      type: String,
      default: 'long',
    },
  },
  emits: [],
  setup(props) {
    return {
      editMode: false,
    };
  },
  data() {
    return {
      trashTypes: [],
      stateValue: null,
      subscription: null,
    };
  },
  computed: {
    sizePercent() {
      const s = parseInt(this.size, 10);
      return s && s > 0 && s < 100 ? s : 100;
    },
    limitNum() {
      return parseInt(this.limit, 10) || 0;
    },
    glowLimitNum() {
      return parseInt(this.glowLimit, 10) || 1;
    },
    filteredTrashTypes() {
      return this.trashTypes.filter((trashType) => {
        if (trashType._completed) {
          return false;
        }
        if (this.limitNum === 0) {
          return true;
        }
        return this.trashTypes.indexOf(trashType) < this.limitNum;
      });
    },
    containerStyle() {
      return {
        width: '100%',
        height: '100%',
        overflow: 'visible',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      };
    },
    trashTypesStyle() {
      return {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        transform: this.sizePercent !== 100 ? `scale(${this.sizePercent / 100})` : 'none',
        transformOrigin: 'top left',
      };
    },
  },
  watch: {
    stateValue() {
      this.parseTrashTypes();
    },
  },
  mounted() {
    this.loadState();
    this.subscribeToState();
  },
  beforeUnmount() {
    this.unsubscribeFromState();
  },
  methods: {
    loadState() {
      if (window.StateManager) {
        const state = window.StateManager.getState(this.oid);
        if (state) {
          this.stateValue = state.val;
          this.parseTrashTypes();
        }
      }
    },
    subscribeToState() {
      if (window.StateManager) {
        this.subscription = window.StateManager.subscribe(this.oid, (state) => {
          if (state) {
            this.stateValue = state.val;
          }
        });
      }
    },
    unsubscribeFromState() {
      if (this.subscription && window.StateManager) {
        window.StateManager.unsubscribe(this.subscription);
      }
    },
    parseTrashTypes() {
      if (this.stateValue && typeof this.stateValue === 'string') {
        try {
          this.trashTypes = JSON.parse(this.stateValue);
        } catch (e) {
          console.error('Failed to parse trash types:', e);
          this.trashTypes = [];
        }
      } else if (Array.isArray(this.stateValue)) {
        this.trashTypes = this.stateValue;
      } else {
        this.trashTypes = [];
      }
    },
    getTrashTypeClasses(trashType) {
      const classes = [];
      if (trashType.daysLeft === 0) {
        classes.push('trash-today');
      } else if (trashType.daysLeft === 1) {
        classes.push('trash-tomorrow');
      }
      if (this.glow && trashType.daysLeft <= this.glowLimitNum) {
        classes.push('trash-glow');
      }
      return classes;
    },
    getDumpsterStyle(trashType) {
      const style = {};
      if (trashType._color) {
        style.backgroundImage = this.getBackgroundImage(trashType._color);
      }
      return style;
    },
    formatDate(dateValue) {
      const date = new Date(dateValue);
      const options = { month: 'numeric', day: 'numeric' };
      if (this.dateWeekday !== 'hide') {
        options.weekday = this.dateWeekday;
      }
      return date.toLocaleDateString(this.dateLocale, options);
    },
    toPaddedHexString(num, len) {
      let str = num.toString(16);
      return '0'.repeat(len - str.length) + str;
    },
    rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h;
      let s;
      const l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
          default:
            h = 0;
        }
        h /= 6;
      }

      return [h, s, l];
    },
    hslToRgb(h, s, l) {
      let r;
      let g;
      let b;

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          let t2 = t;
          if (t2 < 0) t2 += 1;
          if (t2 > 1) t2 -= 1;
          if (t2 < 1 / 6) return p + (q - p) * 6 * t2;
          if (t2 < 1 / 2) return q;
          if (t2 < 2 / 3) return p + (q - p) * (2 / 3 - t2) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [
        Math.max(0, Math.min(Math.round(r * 255), 255)),
        Math.max(0, Math.min(Math.round(g * 255), 255)),
        Math.max(0, Math.min(Math.round(b * 255), 255)),
      ];
    },
    getRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) {
        return [138, 138, 138]; // fallback to gray
      }
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return [r, g, b];
    },
    getHsl(hex) {
      const rgb = this.getRgb(hex);
      return this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
    },
    getShiftedColor(hex, lightnessShift) {
      const hsl = this.getHsl(hex);
      const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2] + lightnessShift);
      return this.toPaddedHexString(rgb[0], 2) + this.toPaddedHexString(rgb[1], 2) + this.toPaddedHexString(rgb[2], 2);
    },
    getBackgroundImage(color) {
      const newColor = /^#?([a-f\d]{6})$/i.exec(color);
      let rgb = newColor ? newColor[1] : '8a8a8a';

      // Color correction (if source is too light or too dark)
      const hsl = this.getHsl(`#${rgb}`);
      if (hsl[2] < 0.33) {
        rgb = this.getShiftedColor(`#${rgb}`, 0.33 - hsl[2]);
      } else if (hsl[2] > 0.89) {
        rgb = this.getShiftedColor(`#${rgb}`, -(hsl[2] - 0.89));
      }

      let svg =
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' viewBox=\'0 0 372.57144 611.88544\'%3E%3Cdefs%3E%3Cfilter id=\'d\'%3E%3CfeGaussianBlur in=\'SourceGraphic\' stdDeviation=\'3\' /%3E%3C/filter%3E%3C/defs%3E%3Cg%3E%3Cpath d=\'M 0 115.64502 C 0 79.356125 28.717217 50 64.157766 50 L 308.41398 50 C 343.85453 50 372.57174 79.356125 372.57174 115.64502 L 372.57174 470.15327 C 372.57174 506.44117 343.85453 535.79828 308.41398 535.79828 L 64.157766 535.79828 C 28.717217 535.79828 0 506.44117 0 470.15327 Z\' fill=\'%238a8a8a\' /%3E%3Cpath d=\'M 31.693357 115.64502 C 31.693357 96.324455 47.315998 80.701813 66.636563 80.701813 L 305.93518 80.701813 C 325.25574 80.701813 340.87838 96.324455 340.87838 115.64502 L 340.87838 470.15327 C 340.87838 489.47384 325.25574 505.09648 305.93518 505.09648 L 66.636563 505.09648 C 47.315998 505.09648 31.693357 489.47384 31.693357 470.15327 Z\' fill=\'%23363636\' /%3E%3Cpath d=\'M 68.645098 115.64502 C 68.645098 105.70221 76.759445 97.587862 86.702254 97.587862 L 285.88949 97.587862 C 295.8323 97.587862 303.94665 105.70221 303.94665 115.64502 L 303.94665 470.15327 C 303.94665 480.09609 295.8323 488.21043 285.88949 488.21043 L 86.702254 488.21043 C 76.759445 488.21043 68.645098 480.09609 68.645098 470.15327 Z\' fill=\'%23595959\' /%3E%3Cg filter=\'url(%23d)\'%3E%3Crect x=\'90\' y=\'150\' width=\'192.57144\' height=\'280\' fill=\'%23707070\' /%3E%3C/g%3E%3Crect x=\'90\' y=\'150\' width=\'192.57144\' height=\'280\' fill=\'%239e9e9e\' /%3E%3Cpath d=\'M 90 150 C 90 140.05719 97.799561 132.25763 107.74237 132.25763 L 265.40051 132.25763 C 275.34332 132.25763 283.14288 140.05719 283.14288 150 L 283.14288 200 L 90 200 Z\' fill=\'%23a3a3a3\' /%3E%3Cpath d=\'M 90 200 L 283.14288 200 L 283.14288 380 C 283.14288 389.94281 275.34332 397.74237 265.40051 397.74237 L 107.74237 397.74237 C 97.799561 397.74237 90 389.94281 90 380 Z\' fill=\'%23a6a6a6\' /%3E%3Cpath d=\'M 90 380 L 283.14288 380 L 283.14288 430 C 283.14288 439.94281 275.34332 447.74237 265.40051 447.74237 L 107.74237 447.74237 C 97.799561 447.74237 90 439.94281 90 430 Z\' fill=\'%236e6e6e\' /%3E%3C/g%3E%3C/svg%3E")'
        .replace(/%23([a-f\d]{6})/gi, (x) => {
          switch (x) {
            case '%238a8a8a':
              return `%23${rgb}`;
            case '%23363636':
              return `%23${this.getShiftedColor(`#${rgb}`, -0.33)}`;
            case '%23595959':
              return `%23${this.getShiftedColor(`#${rgb}`, -0.19)}`;
            case '%23666666':
              return `%23${this.getShiftedColor(`#${rgb}`, -0.14)}`;
            case '%236e6e6e':
              return `%23${this.getShiftedColor(`#${rgb}`, -0.11)}`;
            case '%23707070':
              return `%23${this.getShiftedColor(`#${rgb}`, -0.1)}`;
            case '%239e9e9e':
              return `%23${this.getShiftedColor(`#${rgb}`, 0.08)}`;
            case '%23a3a3a3':
              return `%23${this.getShiftedColor(`#${rgb}`, 0.1)}`;
            case '%23a6a6a6':
              return `%23${this.getShiftedColor(`#${rgb}`, 0.11)}`;
            default:
              return x;
          }
        });

      return svg;
    },
  },
});
</script>

<style scoped>
.trashschedule-widget-container {
  position: relative;
  text-align: initial;
  padding: 4px;
}

.trashtype {
  position: relative;
  display: inline-block;
  width: 115px;
  margin-left: 20px;
  margin-top: 20px;
}

.trashtype > span {
  display: block;
}

.trashtype .name {
  font-weight: bold;
  text-align: center;
  width: 100%;
}

.trashtype .dumpster {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 372.57144 611.88544'%3E%3Cdefs%3E%3Cfilter id='d'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='3' /%3E%3C/filter%3E%3C/defs%3E%3Cg%3E%3Cpath d='M 0 115.64502 C 0 79.356125 28.717217 50 64.157766 50 L 308.41398 50 C 343.85453 50 372.57174 79.356125 372.57174 115.64502 L 372.57174 470.15327 C 372.57174 506.44117 343.85453 535.79828 308.41398 535.79828 L 64.157766 535.79828 C 28.717217 535.79828 0 506.44117 0 470.15327 Z' fill='%238a8a8a' /%3E%3Cpath d='M 31.693357 115.64502 C 31.693357 96.324455 47.315998 80.701813 66.636563 80.701813 L 305.93518 80.701813 C 325.25574 80.701813 340.87838 96.324455 340.87838 115.64502 L 340.87838 470.15327 C 340.87838 489.47384 325.25574 505.09648 305.93518 505.09648 L 66.636563 505.09648 C 47.315998 505.09648 31.693357 489.47384 31.693357 470.15327 Z' fill='%23363636' /%3E%3Cpath d='M 68.645098 115.64502 C 68.645098 105.70221 76.759445 97.587862 86.702254 97.587862 L 285.88949 97.587862 C 295.8323 97.587862 303.94665 105.70221 303.94665 115.64502 L 303.94665 470.15327 C 303.94665 480.09609 295.8323 488.21043 285.88949 488.21043 L 86.702254 488.21043 C 76.759445 488.21043 68.645098 480.09609 68.645098 470.15327 Z' fill='%23595959' /%3E%3Cg filter='url(%23d)'%3E%3Crect x='90' y='150' width='192.57144' height='280' fill='%23707070' /%3E%3C/g%3E%3Crect x='90' y='150' width='192.57144' height='280' fill='%239e9e9e' /%3E%3Cpath d='M 90 150 C 90 140.05719 97.799561 132.25763 107.74237 132.25763 L 265.40051 132.25763 C 275.34332 132.25763 283.14288 140.05719 283.14288 150 L 283.14288 200 L 90 200 Z' fill='%23a3a3a3' /%3E%3Cpath d='M 90 200 L 283.14288 200 L 283.14288 380 C 283.14288 389.94281 275.34332 397.74237 265.40051 397.74237 L 107.74237 397.74237 C 97.799561 397.74237 90 389.94281 90 380 Z' fill='%23a6a6a6' /%3E%3Cpath d='M 90 380 L 283.14288 380 L 283.14288 430 C 283.14288 439.94281 275.34332 447.74237 265.40051 447.74237 L 107.74237 447.74237 C 97.799561 447.74237 90 439.94281 90 430 Z' fill='%236e6e6e' /%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center center;
  height: 200px;
}

.trashtype .daysleft {
  position: absolute;
  top: 65%;
  left: 50%;
  margin-left: -25px;
  font-weight: bold;
  font-size: 1.5em;
  height: 50px;
  width: 50px;
  line-height: 50px;
  border-radius: 20px;
  text-align: center;
  background: #cccccc55;
}

.trashtype .nextdate {
  font-size: 0.8em;
  text-align: center;
  width: 100%;
}

@-webkit-keyframes animTrashGlow {
  0% {
    box-shadow: 0 0 #f30b0b;
  }
  100% {
    box-shadow: 0 0 10px 8px transparent;
    border-width: 2px;
  }
}

@keyframes animTrashGlow {
  0% {
    box-shadow: 0 0 #f30b0b;
  }
  100% {
    box-shadow: 0 0 10px 8px transparent;
    border-width: 2px;
  }
}

.trashtype.trash-glow .daysleft {
  -webkit-animation: animTrashGlow 2s ease infinite;
  animation: animTrashGlow 2s ease infinite;
}
</style>
