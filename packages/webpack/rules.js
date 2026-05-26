import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { babel } from './babel.js';
import { postcss } from './postcss.js';
import { resolveDependency } from './resolve-dependency.js';
export const SCRIPT_TEST = /\.(mjs|cjs|js|jsx|mts|cts|ts|tsx)$/;
export const STYLE_TEST = /\.(css|scss|sass)$/;
export const rules = (isSsr = false, isProduction = true) => [
    {
        test: SCRIPT_TEST,
        exclude: /node_modules/,
        use: {
            loader: resolveDependency('babel-loader'),
            options: babel(isSsr, isProduction),
        },
    },
    {
        test: STYLE_TEST,
        use: isSsr
            ? [resolveDependency('null-loader')]
            : [
                isProduction ? MiniCssExtractPlugin.loader : resolveDependency('style-loader'),
                resolveDependency('css-loader'),
                {
                    loader: resolveDependency('postcss-loader'),
                    options: {
                        postcssOptions: postcss(),
                    },
                },
                resolveDependency('sass-loader'),
            ],
    },
];
