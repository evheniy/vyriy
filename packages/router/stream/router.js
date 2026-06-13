import { STATUS_CODES } from 'node:http';
import { BaseRouter } from '../base.js';
export class Router extends BaseRouter {
    async route(event, responseStream) {
        const { httpMethod, path, queryStringParameters, body, headers, pathParameters } = event;
        const exactHandler = this.routes[httpMethod]?.[path];
        if (exactHandler) {
            await exactHandler({
                query: queryStringParameters ?? undefined,
                body: body ?? undefined,
                headers,
                pathParameters: pathParameters ?? undefined,
                event,
            }, responseStream);
            return;
        }
        if (this.fallbackHandler) {
            await this.fallbackHandler({
                query: queryStringParameters ?? undefined,
                body: body ?? undefined,
                headers,
                pathParameters: pathParameters ?? undefined,
                event,
            }, responseStream);
            return;
        }
        responseStream.setContentType?.('application/json');
        responseStream.end(JSON.stringify({
            message: STATUS_CODES[404],
        }));
    }
}
