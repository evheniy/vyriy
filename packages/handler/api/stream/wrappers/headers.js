import { factory } from '../factory/index.js';
import { responseStream } from './stream.js';
const normalizeHeaders = (headers) => Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
export const withHeaders = factory(async (handler, args, options = {}) => {
    const [event, stream, context] = args;
    await handler(event, responseStream(stream, { headers: normalizeHeaders(options) }), context);
});
