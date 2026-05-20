import HtmlWebpackPlugin from 'html-webpack-plugin';
import { html as page } from '@vyriy/html';
export const html = (props, options = {}) => {
    return new HtmlWebpackPlugin({
        templateContent: page(props),
        publicPath: '/',
        hash: true,
        inject: 'body',
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: false,
            minifyJS: true,
            minifyCSS: true,
        },
        ...options,
    });
};
