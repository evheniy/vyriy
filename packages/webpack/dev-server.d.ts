import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
export declare const devServerCorsHeaders: {
    readonly 'access-control-allow-headers': "*";
    readonly 'access-control-allow-methods': "GET, HEAD, OPTIONS";
    readonly 'access-control-allow-origin': "*";
};
export declare const devServer: (options?: DevServerConfiguration) => DevServerConfiguration;
