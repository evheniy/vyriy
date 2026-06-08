import type { ApiEvent, ApiResult, Decorator, HandlerParams, StreamDecorator, StreamHandlerParams } from '../types.js';
export type ErrorHandler<Params extends unknown[]> = (err: unknown, args: Params) => Promise<void> | void;
export type ApiErrorHandler<Params extends unknown[], Result> = (err: unknown, args: Params) => Promise<Result> | Result;
export type ErrorOptions<Params extends unknown[]> = {
    errorHandler?: ErrorHandler<Params>;
};
export type ApiErrorOptions<Params extends unknown[], Result> = {
    errorHandler?: ApiErrorHandler<Params, Result>;
};
export declare const withError: <Event, Result>(options?: ErrorOptions<HandlerParams<Event>>) => Decorator<Event, Result>;
export declare const withApiError: (options?: ApiErrorOptions<HandlerParams<ApiEvent>, ApiResult>) => Decorator<ApiEvent, ApiResult>;
export declare const streamWithApiError: (options?: ApiErrorOptions<StreamHandlerParams<ApiEvent>, ApiResult | void>) => StreamDecorator<ApiEvent>;
