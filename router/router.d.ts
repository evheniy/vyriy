import type { APIGatewayProxyEvent, Handler, ResponseStream, RouteResult, StreamHandler } from './types.js';
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
export {};
