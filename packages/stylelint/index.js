import postcssScss from 'postcss-scss';
import recommended from 'stylelint-config-recommended';
import recommendedScss from 'stylelint-config-recommended-scss';
import recessOrder from 'stylelint-config-recess-order';
import standard from 'stylelint-config-standard';
import standardScss from 'stylelint-config-standard-scss';
import stylelintOrder from 'stylelint-order';
import stylelintScss from 'stylelint-scss';
const plugins = [
    stylelintScss,
    stylelintOrder,
];
const config = {
    customSyntax: postcssScss,
    ignoreFiles: [
        'build/**',
        'dist/**',
        'node_modules/**',
    ],
    plugins,
    rules: {
        ...recommended.rules,
        ...standard.rules,
        ...recommendedScss.rules,
        ...standardScss.rules,
        ...recessOrder.rules,
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
