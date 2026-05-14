import type { ApiResult, ResponseStream } from '../types.js';
export type StreamMetadata = {
    headers?: ApiResult['headers'];
    statusCode?: ApiResult['statusCode'];
};
export declare const responseStream: (stream: ResponseStream, metadata?: StreamMetadata) => ResponseStream;
