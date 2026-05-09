import { mode } from './mode.js';
import { optimization } from './optimization.js';
import { performance } from './performance.js';
import { resolve } from './resolve.js';
import { rules } from './rules.js';
export const ssr = (entry, output, config = {}) => {
    const webpackMode = mode();
    const isProduction = webpackMode === 'production';
    const base = {
        devtool: false,
        mode: webpackMode,
        target: 'node',
        entry,
        output,
        module: {
            rules: rules(true, isProduction),
        },
        optimization: optimization(isProduction),
        performance,
        resolve: resolve(config.resolve),
    };
    return {
        ...base,
        ...config,
        output: {
            ...base.output,
            ...config.output,
            library: config.output?.library ?? base.output?.library,
        },
        module: {
            ...base.module,
            ...config.module,
            rules: config.module?.rules ?? base.module?.rules,
        },
        optimization: base.optimization
            ? {
                ...base.optimization,
                ...config.optimization,
            }
            : config.optimization,
        performance: config.performance ?? performance,
        resolve: resolve(config.resolve),
    };
};
