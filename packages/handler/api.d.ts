import type { ApiEvent, ApiResult, Context, Handler, ResponseStream } from './types.js';
type ApiDecorator = {
    (handler: Handler<ApiEvent, ApiResult | void, [context: Context]>): Handler<ApiEvent, ApiResult | void, [context: Context]>;
    (handler: Handler<ApiEvent, ApiResult | void, [responseStream: ResponseStream, context: Context]>): Handler<ApiEvent, ApiResult | void, [responseStream: ResponseStream, context: Context]>;
};
export declare const api: ApiDecorator;
export {};
