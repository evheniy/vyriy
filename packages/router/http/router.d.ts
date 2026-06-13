import type { IncomingMessage, ServerResponse } from 'node:http';
import { BaseRouter } from '../base.js';
import type { Handler } from './types.js';
export declare class Router extends BaseRouter<Handler> {
    private readonly allRoutes;
    all(path: string, handler: Handler): this;
    route(request: IncomingMessage, response: ServerResponse): Promise<void>;
}
