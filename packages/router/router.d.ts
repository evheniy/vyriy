import type { APIGatewayProxyEvent, Handler, ResponseStream, RouteResult } from './types.js';
export declare class Router {
    private fallbackHandler?;
    private readonly routes;
    private readonly staticRoutes;
    on(method: string, path: string, handler: Handler): this;
    fallback(handler: Handler): this;
    prefix(pathPrefix: string, handler: Handler): this;
    route(event: APIGatewayProxyEvent, responseStream?: ResponseStream): Promise<RouteResult | void>;
}
