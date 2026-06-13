import { STATUS_CODES } from 'node:http';
import { BaseRouter } from '../base.js';
export class Router extends BaseRouter {
    allRoutes = {};
    all(path, handler) {
        if (this.allRoutes[path]) {
            throw new Error(`ALL ${path} already exists!`);
        }
        this.allRoutes[path] = handler;
        return this;
    }
    async route(request, response) {
        const method = (request.method ?? 'GET').toUpperCase();
        const pathname = (request.url ?? '/').split('?')[0];
        const handler = this.routes[method]?.[pathname] ?? this.allRoutes[pathname] ?? this.fallbackHandler;
        if (handler) {
            await handler(request, response);
            return;
        }
        response
            .writeHead(404, {
            'content-type': 'application/json',
        })
            .end(JSON.stringify({
            message: STATUS_CODES[404],
        }));
    }
}
