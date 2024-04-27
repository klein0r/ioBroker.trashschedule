'use strict';

module.exports = {
    /*
    egst: {
        title: 'EGST Steinfurt',
        url: 'https://www.egst.de/',
        provider: 'e21758b9c711463552fb9c70ac7d4273',
    },
    alba: {
        title: 'ALBA Berlin',
        url: 'https://berlin.alba.info/',
        provider: '9583a2fa1df97ed95363382c73b41b1b',
    },
    aso: {
        title: 'ASO Abfall-Service Osterholz',
        url: 'https://www.aso-ohz.de/',
        provider: '040b38fe83f026f161f30f282b2748c0',
    },
    bayreuth: {
        title: 'Landkreis Bayreuth',
        url: 'https://www.landkreis-bayreuth.de/',
        provider: '951da001077dc651a3bf437bc829964e',
    },
    */
    boeblingen: {
        title: 'Abfallwirtschaft Landkreis Böblingen',
        url: 'https://www.awb-bb.de',
        provider: '8215c62763967916979e0e8566b6172e',
        apiKey: 'caac1d0b40973ad8ed652ef666ab7336fd50eede75ff868d',
    },
    /*
    calw: {
        title: 'Landkreis Calw',
        url: 'https://www.awg-info.de/privatkunden/abfuhrtermine',
        provider: '690a3ae4906c52b232c1322e2f88550c',
        apiKey: '690a3ae4906c52b232c1322e2f88550c',
    },
    essen: {
        title: 'Entsorgungsbetriebe Essen',
        url: 'https://www.ebe-essen.de/',
        provider: '9b5390f095c779b9128a51db35092c9c',
    },
    freudenstadt: {
        title: 'Abfallwirtschaft Landkreis Freudenstadt',
        url: 'https://www.awb-fds.de/',
        provider: '595f903540a36fe8610ec39aa3a06f6a',
    },
    goeppingen: {
        title: 'AWB Landkreis Göppingen',
        url: 'https://www.awb-gp.de/',
        provider: '365d791b58c7e39b20bb8f167bd33981',
    },
    goettingen: {
        title: 'Göttinger Entsorgungsbetriebe',
        url: 'https://www.geb-goettingen.de/',
        provider: '7dd0d724cbbd008f597d18fcb1f474cb',
    },
    heilbronn: {
        title: 'Landkreis Heilbronn',
        url: 'https://www.landkreis-heilbronn.de/',
        provider: '1a1e7b200165683738adddc4bd0199a2',
    },
    kitzingen: {
        title: 'Abfallwirtschaft Landkreis Kitzingen',
        url: 'https://www.abfallwelt.de/',
        provider: '594f805eb33677ad5bc645aeeeaf2623',
    },
    landsberg: {
        title: 'Abfallwirtschaft Landkreis Landsberg am Lech',
        url: 'https://www.abfallberatung-landsberg.de/',
        provider: '7df877d4f0e63decfb4d11686c54c5d6',
    },
    landshut: {
        title: 'Stadt Landshut',
        url: 'https://www.landshut.de/',
        provider: 'bd0c2d0177a0849a905cded5cb734a6f',
        apiKey: 'bd0c2d0177a0849a905cded5cb734a6f',
    },
    ludwigshafen: {
        title: 'Ludwigshafen am Rhein',
        url: 'https://www.ludwigshafen.de/',
        provider: '6efba91e69a5b454ac0ae3497978fe1d',
    },
    muellalarm: {
        title: 'MüllALARM / Schönmackers',
        url: 'https://www.schoenmackers.de/',
        provider: 'e5543a3e190cb8d91c645660ad60965f',
    },
    ortenaukreis: {
        title: 'Abfallwirtschaft Ortenaukreis',
        url: 'https://www.abfallwirtschaft-ortenaukreis.de/',
        provider: 'bb296b78763112266a391990f803f032',
    },
    ostalbkreis: {
        title: 'Abfallbewirtschaftung Ostalbkreis',
        url: 'https://www.goa-online.de/',
        provider: '3ca331fb42d25e25f95014693ebcf855',
    },
    ostallgäu: {
        title: 'Landkreis Ostallgäu',
        url: 'https://www.buerger-ostallgaeu.de/',
        provider: '342cedd68ca114560ed4ca4b7c4e5ab6',
    },
    rheinneckar: {
        title: 'Rhein-Neckar-Kreis',
        url: 'https://www.rhein-neckar-kreis.de/',
        provider: '914fb9d000a9a05af4fd54cfba478860',
    },
    rotenburg: {
        title: 'Landkreis Rotenburg (Wümme)',
        url: 'https://lk-awr.de/',
        provider: '645adb3c27370a61f7eabbb2039de4f1',
    },
    sigmaringen: {
        title: 'Landkreis Sigmaringen',
        url: 'https://www.landkreis-sigmaringen.de/',
        provider: '39886c5699d14e040063c0142cd0740b',
    },
    traunstein: {
        title: 'Landratsamt Traunstein',
        url: 'https://www.traunstein.com/',
        provider: '279cc5db4db838d1cfbf42f6f0176a90',
    },
    unterallgaeu: {
        title: 'Landratsamt Unterallgäu',
        url: 'https://www.landratsamt-unterallgaeu.de/',
        provider: 'c22b850ea4eff207a273e46847e417c5',
    },
    westerwald: {
        title: 'AWB Westerwaldkreis',
        url: 'https://wab.rlp.de/',
        provider: '248deacbb49b06e868d29cb53c8ef034',
    },
    limburg: {
        title: 'Landkreis Limburg-Weilburg',
        url: 'https://www.awb-lm.de/',
        provider: '0ff491ffdf614d6f34870659c0c8d917',
    },
    weissenburg: {
        title: 'Landkreis Weißenburg-Gunzenhausen',
        url: 'https://www.landkreis-wug.de',
        provider: '31fb9c7d783a030bf9e4e1994c7d2a91',
    },
    vivq: {
        title: 'VIVO Landkreis Miesbach',
        url: 'https://www.vivowarngau.de/',
        provider: '4e33d4f09348fdcc924341bf2f27ec86',
    },
    mayen: {
        title: 'Abfallzweckverband Rhein-Mosel-Eifel (Landkreis Mayen-Koblenz)',
        url: 'https://www.azv-rme.de/',
        provider: '8303df78b822c30ff2c2f98e405f86e6',
    },
    */
};
