import postcssScss from 'postcss-scss';
declare const config: {
    customSyntax: typeof postcssScss;
    ignoreFiles: string[];
    plugins: unknown[];
    rules: {
        'color-hex-length': null;
        'custom-property-empty-line-before': null;
        'media-feature-range-notation': null;
        'order/properties-order': null;
        'selector-class-pattern': null;
        'scss/dollar-variable-pattern': null;
        'value-keyword-case': null;
    };
};
export default config;
