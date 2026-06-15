import { STATUS_CODES } from 'node:http';
import { BaseRouter, mergeParams } from '../base.js';
export class Router extends BaseRouter {
    async route(event, responseStream) {
        const { httpMethod, path, queryStringParameters, body, headers, pathParameters } = event;
        const matched = this.match(httpMethod, path);
        if (matched) {
            await matched.handler({
                query: queryStringParameters ?? undefined,
                body: body ?? undefined,
                headers,
                pathParameters: mergeParams(pathParameters, matched.params),
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
