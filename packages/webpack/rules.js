import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { babel } from './babel.js';
import { postcss } from './postcss.js';
import { resolveDependency } from './resolve-dependency.js';
export const SCRIPT_TEST = /\.(mjs|cjs|js|jsx|mts|cts|ts|tsx)$/;
export const STYLE_TEST = /\.(css|scss|sass)$/;
const postcssLoader = () => ({
    loader: resolveDependency('postcss-loader'),
    options: {
        postcssOptions: postcss(),
    },
});
const styleLoader = (mode) => {
    return mode === 'extract' ? MiniCssExtractPlugin.loader : resolveDependency('style-loader');
};
const stylesheetLoaders = (mode) => [
    styleLoader(mode),
    resolveDependency('css-loader'),
    postcssLoader(),
    resolveDependency('sass-loader'),
];
const inlineStylesheetLoaders = () => [
    {
        loader: resolveDependency('css-loader'),
        options: {
            exportType: 'string',
        },
    },
    postcssLoader(),
    resolveDependency('sass-loader'),
];
export const style = ({ mode = 'extract' } = {}) => {
    if (mode === 'ignore') {
        return {
            test: STYLE_TEST,
            use: [resolveDependency('null-loader')],
        };
    }
    return {
        test: STYLE_TEST,
        oneOf: [
            {
                resourceQuery: /inline/,
                use: inlineStylesheetLoaders(),
            },
            {
                use: stylesheetLoaders(mode),
            },
        ],
    };
};
export const rules = (isSsr = false, isProduction = true) => {
    let mode;
    if (isSsr) {
        mode = 'ignore';
    }
    else if (isProduction) {
        mode = 'extract';
    }
    else {
        mode = 'inject';
    }
    return [
        {
            test: SCRIPT_TEST,
            exclude: /node_modules/,
            use: {
                loader: resolveDependency('babel-loader'),
                options: babel(isSsr, isProduction),
            },
        },
        style({ mode }),
    ];
};
