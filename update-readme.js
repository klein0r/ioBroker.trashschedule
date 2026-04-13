'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Mustache = require('mustache');

const templateDir = path.join(__dirname, './templates/');
const targetDirs = [path.join(__dirname, './docs/de/'), path.join(__dirname, './docs/en/')];

const providerJumomind = require('./lib/provider/api-jumomind');
const providerAbfallio = require('./lib/provider/api-abfallio');
const providerAwido = require('./lib/provider/api-awido');

function generateProviders() {
    const MUSTACHE_TEMPLATE = path.join(templateDir, 'providers.mustache');

    const templateData = {
        jumomind: Object.keys(providerJumomind).map(k => ({
            title: providerJumomind[k].title,
            cities: providerJumomind[k].cities.map(c => `\t- ${c}`).join('\n'),
        })),
        abfallio: Object.keys(providerAbfallio).map(k => ({
            title: providerAbfallio[k].title,
            cities: providerAbfallio[k].cities.map(c => `\t- ${c}`).join('\n'),
        })),
        awido: Object.keys(providerAwido).map(k => ({ title: providerAwido[k].title })),
    };

    try {
        const template = fs.readFileSync(MUSTACHE_TEMPLATE);
        const output = Mustache.render(template.toString(), templateData);

        for (const targetDir of targetDirs) {
            fs.writeFileSync(path.join(targetDir, 'providers.md'), output);
        }

        console.log('generated providers.md');
    } catch (err) {
        console.error(`Unable to render mustache file "${MUSTACHE_TEMPLATE}": ${err}`);
    }
}

generateProviders();
