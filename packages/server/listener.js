import { mapParams } from './params.js';
import { error, result } from './result.js';
const createResponseStream = (response) => {
    response.setContentType = (contentType) => response.setHeader?.('content-type', contentType) ?? response;
    return response;
};
export const listener = (handler) => async (request, response) => {
    try {
        const { context, event } = await mapParams(request);
        const value = await handler(event, context);
        await result(response, value);
    }
    catch {
        error(response);
    }
};
export const streamListener = (handler) => async (request, response) => {
    try {
        const { context, event } = await mapParams(request);
        await handler(event, createResponseStream(response), context);
    }
    catch {
        error(response);
    }
};
export const httpListener = (handler) => async (request, response) => {
    try {
        await handler(request, response);
    }
    catch {
        if (response.writableEnded) {
            return;
        }
        if (response.headersSent) {
            response.end();
            return;
        }
        error(response);
    }
};
