import { STATUS_CODES } from 'node:http';
export const withError = (options = {}) => (handler) => async (request, response) => {
    try {
        await handler(request, response);
    }
    catch (err) {
        await options.errorHandler?.(err, [request, response]);
        if (response.writableEnded) {
            return;
        }
        if (response.headersSent) {
            response.end();
            return;
        }
        response
            .writeHead(500, {
            'content-type': 'application/json',
        })
            .end(JSON.stringify({ message: STATUS_CODES[500] }));
    }
};
