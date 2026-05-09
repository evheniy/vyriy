import { mapParams } from './params.js';
import { error, result } from './result.js';
export const listener = (handler) => async (request, response) => {
    try {
        const { context, event } = await mapParams(request);
        const value = await handler(event, context);
        result(response, value);
    }
    catch {
        error(response);
    }
};
