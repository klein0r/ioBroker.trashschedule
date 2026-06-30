# VIS2 Widget Integration Notes

This archive contains a minimal VIS2 widget registration scaffold
for the ioBroker.trashschedule repository.

Expected existing file:
    widgets/TrashSchedule.vue

Added files:
    widgets/index.ts
    widgets/visWidgets.json

Typical next steps:

1. Ensure the widget is exported by the adapter build.
2. Ensure the build copies the widget bundle into:
       iobroker-data/files/vis-2/widgets/trashschedule/
3. Run:
       npm install
       npm run build
       iobroker upload trashschedule

Depending on the adapter structure, additional integration into:
    - vite.config.ts
    - package.json
    - widgets.ts
    - visWidgets.js

may still be required.

This scaffold is intended to provide the missing VIS2 metadata and export registration.
