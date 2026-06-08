import { STATUS_CODES } from 'node:http';
import { responseStream } from './stream.js';
const defaultErrorResult = () => ({
    statusCode: 500,
    headers: {
        'content-type': 'application/json',
    },
    body: JSON.stringify({
        message: STATUS_CODES[500],
    }),
});
export const withError = (options = {}) => (handler) => async (event, context) => {
    try {
        return await handler(event, context);
    }
    catch (err) {
        await options.errorHandler?.(err, [event, context]);
        throw err;
    }
};
export const withApiError = (options = {}) => (handler) => async (event, context) => {
    try {
        return await handler(event, context);
    }
    catch (err) {
        return options.errorHandler?.(err, [event, context]) ?? defaultErrorResult();
    }
};
export const streamWithApiError = (options = {}) => (handler) => async (event, stream, context) => {
    try {
        await handler(event, stream, context);
    }
    catch (err) {
        const result = (await options.errorHandler?.(err, [event, stream, context])) ?? defaultErrorResult();
        if (result) {
            responseStream(stream, {
                headers: result.headers,
                statusCode: result.statusCode,
            }).end(result.body);
        }
    }
};
