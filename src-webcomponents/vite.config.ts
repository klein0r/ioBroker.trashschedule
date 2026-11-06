import { checkManifest, type WebComponentText } from '@iobroker/web-components';
import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

// with the extension: Vite may load its config natively, without a bundler that would add it
import { buildManifest, DESCRIPTION, DEVICES_WIDGET, MANIFEST_FILE, MODULE_FILE, NAME } from './src/manifest.ts';

/**
 * The web component `<iob-trashschedule-pickups>`: one ES module, `admin/webcomponents/trashschedule-pickups.js`, and
 * its manifest `trashschedule-pickups.json` next to it (`common.webComponents`). Every host - vis-2, devices, Aura,
 * admin - reads them from `/adapter/trashschedule/webcomponents/`. No module federation: the host shares nothing but
 * the socket.
 *
 * The element is plain DOM: no React, nothing to import from the host.
 */

/**
 * The texts of the devices widget over the ones of the component: what the devices widget has wins, the rest
 * completes it
 *
 * @param own the text of the component in every language
 * @param widget the text of the devices widget, if there is one
 */
function merge(own: Record<string, string>, widget: ioBroker.StringOrTranslated | undefined): WebComponentText {
    if (typeof widget === 'string') {
        return { ...own, en: widget };
    }
    return { ...own, ...(widget || {}) } as WebComponentText;
}

/** Writes `trashschedule-pickups.json` next to the module, checked like a host checks it */
function manifestFile(): Plugin {
    return {
        name: 'trashschedule-web-component-manifest',
        generateBundle() {
            const ioPackage = JSON.parse(
                readFileSync(new URL('../io-package.json', import.meta.url), 'utf8'),
            ) as ioBroker.AdapterObject;
            const widget = ioPackage.common.deviceWidgets?.components.find(c => c.name === DEVICES_WIDGET);
            const manifest = buildManifest({
                name: merge(NAME, widget?.label),
                description: merge(DESCRIPTION, widget?.description),
            });
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
