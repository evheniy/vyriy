import { useStatic } from './use-static.js';
const createStaticHandler = useStatic;
const isSpaFallbackMethod = (method) => method === 'GET' || method === 'HEAD';
export const useSpa = (options = {}) => {
    const handler = createStaticHandler(options);
    const index = options.index ?? 'index.html';
    return async (event, context) => {
        const result = await handler(event, context);
        if (result.statusCode !== 404 || !isSpaFallbackMethod(event.httpMethod)) {
            return result;
        }
        return handler({
            ...event,
            path: `/${index}`,
        }, context);
    };
};
