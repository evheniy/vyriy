import { Router, StreamRouter } from './router.js';
export const createRouter = () => {
    const router = new Router();
    const api = {
        get(path, handler) {
            router.on('GET', path, handler);
            return api;
        },
        post(path, handler) {
            router.on('POST', path, handler);
            return api;
        },
        put(path, handler) {
            router.on('PUT', path, handler);
            return api;
        },
        delete(path, handler) {
            router.on('DELETE', path, handler);
            return api;
        },
        fallback(handler) {
            router.fallback(handler);
            return api;
        },
        handle() {
            return (event) => api.route(event);
        },
        patch(path, handler) {
            router.on('PATCH', path, handler);
            return api;
        },
        route(event) {
            return router.route(event);
        },
    };
    return api;
};
export const createStreamRouter = () => {
    const router = new StreamRouter();
    const api = {
        get(path, handler) {
            router.on('GET', path, handler);
            return api;
        },
        post(path, handler) {
            router.on('POST', path, handler);
            return api;
        },
        put(path, handler) {
            router.on('PUT', path, handler);
            return api;
        },
        delete(path, handler) {
            router.on('DELETE', path, handler);
            return api;
        },
        fallback(handler) {
            router.fallback(handler);
            return api;
        },
        handle() {
            return (event, responseStream) => api.route(event, responseStream);
        },
        patch(path, handler) {
            router.on('PATCH', path, handler);
            return api;
        },
        route(event, responseStream) {
            return router.route(event, responseStream);
        },
    };
    return api;
};
