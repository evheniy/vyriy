import type { ApiResult, HandlerArgs } from '../types.js';
export declare const withHeaders: (options?: Record<string, string> | undefined) => import("../types.js").Decorator<import("aws-lambda").APIGatewayProxyEvent, void | ApiResult, HandlerArgs>;
