import { factory } from '../factory/index.js';
export const withCors = factory(async (handler, args) => {
    const [request, response] = args;
    if (request.method === 'OPTIONS') {
        response.writeHead(204).end();
        return;
    }
    await handler(...args);
});
