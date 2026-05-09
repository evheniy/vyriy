import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { babel } from './babel.js';
import { postcss } from './postcss.js';
export const SCRIPT_TEST = /\.(mjs|cjs|js|jsx|mts|cts|ts|tsx)$/;
export const STYLE_TEST = /\.(css|scss|sass)$/;
export const rules = (isSsr = false, isProduction = true) => [
    {
        test: SCRIPT_TEST,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: babel(isSsr, isProduction),
        },
    },
    {
        test: STYLE_TEST,
        use: isSsr
            ? ['null-loader']
            : [
                isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: postcss(),
                    },
                },
                'sass-loader',
            ],
    },
];
