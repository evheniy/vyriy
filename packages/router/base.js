import { METHODS } from 'node:http';
const SUPPORTED_METHODS = new Set(METHODS.map((method) => method.toUpperCase()));
const ALL_METHODS = '*';
const EMPTY_PARAMS = Object.freeze({});
const splitPath = (path) => path.split('/');
const methodLabel = (method) => (method === ALL_METHODS ? 'ALL' : method);
const decodeSegment = (value) => {
    try {
        return decodeURIComponent(value);
    }
    catch {
        return value;
    }
};
const parsePattern = (path) => {
    const segments = splitPath(path);
    const mask = segments.map((segment) => (segment.startsWith(':') ? 1 : 0));
    const names = new Set();
    segments.forEach((segment) => {
        if (!segment.startsWith(':')) {
            return;
        }
        const name = segment.slice(1);
        if (!name) {
            throw new Error(`Invalid route parameter in ${path}`);
        }
        if (names.has(name)) {
            throw new Error(`Duplicate route parameter ":${name}" in ${path}`);
        }
        names.add(name);
    });
    return { segments, mask, dynamic: mask.includes(1) };
};
const signatureOf = (segments, mask) => segments.map((segment, index) => (mask[index] ? ':' : segment)).join('/');
const compareSpecificity = (left, right) => {
    const length = Math.min(left.mask.length, right.mask.length);
    for (let index = 0; index < length; index += 1) {
        if (left.mask[index] !== right.mask[index]) {
            return left.mask[index] - right.mask[index];
        }
    }
    return left.mask.length - right.mask.length;
};
const matchDynamic = (routes, segments) => {
    if (!routes) {
        return undefined;
    }
    for (const route of routes) {
        if (route.segments.length !== segments.length) {
            continue;
        }
        const params = {};
        let matched = true;
        for (let index = 0; index < segments.length; index += 1) {
            if (route.mask[index]) {
                params[route.segments[index].slice(1)] = decodeSegment(segments[index]);
                continue;
            }
            if (route.segments[index] !== segments[index]) {
                matched = false;
                break;
            }
        }
        if (matched) {
            return { handler: route.handler, params };
        }
    }
    return undefined;
};
export const mergeParams = (existing, params) => {
    if (Object.keys(params).length === 0) {
        return existing ?? undefined;
    }
    return { ...existing, ...params };
};
export class BaseRouter {
    fallbackHandler;
    routes = {};
    dynamicRoutes = {};
    dynamicSignatures = {};
    on(method, path, handler) {
        const normalizedMethod = method.toUpperCase();
        if (!SUPPORTED_METHODS.has(normalizedMethod)) {
            throw new Error(`Unsupported HTTP method: ${normalizedMethod}`);
        }
        this.register(normalizedMethod, path, handler);
        return this;
    }
    all(path, handler) {
        this.register(ALL_METHODS, path, handler);
        return this;
    }
    fallback(handler) {
        this.fallbackHandler = handler;
        return this;
    }
    match(method, pathname) {
        const exact = this.routes[method]?.[pathname];
        if (exact) {
            return { handler: exact, params: EMPTY_PARAMS };
        }
        const segments = splitPath(pathname);
        const dynamic = matchDynamic(this.dynamicRoutes[method], segments);
        if (dynamic) {
            return dynamic;
        }
        const allExact = this.routes[ALL_METHODS]?.[pathname];
        if (allExact) {
            return { handler: allExact, params: EMPTY_PARAMS };
        }
        const allDynamic = matchDynamic(this.dynamicRoutes[ALL_METHODS], segments);
        if (allDynamic) {
            return allDynamic;
        }
        if (this.fallbackHandler) {
            return { handler: this.fallbackHandler, params: EMPTY_PARAMS };
        }
        return undefined;
    }
    register(method, path, handler) {
        const { segments, mask, dynamic } = parsePattern(path);
        if (dynamic) {
            this.registerDynamic(method, path, segments, mask, handler);
            return;
        }
        const routeGroup = (this.routes[method] ??= {});
        if (routeGroup[path]) {
            throw new Error(`${methodLabel(method)} ${path} already exists!`);
        }
        routeGroup[path] = handler;
    }
    registerDynamic(method, path, segments, mask, handler) {
        const signature = signatureOf(segments, mask);
        const signatures = (this.dynamicSignatures[method] ??= new Set());
        if (signatures.has(signature)) {
            throw new Error(`${methodLabel(method)} ${path} already exists!`);
        }
        signatures.add(signature);
        const list = (this.dynamicRoutes[method] ??= []);
        list.push({ segments, mask, handler });
        list.sort(compareSpecificity);
    }
}
