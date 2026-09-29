'use strict';

// Builds the vis-2 widget (src-widgets) into widgets/trashschedule next to the vis-1 widget files
const { cpSync, existsSync, rmSync } = require('node:fs');
const { execFileSync } = require('node:child_process');

const src = `${__dirname}/src-widgets`;
const target = `${__dirname}/widgets/trashschedule`;

// npm is npm.cmd on Windows, which only runs through a shell; all arguments are fixed literals
const npm = args => execFileSync('npm', args, { cwd: src, shell: true, stdio: 'inherit' });

if (!existsSync(`${src}/node_modules`)) {
    npm(['ci']);
}
rmSync(`${src}/build`, { recursive: true, force: true });
npm(['run', 'build']);

// only replace the vis-2 output, css/ and js/ belong to the vis-1 widget
rmSync(`${target}/customWidgets.js`, { force: true });
rmSync(`${target}/assets`, { recursive: true, force: true });
cpSync(`${src}/build/customWidgets.js`, `${target}/customWidgets.js`);
cpSync(`${src}/build/assets`, `${target}/assets`, { recursive: true });
