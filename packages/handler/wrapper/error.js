import { factory } from '../factory.js';
export const withError = factory(async (handler, args, options = {}) => {
    const { errorHandler, throwError = false } = options;
    let result;
    try {
        result = await handler(...args);
    }
    catch (err) {
        if (errorHandler) {
            await errorHandler(err);
        }
        if (throwError) {
            throw err;
        }
    }
    return result;
});
