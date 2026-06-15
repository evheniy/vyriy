import { STATUS_CODES } from 'node:http';
import { BaseRouter } from '../base.js';
export class Router extends BaseRouter {
    async route(request, response) {
        const method = (request.method ?? 'GET').toUpperCase();
        const pathname = (request.url ?? '/').split('?')[0];
        const matched = this.match(method, pathname);
        if (matched) {
            request.params = matched.params;
            await matched.handler(request, response);
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
