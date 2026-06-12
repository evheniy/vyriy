import { METHODS, STATUS_CODES } from 'node:http';
const SUPPORTED_METHODS = new Set(METHODS.map((method) => method.toUpperCase()));
const normalizeResult = (result) => ({
    statusCode: result.statusCode ?? 200,
    body: result.body,
    headers: result.headers,
    isBase64Encoded: result.isBase64Encoded,
    multiValueHeaders: result.multiValueHeaders,
});
const registerRoute = (routes, method, path, handler) => {
    const normalizedMethod = method.toUpperCase();
    if (!SUPPORTED_METHODS.has(normalizedMethod)) {
        throw new Error(`Unsupported HTTP method: ${normalizedMethod}`);
    }
    const routeGroup = (routes[normalizedMethod] ??= {});
    if (routeGroup[path]) {
        throw new Error(`${normalizedMethod} ${path} already exists!`);
    }
    routeGroup[path] = handler;
};
class BaseRouter {
    fallbackHandler;
    routes = {};
    on(method, path, handler) {
        registerRoute(this.routes, method, path, handler);
        return this;
    }
    fallback(handler) {
        this.fallbackHandler = handler;
        return this;
    }
}
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
export class StreamRouter extends BaseRouter {
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
export class HttpRouter extends BaseRouter {
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
