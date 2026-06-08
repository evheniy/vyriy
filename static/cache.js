import path from 'node:path';
const ASSET_EXTENSIONS = new Set([
    '.avif',
    '.css',
    '.gif',
    '.ico',
    '.jpeg',
    '.jpg',
    '.js',
    '.map',
    '.mjs',
    '.png',
    '.svg',
    '.webp',
    '.woff',
    '.woff2',
]);
const extensionGroupPattern = /\.\{([^}]+)\}$/;
const toCacheOptions = (cache) => {
    if (cache === false || cache === 'none') {
        return {
            etag: false,
            lastModified: false,
        };
    }
    if (cache === 'immutable') {
        return {
            etag: true,
            immutable: true,
            lastModified: true,
            maxAge: 31_536_000,
        };
    }
    if (cache === 'default' || cache === 'static' || cache === undefined) {
        return {
            etag: true,
            lastModified: true,
            maxAge: 3_600,
        };
    }
    return cache;
};
const matchRule = (filePath, match) => {
    const extension = path.extname(filePath).toLowerCase();
    const extensionGroup = extensionGroupPattern.exec(match);
    if (extensionGroup) {
        return extensionGroup[1].split(',').some((value) => extension === `.${value.trim().toLowerCase()}`);
    }
    if (match.startsWith('**/*.')) {
        return extension === match.slice('**/*'.length).toLowerCase();
    }
    return filePath === match || filePath.endsWith(match);
};
const resolveStaticPreset = (extension) => {
    if (ASSET_EXTENSIONS.has(extension)) {
        return {
            etag: true,
            immutable: true,
            lastModified: true,
            maxAge: 31_536_000,
        };
    }
    return {
        etag: true,
        lastModified: true,
        maxAge: 0,
    };
};
const resolveRule = (cache, filePath) => {
    if (typeof cache !== 'object' || !('rules' in cache)) {
        return cache;
    }
    const rule = cache.rules.find(({ match }) => {
        const matches = typeof match === 'string'
            ? [
                match,
            ]
            : match;
        return matches.some((item) => matchRule(filePath, item));
    });
    return rule?.cache ?? cache.fallback;
};
export const resolveCacheOptions = (cache, filePath, defaultCache) => {
    const extension = path.extname(filePath).toLowerCase();
    const selectedCache = cache === 'static' ? resolveStaticPreset(extension) : resolveRule(cache ?? defaultCache, filePath);
    const options = toCacheOptions(selectedCache);
    const noStore = selectedCache === false || selectedCache === 'none';
    if (noStore) {
        return {
            cacheControl: 'no-store',
            etag: false,
            lastModified: false,
        };
    }
    const maxAge = options.maxAge ?? 3_600;
    const directives = maxAge === 0
        ? [
            'no-cache',
        ]
        : [
            'public',
            `max-age=${maxAge}`,
        ];
    if (options.immutable) {
        directives.push('immutable');
    }
    if (options.staleWhileRevalidate !== undefined) {
        directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
    }
    if (options.staleIfError !== undefined) {
        directives.push(`stale-if-error=${options.staleIfError}`);
    }
    return {
        cacheControl: directives.join(', '),
        etag: options.etag ?? true,
        immutable: options.immutable,
        lastModified: options.lastModified ?? true,
        maxAge,
        staleIfError: options.staleIfError,
        staleWhileRevalidate: options.staleWhileRevalidate,
    };
};
export const createEtag = (size, modifiedTime) => `W/"${size.toString(16)}-${Math.trunc(modifiedTime.getTime()).toString(16)}"`;
export const createCacheHeaders = (cache, size, modifiedTime) => {
    const headers = {
        'cache-control': cache.cacheControl,
    };
    if (cache.etag) {
        headers.etag = createEtag(size, modifiedTime);
    }
    if (cache.lastModified) {
        headers['last-modified'] = modifiedTime.toUTCString();
    }
    return headers;
};
export const maybeNotModified = (event, headers) => {
    const requestHeaders = event.headers ?? {};
    const ifNoneMatch = requestHeaders['if-none-match'] ?? requestHeaders['If-None-Match'];
    if (ifNoneMatch) {
        if (headers.etag &&
            ifNoneMatch
                .split(',')
                .map((value) => value.trim())
                .includes(headers.etag)) {
            return {
                body: '',
                headers,
                statusCode: 304,
            };
        }
        return undefined;
    }
    const ifModifiedSince = requestHeaders['if-modified-since'] ?? requestHeaders['If-Modified-Since'];
    if (ifModifiedSince && headers['last-modified']) {
        const requestTime = Date.parse(ifModifiedSince);
        const modifiedTime = Date.parse(headers['last-modified']);
        if (!Number.isNaN(requestTime) && modifiedTime <= requestTime) {
            return {
                body: '',
                headers,
                statusCode: 304,
            };
        }
    }
    return undefined;
};
