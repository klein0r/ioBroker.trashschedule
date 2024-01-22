'use strict';

const BaseSource = require('./base');

const MODE_KEY = 'd6c5855a62cf32a4dadbc2831f0f295f'; // de9b9ed78d7e2e1dceeffee780e2f919

function randomHex(len) {
    const hex = '0123456789abcdef';
    let output = '';
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
}

class SourceApiAbfallIo extends BaseSource {
    constructor(adapter) {
        super(adapter, 'api-abfallio');

        this.clientId = `${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}-${randomHex(12)}`;
    }

    async validate() {
        const cityId = this.adapter.config.apiMymuellCityId;

        if (cityId) {
            return true;
        } else {
            this.adapter.log.info(`[api-abfallio] no city configured`);
            return false;
        }
    }

    async getPickupDates() {
        const cityId = this.adapter.config.apiMymuellCityId;

        let streetId = undefined;
        let areaId = cityId;

        if (this.adapter.config.apiMymuellStreetId) {
            const streetData = this.adapter.config.apiMymuellStreetId.split('-');
            if (streetData.length == 2) {
                streetId = streetData[0];
                areaId = streetData[1];
            }
        }

        this.adapter.log.debug(`(0) [api-abfallio] update started by api - cityId: "${cityId}" - streetId: "${streetId ?? 'n/a'}" - areaId: "${areaId}"`);

        try {
            const apiTypes = await this.getApiTypes(provider, cityId);
            const apiPickups = await this.getApiPickups(provider, cityId, areaId);

            //this.adapter.log.debug(`(0) received api data: ${JSON.stringify(apiPickups)}`);

            const data = [];
            for (const pickup of apiPickups) {
                const name = apiTypes.find((t) => t.name === pickup.cal_garbage_type)?.title ?? pickup.cal_garbage_type;

                data.push({
                    date: pickup.cal_date,
                    name,
                    description: pickup.cal_comment,
                });
            }

            return data;
        } catch (err) {
            this.adapter.log.error(`(0) [api-abfallio] unable to parse api data: ${err.toString()}`);

            return [];
        }
    }

    async getApiCities() {
        return [
            {
                name: 'EGST Steinfurt',
                url: 'https://www.egst.de/',
                id: 'e21758b9c711463552fb9c70ac7d4273',
            },
            {
                name: 'ALBA Berlin',
                url: 'https://berlin.alba.info/',
                id: '9583a2fa1df97ed95363382c73b41b1b',
            },
            {
                name: 'ASO Abfall-Service Osterholz',
                url: 'https://www.aso-ohz.de/',
                id: '040b38fe83f026f161f30f282b2748c0',
            },
            {
                name: 'Landkreis Bayreuth',
                url: 'https://www.landkreis-bayreuth.de/',
                id: '951da001077dc651a3bf437bc829964e',
            },
            {
                name: 'Abfallwirtschaft Landkreis Böblingen',
                url: 'https://www.awb-bb.de/',
                id: '8215c62763967916979e0e8566b6172e',
            },
            {
                name: 'Landkreis Calw',
                url: 'https://www.kreis-calw.de/',
                id: '690a3ae4906c52b232c1322e2f88550c',
            },
            {
                name: 'Entsorgungsbetriebe Essen',
                url: 'https://www.ebe-essen.de/',
                id: '9b5390f095c779b9128a51db35092c9c',
            },
            {
                name: 'Abfallwirtschaft Landkreis Freudenstadt',
                url: 'https://www.awb-fds.de/',
                id: '595f903540a36fe8610ec39aa3a06f6a',
            },
            {
                name: 'AWB Landkreis Göppingen',
                url: 'https://www.awb-gp.de/',
                id: '365d791b58c7e39b20bb8f167bd33981',
            },
            {
                name: 'Göttinger Entsorgungsbetriebe',
                url: 'https://www.geb-goettingen.de/',
                id: '7dd0d724cbbd008f597d18fcb1f474cb',
            },
            {
                name: 'Landkreis Heilbronn',
                url: 'https://www.landkreis-heilbronn.de/',
                id: '1a1e7b200165683738adddc4bd0199a2',
            },
            {
                name: 'Abfallwirtschaft Landkreis Kitzingen',
                url: 'https://www.abfallwelt.de/',
                id: '594f805eb33677ad5bc645aeeeaf2623',
            },
            {
                name: 'Abfallwirtschaft Landkreis Landsberg am Lech',
                url: 'https://www.abfallberatung-landsberg.de/',
                id: '7df877d4f0e63decfb4d11686c54c5d6',
            },
            {
                name: 'Stadt Landshut',
                url: 'https://www.landshut.de/',
                id: 'bd0c2d0177a0849a905cded5cb734a6f',
            },
            {
                name: 'Ludwigshafen am Rhein',
                url: 'https://www.ludwigshafen.de/',
                id: '6efba91e69a5b454ac0ae3497978fe1d',
            },
            {
                name: 'MüllALARM / Schönmackers',
                url: 'https://www.schoenmackers.de/',
                id: 'e5543a3e190cb8d91c645660ad60965f',
            },
            {
                name: 'Abfallwirtschaft Ortenaukreis',
                url: 'https://www.abfallwirtschaft-ortenaukreis.de/',
                id: 'bb296b78763112266a391990f803f032',
            },
            {
                name: 'Abfallbewirtschaftung Ostalbkreis',
                url: 'https://www.goa-online.de/',
                id: '3ca331fb42d25e25f95014693ebcf855',
            },
            {
                name: 'Landkreis Ostallgäu',
                url: 'https://www.buerger-ostallgaeu.de/',
                id: '342cedd68ca114560ed4ca4b7c4e5ab6',
            },
            {
                name: 'Rhein-Neckar-Kreis',
                url: 'https://www.rhein-neckar-kreis.de/',
                id: '914fb9d000a9a05af4fd54cfba478860',
            },
            {
                name: 'Landkreis Rotenburg (Wümme)',
                url: 'https://lk-awr.de/',
                id: '645adb3c27370a61f7eabbb2039de4f1',
            },
            {
                name: 'Landkreis Sigmaringen',
                url: 'https://www.landkreis-sigmaringen.de/',
                id: '39886c5699d14e040063c0142cd0740b',
            },
            {
                name: 'Landratsamt Traunstein',
                url: 'https://www.traunstein.com/',
                id: '279cc5db4db838d1cfbf42f6f0176a90',
            },
            {
                name: 'Landratsamt Unterallgäu',
                url: 'https://www.landratsamt-unterallgaeu.de/',
                id: 'c22b850ea4eff207a273e46847e417c5',
            },
            {
                name: 'AWB Westerwaldkreis',
                url: 'https://wab.rlp.de/',
                id: '248deacbb49b06e868d29cb53c8ef034',
            },
            {
                name: 'Landkreis Limburg-Weilburg',
                url: 'https://www.awb-lm.de/',
                id: '0ff491ffdf614d6f34870659c0c8d917',
            },
            {
                name: 'Landkreis Weißenburg-Gunzenhausen',
                url: 'https://www.landkreis-wug.de',
                id: '31fb9c7d783a030bf9e4e1994c7d2a91',
            },
            {
                name: 'VIVO Landkreis Miesbach',
                url: 'https://www.vivowarngau.de/',
                id: '4e33d4f09348fdcc924341bf2f27ec86',
            },
            {
                name: 'Abfallzweckverband Rhein-Mosel-Eifel (Landkreis Mayen-Koblenz)',
                url: 'https://www.azv-rme.de/',
                id: '8303df78b822c30ff2c2f98e405f86e6',
            },
        ];
    }

    async getApiStreets(provider, cityId) {
        if (cityId) {
            const streetsData = await this.getApiCached(`https://api.abfall.io/?key=${cityId}&modus=${MODE_KEY}&waction=init`, `abfallio-streets-${cityId}.txt`);
            return streetsData;
        } else {
            throw new Error('[api-abfallio] Unable to get streets - empty cityId');
        }
    }

    async getApiTypes(provider, cityId) {
        if (cityId) {
            const typesData = await this.getApiCached(`https://mymuell.jumomind.com/mmapp/api.php?r=trash&city_id=${cityId}`, `abfallio-types-${cityId}.txt`);
            return typesData;
        } else {
            throw new Error('[api-abfallio] Unable to get types - empty cityId');
        }
    }

    async getApiPickups(cityId, areaId) {
        if (cityId) {
            const pickupData = await this.getApiCached(`https://mymuell.jumomind.com/webservice.php?idx=termins&city_id=${cityId}&area_id=${areaId}&ws=3`, `abfallio-pickups-${cityId}-${areaId}.txt`);

            return JSON.parse(pickupData)?.[0]?._data ?? [];
        } else {
            throw new Error('[api-abfallio] Unable to get types - empty cityId');
        }
    }
}

module.exports = SourceApiAbfallIo;
