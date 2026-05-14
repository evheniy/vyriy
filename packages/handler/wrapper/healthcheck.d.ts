import type { ApiResult, HandlerArgs } from '../types.js';
export declare const withHealthcheck: (options?: {
    path?: string;
    action?: () => Promise<void>;
} | undefined) => import("../types.js").Decorator<import("aws-lambda").APIGatewayProxyEvent, void | ApiResult, HandlerArgs>;
