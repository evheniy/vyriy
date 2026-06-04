import { useSpa } from './use-spa.js';
const createSpaHandler = useSpa;
const isStaticMethod = (method) => method === 'GET' || method === 'HEAD';
export const withSpa = (router, directoryOrOptions = {}) => {
    const options = typeof directoryOrOptions === 'string' ? { directory: directoryOrOptions } : directoryOrOptions;
    const spaHandler = createSpaHandler(options);
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
            return spaHandler(event, {});
        },
    };
    return api;
};
