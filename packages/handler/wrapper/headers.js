import { factory, streamFactory } from '../factory.js';
import { responseStream } from './stream.js';
const mergeHeaders = (result, options) => {
    result.headers = {
        ...options,
        ...result.headers,
    };
    return result;
};
export const withHeaders = factory(async (handler, args, options = {}) => {
    const result = await handler(...args);
    return mergeHeaders(result, options);
});
export const streamWithHeaders = streamFactory(async (handler, args, options = {}) => {
    const [event, stream, context] = args;
    await handler(event, responseStream(stream, { headers: options }), context);
});
