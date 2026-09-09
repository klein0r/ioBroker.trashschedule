# ioBroker.trashschedule VIS2 Patch

This patch adds the missing VIS2 registration layer and wrapper.

## Purpose

The original repository contains a Vue widget component:
    widgets/TrashSchedule.vue

but VIS2 requires:
- widget registration
- metadata
- a VIS2-compatible wrapper
- exported widget definitions

Without this, VIS2 either:
- does not show the widget
- or loads it as a legacy VIS1-style component.

## Added files

- widgets/index.ts
- widgets/visWidgets.json
- widgets/TrashSchedule.vis2.wrapper.vue
- widgets/register-vis2.ts

## Integration

Depending on repository structure, you may still need to:

1. Import register-vis2.ts in the widget entrypoint
2. Ensure Vite/Webpack includes the widgets folder
3. Rebuild:
       npm install
       npm run build

4. Upload:
       iobroker upload trashschedule

## Expected Result

- Widget appears correctly in VIS2
- VIS2 loads the Vue component through a proper wrapper
- Better compatibility with VIS2 editor/runtime
