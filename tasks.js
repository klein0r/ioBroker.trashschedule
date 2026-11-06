'use strict';

// Builds the front ends next to the adapter:
// - the vis-2 widget (src-widgets) into widgets/trashschedule next to the vis-1 widget files
// - the web component <iob-trashschedule-pickups> (src-webcomponents) into admin/webcomponents - the module and its
//   manifest, which common.webComponents names; vis-2, devices and Aura show it
// `node tasks` builds both, `node tasks --widgets` or `node tasks --wc` one of them
const { cpSync, existsSync, readdirSync, rmSync } = require('node:fs');
const { execFileSync } = require('node:child_process');

// npm is npm.cmd on Windows, which only runs through a shell; all arguments are fixed literals
const npm = (cwd, args) => execFileSync('npm', args, { cwd, shell: true, stdio: 'inherit' });

function build(src) {
    if (!existsSync(`${src}/node_modules`)) {
        npm(src, ['ci']);
    }
    rmSync(`${src}/build`, { recursive: true, force: true });
    npm(src, ['run', 'build']);
}

function buildWidgets() {
    const src = `${__dirname}/src-widgets`;
    const target = `${__dirname}/widgets/trashschedule`;
    build(src);

    // only replace the vis-2 output, css/ and js/ belong to the vis-1 widget
    rmSync(`${target}/customWidgets.js`, { force: true });
    rmSync(`${target}/assets`, { recursive: true, force: true });
    cpSync(`${src}/build/customWidgets.js`, `${target}/customWidgets.js`);
    cpSync(`${src}/build/assets`, `${target}/assets`, { recursive: true });
}

function buildWebComponents() {
    const src = `${__dirname}/src-webcomponents`;
    const target = `${__dirname}/admin/webcomponents`;
    // vite checks the manifest as a host does and fails the build if it is wrong
    build(src);

    rmSync(target, { recursive: true, force: true });
    for (const file of readdirSync(`${src}/build`)) {
        if (file.endsWith('.js') || file.endsWith('.json')) {
            cpSync(`${src}/build/${file}`, `${target}/${file}`);
        }
    }
}

const onlyWidgets = process.argv.includes('--widgets');
const onlyWc = process.argv.includes('--wc');

if (!onlyWc) {
    buildWidgets();
}
if (!onlyWidgets) {
    buildWebComponents();
}
