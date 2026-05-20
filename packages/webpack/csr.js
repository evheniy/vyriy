import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { path } from '@vyriy/path';
import { mode } from './mode.js';
import { optimization } from './optimization.js';
import { performance } from './performance.js';
import { resolve } from './resolve.js';
import { rules } from './rules.js';
export const csr = (entry, output, transform) => {
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
        resolve: resolve(),
    };
    return transform ? transform(base) : base;
};
