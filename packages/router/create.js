import { Router } from './router.js';
export const createRouter = () => {
    const instance = new Router();
    const api = {
        get(path, handler) {
            instance.on('GET', path, handler);
            return api;
        },
        post(path, handler) {
            instance.on('POST', path, handler);
            return api;
        },
        put(path, handler) {
            instance.on('PUT', path, handler);
            return api;
        },
        delete(path, handler) {
            instance.on('DELETE', path, handler);
            return api;
        },
        fallback(handler) {
            instance.fallback(handler);
            return api;
        },
        handle() {
            return (event) => api.route(event);
        },
        patch(path, handler) {
            instance.on('PATCH', path, handler);
            return api;
        },
        route(event) {
            return instance.route(event);
        },
    };
    return api;
};
export const router = createRouter();
