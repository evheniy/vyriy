import cssnano from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';
const DEFAULT_PLUGINS = [
    postcssPresetEnv({
        stage: 3,
        autoprefixer: {
            flexbox: 'no-2009',
        },
    }),
    cssnano({
        preset: [
            'default',
            {
                cssDeclarationSorter: false,
                zindex: false,
            },
        ],
    }),
];
export const postcss = (config = {}) => ({
    ...config,
    plugins: [
        ...DEFAULT_PLUGINS,
        ...(config.plugins ?? []),
    ],
});
