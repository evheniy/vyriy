import { factory } from '../../factory/index.js';
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
