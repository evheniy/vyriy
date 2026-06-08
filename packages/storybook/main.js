import { style } from '@vyriy/webpack-config/rules.js';
const STYLE_FIXTURES = [
    'style.css',
    'style.scss',
    'style.sass',
];
const isStyleCondition = (condition) => {
    if (condition instanceof RegExp) {
        return STYLE_FIXTURES.some((fixture) => condition.test(fixture));
    }
    if (typeof condition === 'string') {
        return [
            '.css',
            '.scss',
            '.sass',
        ].some((extension) => condition.includes(extension));
    }
    return false;
};
const isStyleRule = (rule) => {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
        return false;
    }
    return isStyleCondition(rule.test);
};
const config = {
    addons: [
        '@storybook/addon-webpack5-compiler-swc',
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
        '@storybook/addon-themes',
        'storybook-addon-pseudo-states',
        '@vueless/storybook-dark-mode',
        'storybook-addon-tag-badges',
    ],
    framework: '@storybook/react-webpack5',
    features: {
        sidebarOnboardingChecklist: false,
    },
    core: {
        disableTelemetry: true,
    },
    docs: {
        defaultName: 'API',
    },
    webpackFinal: (webpackConfig) => {
        return {
            ...webpackConfig,
            performance: {
                ...webpackConfig.performance,
                hints: false,
            },
            module: {
                ...webpackConfig.module,
                rules: [
                    ...(webpackConfig.module?.rules ?? []).filter((rule) => !isStyleRule(rule)),
                    style({ mode: 'inject' }),
                ],
            },
            resolve: {
                ...webpackConfig.resolve,
                extensionAlias: {
                    ...webpackConfig.resolve?.extensionAlias,
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
                },
            },
        };
    },
};
export default config;
