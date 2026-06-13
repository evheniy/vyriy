import { BaseRouter } from './base.js';
import type { APIGatewayProxyEvent, Handler, RouteResult } from './types.js';
export declare class Router extends BaseRouter<Handler> {
    route(event: APIGatewayProxyEvent): Promise<RouteResult>;
}
