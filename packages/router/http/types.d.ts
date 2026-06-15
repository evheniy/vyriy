import type { IncomingMessage, ServerResponse } from 'node:http';
import type { HttpHandler } from '@vyriy/handler';
import type { RouteParams } from '../base.js';
export type { RouteParams } from '../base.js';
export type Handler = HttpHandler;
export type RequestWithParams = IncomingMessage & {
    params?: RouteParams;
};
export type RouterApi = {
    all(path: string, handler: Handler): RouterApi;
    get(path: string, handler: Handler): RouterApi;
    handle(): Handler;
    post(path: string, handler: Handler): RouterApi;
    put(path: string, handler: Handler): RouterApi;
    delete(path: string, handler: Handler): RouterApi;
    fallback(handler: Handler): RouterApi;
    patch(path: string, handler: Handler): RouterApi;
    route(request: IncomingMessage, response: ServerResponse): Promise<void>;
};
