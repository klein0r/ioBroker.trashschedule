import config from '@iobroker/eslint-config';

export default [
    ...config,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.js', '*.mjs'],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        ignores: ['build/', 'node_modules/', 'vite.config.*'],
    },
    {
        rules: {
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            // the base class asks these for the settings, they need not read the element
            'class-methods-use-this': ['warn', { exceptMethods: ['getStateIds', 'getObjectIds'] }],
        },
    },
];
