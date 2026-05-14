import { METHODS, STATUS_CODES } from 'node:http';
const SUPPORTED_METHODS = new Set(METHODS.map((method) => method.toUpperCase()));
const removeLeadingSlashes = (value) => {
    let start = 0;
    while (value[start] === '/') {
        start += 1;
    }
    return value.slice(start);
};
const removeTrailingSlashes = (value) => {
    let end = value.length;
    while (end > 0 && value[end - 1] === '/') {
        end -= 1;
    }
    return value.slice(0, end);
};
const getPrefixPath = (eventPath, route) => {
    if (eventPath !== route.pathPrefix && !eventPath.startsWith(`${route.pathPrefix}/`)) {
        return undefined;
    }
    return decodeURIComponent(removeLeadingSlashes(eventPath.slice(route.pathPrefix.length)));
};
const normalizeResult = (result) => ({
    statusCode: result.statusCode ?? 200,
    body: result.body,
    headers: result.headers,
    isBase64Encoded: result.isBase64Encoded,
    multiValueHeaders: result.multiValueHeaders,
});
export class Router {
    fallbackHandler;
    routes = {};
    staticRoutes = [];
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
    fallback(handler) {
        this.fallbackHandler = handler;
        return this;
    }
    prefix(pathPrefix, handler) {
        this.staticRoutes.push({
            handler,
            pathPrefix: removeTrailingSlashes(pathPrefix) || '/',
        });
        return this;
    }
    async route(event, responseStream) {
        const { httpMethod, path, queryStringParameters, body, headers, pathParameters } = event;
        const exactHandler = this.routes[httpMethod]?.[path];
        if (exactHandler) {
            const result = await exactHandler({
                query: queryStringParameters ?? undefined,
                body: body ?? undefined,
                headers,
                pathParameters: pathParameters ?? undefined,
                responseStream,
                event,
            });
            return result ? normalizeResult(result) : undefined;
        }
        for (const staticRoute of this.staticRoutes) {
            const proxy = getPrefixPath(path, staticRoute);
            if (proxy !== undefined) {
                const prefixResult = await staticRoute.handler({
                    query: queryStringParameters ?? undefined,
                    body: body ?? undefined,
                    headers,
                    pathParameters: {
                        ...pathParameters,
                        proxy,
                    },
                    responseStream,
                    event,
                });
                if (prefixResult) {
                    return normalizeResult(prefixResult);
                }
                return undefined;
            }
        }
        if (this.fallbackHandler) {
            const fallbackResult = await this.fallbackHandler({
                query: queryStringParameters ?? undefined,
                body: body ?? undefined,
                headers,
                pathParameters: pathParameters ?? undefined,
                responseStream,
                event,
            });
            return fallbackResult ? normalizeResult(fallbackResult) : undefined;
        }
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: STATUS_CODES[404],
            }),
        };
    }
}
