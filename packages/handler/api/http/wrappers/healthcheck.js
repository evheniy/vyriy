import { STATUS_CODES } from 'node:http';
import { factory } from '../factory/index.js';
export const withHealthcheck = factory(async (handler, args, options = {}) => {
    const { path = '/healthcheck', action, body } = options;
    const [request, response] = args;
    const pathname = (request.url ?? '').split('?')[0];
    if (pathname !== path) {
        await handler(...args);
        return;
    }
    if (action) {
        await action();
    }
    response
        .writeHead(200, {
        'content-type': 'application/json',
    })
        .end(JSON.stringify(body ?? { message: STATUS_CODES[200] }));
});
