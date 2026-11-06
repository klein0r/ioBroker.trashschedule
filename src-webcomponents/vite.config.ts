import { checkManifest } from '@iobroker/web-components';
import type { Plugin } from 'vite';

// with the extension: Vite may load its config natively, without a bundler that would add it
import { buildManifest, MANIFEST_FILE, MODULE_FILE } from './src/manifest.ts';

/**
 * The web component `<iob-trashschedule-pickups>`: one ES module, `admin/webcomponents/trashschedule-pickups.js`, and
 * its manifest `trashschedule-pickups.json` next to it (`common.webComponents`). Every host - vis-2, devices, Aura,
 * admin - reads them from `/adapter/trashschedule/webcomponents/`. No module federation: the host shares nothing but
 * the socket.
 *
 * The element is plain DOM: no React, nothing to import from the host. The can, its coloring and the date come from
 * the vis-2 widget (`../src-widgets/src/trashTypes.ts`) and are compiled in.
 */

/** Writes `trashschedule-pickups.json` next to the module, checked like a host checks it */
function manifestFile(): Plugin {
    return {
        name: 'trashschedule-web-component-manifest',
        generateBundle() {
            const manifest = buildManifest();
            const problem = checkManifest(manifest);
            if (problem) {
                this.error(`${MANIFEST_FILE}: ${problem}`);
            }
            if (manifest.module !== MODULE_FILE) {
                this.error(`${MANIFEST_FILE}: "module" must be "${MODULE_FILE}"`);
            }
            this.emitFile({
                type: 'asset',
                fileName: MANIFEST_FILE,
                source: `${JSON.stringify(manifest, null, 4)}\n`,
            });
        },
    };
}

export default {
    plugins: [manifestFile()],
    build: {
        target: 'es2022',
        outDir: './build',
        emptyOutDir: true,
        lib: {
            entry: './src/index.ts',
            formats: ['es'],
            fileName: (): string => MODULE_FILE,
        },
        rollupOptions: {
            output: {
                // one file: a host imports exactly one URL
                codeSplitting: false,
                // library mode keeps whitespace for the bundler of a consumer; this module is loaded as it is
                minify: true,
            },
        },
    },
};
