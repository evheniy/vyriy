import { mode } from './mode.js';
import { optimization } from './optimization.js';
import { performance } from './performance.js';
import { resolve } from './resolve.js';
import { rules } from './rules.js';
export const ssr = (entry, output, transform) => {
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
        resolve: resolve(),
    };
    return transform ? transform(base) : base;
};
