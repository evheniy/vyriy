import { factory, streamFactory } from '../factory.js';
import { responseStream } from './stream.js';
const normalizeHeaders = (headers) => Object.fromEntries(Object.entries(headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]));
const mergeHeaders = (result, options) => {
    result.headers = {
        ...normalizeHeaders(options),
        ...normalizeHeaders(result.headers),
    };
    return result;
};
export const withHeaders = factory(async (handler, args, options = {}) => {
    const result = await handler(...args);
    return mergeHeaders(result, options);
});
export const streamWithHeaders = streamFactory(async (handler, args, options = {}) => {
    const [event, stream, context] = args;
    await handler(event, responseStream(stream, { headers: normalizeHeaders(options) }), context);
});
