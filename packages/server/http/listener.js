import { error } from '../result.js';
export const listener = (handler) => async (request, response) => {
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
