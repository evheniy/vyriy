export const withError = (options = {}) => (handler) => async (event, context) => {
    try {
        return await handler(event, context);
    }
    catch (err) {
        await options.errorHandler?.(err, [event, context]);
        throw err;
    }
};
