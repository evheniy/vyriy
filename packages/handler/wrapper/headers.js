import { factory } from '../factory.js';
export const withHeaders = factory(async (handler, args, options = {}) => {
    const result = await handler(...args);
    if (!result) {
        return result;
    }
    result.headers = {
        ...options,
        ...result.headers,
    };
    return result;
});
