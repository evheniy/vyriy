import { useStatic } from './use-static.js';
const normalizeMount = (path) => {
    const mount = path.startsWith('/') ? path : `/${path}`;
    let end = mount.length;
    while (end > 1 && mount[end - 1] === '/') {
        end--;
    }
    return mount.slice(0, end);
};
const toStaticPath = (mount, requestPath) => {
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
const toStaticOptions = (options) => typeof options === 'string' ? { directory: options } : (options ?? {});
export const withStatic = (router, options) => {
    const mounts = [];
    const createStaticHandler = useStatic;
    const api = {
        delete(path, handler) {
            router.delete(path, handler);
            return api;
        },
        fallback(handler) {
            router.fallback(handler);
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
                const staticPath = toStaticPath(mount.path, event.path);
                if (staticPath === undefined) {
                    continue;
                }
                const staticResult = await mount.handler({
                    ...event,
                    path: staticPath,
                }, {});
                return staticResult;
            }
            return result;
        },
        static(path, mountOptions) {
            const staticOptions = mountOptions ?? options;
            mounts.push({
                handler: createStaticHandler(toStaticOptions(staticOptions)),
                path: normalizeMount(path),
            });
            mounts.sort((left, right) => right.path.length - left.path.length);
            return api;
        },
    };
    return api;
};
