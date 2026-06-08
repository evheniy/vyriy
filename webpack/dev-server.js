export const devServerCorsHeaders = {
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET, HEAD, OPTIONS',
    'access-control-allow-origin': '*',
};
const isHeadersRecord = (headers) => {
    return Boolean(headers) && !Array.isArray(headers) && typeof headers === 'object';
};
const normalizeHeaders = (headers) => Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
export const devServer = (options = {}) => {
    return {
        ...options,
        headers: isHeadersRecord(options.headers)
            ? {
                ...devServerCorsHeaders,
                ...normalizeHeaders(options.headers),
            }
            : (options.headers ?? devServerCorsHeaders),
    };
};
