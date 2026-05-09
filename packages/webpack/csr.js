import { path } from '@vyriy/path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { mode } from './mode.js';
import { optimization } from './optimization.js';
import { performance } from './performance.js';
import { resolve } from './resolve.js';
import { rules } from './rules.js';
export const csr = (entry, output, config = {}) => {
    const webpackMode = mode();
    const isProduction = webpackMode === 'production';
    const base = {
        context: path(),
        devtool: false,
        mode: webpackMode,
        target: isProduction ? 'browserslist' : 'web',
        entry,
        output,
        module: {
            rules: rules(false, isProduction),
        },
        optimization: optimization(isProduction),
        performance,
        plugins: isProduction ? [new MiniCssExtractPlugin()] : [new ReactRefreshWebpackPlugin()],
        resolve: resolve(config.resolve),
    };
    return {
        ...base,
        ...config,
        output: {
            ...base.output,
            ...config.output,
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
        plugins: config.plugins ?? base.plugins,
        resolve: resolve(config.resolve),
    };
};
