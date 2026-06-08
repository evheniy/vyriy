import TerserPlugin from 'terser-webpack-plugin';
export const optimization = (isProduction = true) => isProduction
    ? {
        minimize: true,
        splitChunks: false,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    }
    : undefined;
