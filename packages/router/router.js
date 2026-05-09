import { METHODS, STATUS_CODES } from 'node:http';
const SUPPORTED_METHODS = new Set(METHODS.map((method) => method.toUpperCase()));
export class Router {
    routes = {};
    on(method, path, handler) {
        const normalizedMethod = method.toUpperCase();
        if (!SUPPORTED_METHODS.has(normalizedMethod)) {
            throw new Error(`Unsupported HTTP method: ${normalizedMethod}`);
        }
        const routeGroup = (this.routes[normalizedMethod] ??= {});
        if (routeGroup[path]) {
            throw new Error(`${normalizedMethod} ${path} already exists!`);
        }
        routeGroup[path] = handler;
        return this;
    }
    async route(event) {
        const { httpMethod, path, queryStringParameters, body, headers, pathParameters } = event;
        const result = await this.routes[httpMethod]?.[path]?.({
            query: queryStringParameters ?? undefined,
            body: body ?? undefined,
            headers,
            pathParameters: pathParameters ?? undefined,
            event,
        });
        return result
            ? {
                statusCode: result.statusCode ?? 200,
                body: result.body,
                headers: result.headers,
            }
            : {
                statusCode: 404,
                body: JSON.stringify({
                    message: STATUS_CODES[404],
                }),
            };
    }
}
