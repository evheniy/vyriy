import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { style } from '@vyriy/webpack-config/rules.js';
const requireFromPackage = createRequire(import.meta.url);
const resolvePackageRoot = (request) => dirname(requireFromPackage.resolve(`${request}/package.json`));
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
        resolvePackageRoot('@storybook/addon-webpack5-compiler-swc'),
        resolvePackageRoot('@storybook/addon-a11y'),
        resolvePackageRoot('@storybook/addon-docs'),
        resolvePackageRoot('@storybook/addon-themes'),
        resolvePackageRoot('storybook-addon-pseudo-states'),
        resolvePackageRoot('@vueless/storybook-dark-mode'),
        resolvePackageRoot('storybook-addon-tag-badges'),
    ],
    framework: {
        name: resolvePackageRoot('@storybook/react-webpack5'),
        options: {},
    },
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
