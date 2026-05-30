import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { path } from '@vyriy/path';
import { devServer } from './dev-server.js';
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
        devServer: devServer(),
        mode: webpackMode,
        target: isProduction ? 'browserslist' : 'web',
        entry,
        output,
        module: {
            rules: rules(false, isProduction, 'extract'),
        },
        optimization: optimization(isProduction),
        performance,
        plugins: [
            new MiniCssExtractPlugin(),
            ...(isProduction ? [] : [new ReactRefreshWebpackPlugin()]),
        ],
        resolve: resolve(),
    };
    return transform ? transform(base) : base;
};
