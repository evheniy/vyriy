import type { Context } from 'aws-lambda';
import type { ApiEvent, ApiResult, Handler, ResponseStream } from './types.js';
type LambdaResponseStream = ResponseStream & {
    setContentType?: (contentType: string) => void;
};
export type StreamifiedApiHandler = (event: ApiEvent, responseStream: LambdaResponseStream, context: Context) => Promise<void>;
export declare const streamifyApiResponse: (handler: Handler<ApiEvent, ApiResult | void, [context: Context]>) => StreamifiedApiHandler;
export declare const streamify: (handler: Handler<ApiEvent, ApiResult | void, [responseStream: ResponseStream, context: Context]>) => StreamifiedApiHandler;
export {};
