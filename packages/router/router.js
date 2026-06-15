import { STATUS_CODES } from 'node:http';
import { BaseRouter, mergeParams } from './base.js';
const normalizeResult = (result) => ({
    statusCode: result.statusCode ?? 200,
    body: result.body,
    headers: result.headers,
    isBase64Encoded: result.isBase64Encoded,
    multiValueHeaders: result.multiValueHeaders,
});
export class Router extends BaseRouter {
    async route(event) {
        const { httpMethod, path, queryStringParameters, body, headers, pathParameters } = event;
        const matched = this.match(httpMethod, path);
        if (matched) {
            const result = await matched.handler({
                query: queryStringParameters ?? undefined,
                body: body ?? undefined,
                headers,
                pathParameters: mergeParams(pathParameters, matched.params),
                event,
            });
            return normalizeResult(result);
        }
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: STATUS_CODES[404],
            }),
        };
    }
}
