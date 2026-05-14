import { mapParams } from './params.js';
import { error, result } from './result.js';
const isStreamHandler = (handler) => handler.length >= 3;
const createResponseStream = (response) => {
    response.setContentType = (contentType) => response.setHeader?.('content-type', contentType) ?? response;
    return response;
};
export const listener = (handler) => async (request, response) => {
    try {
        const { context, event } = await mapParams(request);
        if (isStreamHandler(handler)) {
            await handler(event, createResponseStream(response), context);
            return;
        }
        const value = await handler(event, context);
        await result(response, value);
    }
    catch {
        error(response);
    }
};
