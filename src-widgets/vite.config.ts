import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/types-vis-2/modulefederation.vis.config';
import { readFileSync } from 'node:fs';

const pack = JSON.parse(readFileSync('./package.json').toString());

export default {
    plugins: [
        federation({
            manifest: true,
            name: 'vis2TrashscheduleWidgets',
            filename: 'customWidgets.js',
            exposes: {
                './TrashSchedule': './src/TrashSchedule',
                './translations': './src/translations',
            },
            remotes: {},
            shared: moduleFederationShared(pack),
            dts: false,
        }),
        react(),
    ],
    base: './',
    build: {
        target: 'chrome89',
        outDir: './build',
        rollupOptions: {
            output: {
                // module federation chunk names get long enough to break Windows' MAX_PATH in widgets/
                chunkFileNames: (chunk: { name: string }): string => `assets/${chunk.name.slice(0, 60)}-[hash].js`,
            },
        },
    },
};
