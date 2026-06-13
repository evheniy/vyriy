import { BaseRouter } from '../base.js';
import type { APIGatewayProxyEvent } from '../types.js';
import type { Handler, ResponseStream } from './types.js';
export declare class Router extends BaseRouter<Handler> {
    route(event: APIGatewayProxyEvent, responseStream: ResponseStream): Promise<void>;
}
