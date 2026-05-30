import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
export declare const devServerCorsHeaders: {
    readonly 'Access-Control-Allow-Headers': "*";
    readonly 'Access-Control-Allow-Methods': "GET, HEAD, OPTIONS";
    readonly 'Access-Control-Allow-Origin': "*";
};
export declare const devServer: (options?: DevServerConfiguration) => DevServerConfiguration;
