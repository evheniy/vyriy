import { mapParams } from '../params.js';
import { error } from '../result.js';
const createResponseStream = (response) => {
    response.setContentType = (contentType) => response.setHeader?.('content-type', contentType) ?? response;
    return response;
};
export const listener = (handler) => async (request, response) => {
    try {
        const { context, event } = await mapParams(request);
        await handler(event, createResponseStream(response), context);
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
