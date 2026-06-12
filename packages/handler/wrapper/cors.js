import { factory, httpFactory, streamFactory } from '../factory.js';
import { responseStream } from './stream.js';
export const withCors = factory(async (handler, args) => {
    const [request] = args;
    if (request.httpMethod === 'OPTIONS') {
        return {
            body: '',
            statusCode: 204,
        };
    }
    return handler(...args);
});
export const streamWithCors = streamFactory(async (handler, args) => {
    const [request, stream] = args;
    if (request.httpMethod === 'OPTIONS') {
        responseStream(stream, { statusCode: 204 }).end();
        return;
    }
    await handler(...args);
});
export const httpWithCors = httpFactory(async (handler, args) => {
    const [request, response] = args;
    if (request.method === 'OPTIONS') {
        response.writeHead(204).end();
        return;
    }
    await handler(...args);
});
