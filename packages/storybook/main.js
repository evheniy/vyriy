import { style } from '@vyriy/webpack-config/rules.js';
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
                    ...(webpackConfig.module?.rules ?? []),
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
