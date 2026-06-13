import { STATUS_CODES } from 'node:http';
import { BaseRouter } from './base.js';
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
        const exactHandler = this.routes[httpMethod]?.[path];
        if (exactHandler) {
            const result = await exactHandler({
                query: queryStringParameters ?? undefined,
                body: body ?? undefined,
                headers,
                pathParameters: pathParameters ?? undefined,
                event,
            });
            return normalizeResult(result);
        }
        if (this.fallbackHandler) {
            const fallbackResult = await this.fallbackHandler({
                query: queryStringParameters ?? undefined,
                body: body ?? undefined,
                headers,
                pathParameters: pathParameters ?? undefined,
                event,
            });
            return normalizeResult(fallbackResult);
        }
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: STATUS_CODES[404],
            }),
        };
    }
}
