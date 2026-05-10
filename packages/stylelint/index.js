const config = {
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-recess-order',
    ],
    customSyntax: 'postcss-scss',
    ignoreFiles: [
        'build/**',
        'dist/**',
        'node_modules/**',
    ],
    rules: {
        'color-hex-length': null,
        'custom-property-empty-line-before': null,
        'media-feature-range-notation': null,
        'order/properties-order': null,
        'selector-class-pattern': null,
        'scss/dollar-variable-pattern': null,
        'value-keyword-case': null,
    },
};
export default config;
