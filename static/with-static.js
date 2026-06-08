import { useSpa } from './use-spa.js';
import { useStatic } from './use-static.js';
const createSpaHandler = useSpa;
const createStaticHandler = useStatic;
const normalizeMount = (route) => {
    const mount = route.startsWith('/') ? route : `/${route}`;
    let end = mount.length;
    while (end > 1 && mount[end - 1] === '/') {
        end--;
    }
    return mount.slice(0, end);
};
const toMountedPath = (mount, requestPath) => {
    if (mount === '/') {
        return requestPath;
    }
    if (requestPath === mount) {
        return '/';
    }
    if (requestPath.startsWith(`${mount}/`)) {
        return requestPath.slice(mount.length);
    }
    return undefined;
};
const isStaticMethod = (method) => method === 'GET' || method === 'HEAD';
const createFallbackGuard = () => {
    let hasFallback = false;
    return () => {
        if (hasFallback) {
            throw new Error('Router fallback already exists!');
        }
        hasFallback = true;
    };
};
export const withStatic = (router) => {
    const mounts = [];
    let fallbackHandler;
    const registerFallback = createFallbackGuard();
    const addMount = (mount) => {
        mounts.push(mount);
        mounts.sort((left, right) => right.route.length - left.route.length);
    };
    const api = {
        delete(path, handler) {
            router.delete(path, handler);
            return api;
        },
        fallback(handler) {
            registerFallback();
            router.fallback(handler);
            return api;
        },
        fallbackSpa(directory, fallbackOptions) {
            registerFallback();
            fallbackHandler = createSpaHandler(directory, fallbackOptions);
            return api;
        },
        fallbackStatic(directory, fallbackOptions) {
            registerFallback();
            fallbackHandler = createStaticHandler(directory, fallbackOptions);
            return api;
        },
        get(path, handler) {
            router.get(path, handler);
            return api;
        },
        handle() {
            return (event) => api.route(event);
        },
        patch(path, handler) {
            router.patch(path, handler);
            return api;
        },
        post(path, handler) {
            router.post(path, handler);
            return api;
        },
        put(path, handler) {
            router.put(path, handler);
            return api;
        },
        route: async (event) => {
            const result = await router.route(event);
            if (result.statusCode !== 404 || !isStaticMethod(event.httpMethod)) {
                return result;
            }
            for (const mount of mounts) {
                const mountedPath = toMountedPath(mount.route, event.path);
                if (mountedPath === undefined) {
                    continue;
                }
                return mount.handler({
                    ...event,
                    path: mountedPath,
                }, {});
            }
            return fallbackHandler ? fallbackHandler(event, {}) : result;
        },
        spa(route, directory, mountOptions) {
            addMount({
                handler: createSpaHandler(directory, mountOptions),
                route: normalizeMount(route),
            });
            return api;
        },
        static(route, directory, mountOptions) {
            addMount({
                handler: createStaticHandler(directory, mountOptions),
                route: normalizeMount(route),
            });
            return api;
        },
    };
    return api;
};
