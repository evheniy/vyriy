import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { HandlerParams } from '../types.js';
type MaybePromise<Result> = Result | Promise<Result>;
export type ResponseStream = {
    end: {
        (): unknown;
        (chunk: string | Buffer | Uint8Array): unknown;
    };
    setContentType?: (contentType: string) => unknown;
    writableEnded?: boolean;
    write(chunk: string | Buffer | Uint8Array): unknown;
};
export type Handler = (params: HandlerParams, responseStream: ResponseStream) => MaybePromise<void>;
export type RouterHandler = (event: APIGatewayProxyEvent, responseStream: ResponseStream) => Promise<void>;
export type RouterApi = {
    get(path: string, handler: Handler): RouterApi;
    handle(): RouterHandler;
    post(path: string, handler: Handler): RouterApi;
    put(path: string, handler: Handler): RouterApi;
    delete(path: string, handler: Handler): RouterApi;
    fallback(handler: Handler): RouterApi;
    patch(path: string, handler: Handler): RouterApi;
    route(event: APIGatewayProxyEvent, responseStream: ResponseStream): Promise<void>;
};
export {};
