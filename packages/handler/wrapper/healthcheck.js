import { STATUS_CODES } from 'node:http';
import { factory } from '../factory.js';
export const withHealthcheck = factory(async (handler, args, options = {}) => {
    const [event] = args;
    const { path = '/healthcheck', action } = options;
    if (event.path === path) {
        if (action) {
            await action();
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: STATUS_CODES[200],
            }),
        };
    }
    return handler(...args);
});
