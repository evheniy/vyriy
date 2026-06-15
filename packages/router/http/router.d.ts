import type { IncomingMessage, ServerResponse } from 'node:http';
import { BaseRouter } from '../base.js';
import type { Handler } from './types.js';
export declare class Router extends BaseRouter<Handler> {
    route(request: IncomingMessage, response: ServerResponse): Promise<void>;
}
