const BASE_EXTENSION_ALIAS = {
    '.js': [
        '.ts',
        '.tsx',
        '.js',
    ],
    '.mjs': [
        '.mts',
        '.mjs',
    ],
    '.cjs': [
        '.cts',
        '.cjs',
    ],
};
const BASE_EXTENSIONS = [
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
    '.mjs',
    '.cjs',
    '.json',
];
export const resolve = (config = {}) => ({
    ...config,
    extensionAlias: {
        ...BASE_EXTENSION_ALIAS,
        ...config.extensionAlias,
    },
    extensions: [
        ...BASE_EXTENSIONS,
        ...(config.extensions ?? []),
    ],
});
