import type { Api } from './types.js';
export declare const API_HEADERS: {
    'access-control-allow-origin': string;
    'access-control-allow-methods': string;
    'access-control-allow-headers': string;
    'content-type': string;
    'x-robots-tag': string;
};
export declare const createApi: Api;
export declare const api: import("./types.js").Decorator<import("aws-lambda").APIGatewayProxyEvent, import("aws-lambda").APIGatewayProxyResult>;
