export const devServerCorsHeaders = {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Origin': '*',
};
const isHeadersRecord = (headers) => {
    return Boolean(headers) && !Array.isArray(headers) && typeof headers === 'object';
};
export const devServer = (options = {}) => {
    return {
        ...options,
        headers: isHeadersRecord(options.headers)
            ? {
                ...devServerCorsHeaders,
                ...options.headers,
            }
            : (options.headers ?? devServerCorsHeaders),
    };
};
