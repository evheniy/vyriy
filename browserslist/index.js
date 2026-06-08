const config = {
    development: [
        'last 1 chrome version',
    ],
    ssr: [
        'node 24',
    ],
    production: [
        '> 1%',
        'last 2 versions',
        'not dead',
    ],
    modern: [
        'last 1 chrome version',
        'last 1 safari version',
        'last 1 firefox version',
    ],
};
export default config;
