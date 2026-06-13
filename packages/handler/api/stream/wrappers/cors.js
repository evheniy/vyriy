import { factory } from '../factory/index.js';
import { responseStream } from './stream.js';
export const withCors = factory(async (handler, args) => {
    const [request, stream] = args;
    if (request.httpMethod === 'OPTIONS') {
        responseStream(stream, { statusCode: 204 }).end();
        return;
    }
    await handler(...args);
});
