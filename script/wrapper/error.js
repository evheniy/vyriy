import { factory } from '../factory.js';
export const withError = factory(async (handler, options) => {
    const errorHandler = options?.errorHandler;
    try {
        await handler();
    }
    catch (error) {
        if (errorHandler) {
            await errorHandler(error);
        }
        throw error;
    }
});
