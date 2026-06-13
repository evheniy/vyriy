import { factory } from '../factory/index.js';
export const withHeaders = factory(async (handler, args, options = {}) => {
    const [request, response] = args;
    for (const [name, value] of Object.entries(options)) {
        response.setHeader(name.toLowerCase(), value);
    }
    await handler(request, response);
});
