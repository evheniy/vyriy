const config = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    printWidth: 120,
    endOfLine: 'lf',
    arrowParens: 'always',
    bracketSpacing: true,
    jsxSingleQuote: false,
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            options: {
                parser: 'typescript',
            },
        },
    ],
    plugins: [
        'prettier-plugin-multiline-arrays',
    ],
    multilineArraysWrapThreshold: 3,
};
export default config;
