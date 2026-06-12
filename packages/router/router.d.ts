import type { IncomingMessage, ServerResponse } from 'node:http';
import type { APIGatewayProxyEvent, Handler, HttpHandler, ResponseStream, RouteResult, StreamHandler } from './types.js';
declare class BaseRouter<CurrentHandler> {
    protected fallbackHandler?: CurrentHandler;
    protected readonly routes: Record<string, Record<string, CurrentHandler>>;
    on(method: string, path: string, handler: CurrentHandler): this;
    fallback(handler: CurrentHandler): this;
}
export declare class Router extends BaseRouter<Handler> {
    route(event: APIGatewayProxyEvent): Promise<RouteResult>;
}
export declare class StreamRouter extends BaseRouter<StreamHandler> {
    route(event: APIGatewayProxyEvent, responseStream: ResponseStream): Promise<void>;
}
export declare class HttpRouter extends BaseRouter<HttpHandler> {
    private readonly allRoutes;
    all(path: string, handler: HttpHandler): this;
    route(request: IncomingMessage, response: ServerResponse): Promise<void>;
}
export {};
