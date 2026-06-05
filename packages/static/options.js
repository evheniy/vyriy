const DEFAULT_DIRECTORY = 'dist';
const DEFAULT_FALLBACK = 'index.html';
const DEFAULT_INDEX = 'index.html';
export const normalizeStaticOptions = (directory = DEFAULT_DIRECTORY, options = {}) => {
    return {
        cache: options.cache ?? 'default',
        directory,
        headers: options.headers,
        index: options.index ?? DEFAULT_INDEX,
        notFound: options.notFound ?? false,
    };
};
export const normalizeSpaOptions = (directory = DEFAULT_DIRECTORY, options = {}) => ({
    cache: options.cache ?? 'static',
    directory,
    fallback: options.fallback ?? DEFAULT_FALLBACK,
    headers: options.headers,
});
