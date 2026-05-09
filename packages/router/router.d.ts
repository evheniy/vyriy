import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from './types.js';
export declare class Router {
    private readonly routes;
    on(method: string, path: string, handler: Handler): this;
    route(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
}
