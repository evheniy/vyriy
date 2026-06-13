import { METHODS } from 'node:http';
const SUPPORTED_METHODS = new Set(METHODS.map((method) => method.toUpperCase()));
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
export class BaseRouter {
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
