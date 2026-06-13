import { STATUS_CODES } from 'node:http';
const defaultErrorResult = () => ({
    statusCode: 500,
    headers: {
        'content-type': 'application/json',
    },
    body: JSON.stringify({
        message: STATUS_CODES[500],
    }),
});
export const withApiError = (options = {}) => (handler) => async (event, context) => {
    try {
        return await handler(event, context);
    }
    catch (err) {
        return options.errorHandler?.(err, [event, context]) ?? defaultErrorResult();
    }
};
