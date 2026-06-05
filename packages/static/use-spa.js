import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createCacheHeaders, maybeNotModified, resolveCacheOptions } from './cache.js';
import { getContentType, isTextExtension } from './content.js';
import { resolveExistingFile, resolveRoot } from './file.js';
import { normalizeSpaOptions } from './options.js';
const NOT_FOUND_BODY = JSON.stringify({ message: 'Not Found' });
const METHOD_NOT_ALLOWED_BODY = JSON.stringify({ message: 'Method Not Allowed' });
const isSpaMethod = (method) => method === 'GET' || method === 'HEAD';
const toHeadersObject = (headers) => {
    if (!headers) {
        return {};
    }
    if (headers instanceof Headers) {
        return Object.fromEntries(headers.entries());
    }
    if (Array.isArray(headers)) {
        return Object.fromEntries(headers);
    }
    return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, String(value)]));
};
const notFound = () => ({
    statusCode: 404,
    body: NOT_FOUND_BODY,
    headers: {
        'content-type': 'application/json; charset=utf-8',
    },
});
const methodNotAllowed = () => ({
    statusCode: 405,
    body: METHOD_NOT_ALLOWED_BODY,
    headers: {
        allow: 'GET, HEAD',
        'content-type': 'application/json; charset=utf-8',
    },
});
const createFileResult = async (event, requestPath, file, options) => {
    const extension = path.extname(file.filePath);
    const isText = isTextExtension(extension);
    const cache = resolveCacheOptions(options.cache, file.filePath, 'static');
    const headers = {
        'content-length': String(file.size),
        'content-type': getContentType(extension),
        ...createCacheHeaders(cache, file.size, file.modifiedTime),
        ...toHeadersObject(typeof options.headers === 'function'
            ? options.headers({
                filePath: file.filePath,
                requestPath,
                statusCode: 200,
            })
            : options.headers),
    };
    const notModified = maybeNotModified(event, headers);
    if (notModified) {
        return notModified;
    }
    if (event.httpMethod === 'HEAD') {
        return {
            statusCode: 200,
            body: '',
            headers,
            isBase64Encoded: false,
        };
    }
    const content = await readFile(file.filePath);
    return {
        statusCode: 200,
        body: content.toString(isText ? 'utf8' : 'base64'),
        headers,
        isBase64Encoded: !isText,
    };
};
export const useSpa = (directory = 'dist', options = {}) => {
    const normalizedOptions = normalizeSpaOptions(directory, options);
    let root;
    const getRoot = () => (root ??= resolveRoot(normalizedOptions.directory));
    const readSpaFile = async (event, requestPath) => {
        const staticRoot = await getRoot();
        const file = await resolveExistingFile(staticRoot, requestPath, 'index.html');
        return file ? createFileResult(event, requestPath, file, normalizedOptions) : undefined;
    };
    return async (event) => {
        if (!isSpaMethod(event.httpMethod)) {
            return methodNotAllowed();
        }
        let decodedPath;
        try {
            decodedPath = decodeURIComponent(event.path);
        }
        catch {
            return notFound();
        }
        try {
            const realFile = await readSpaFile(event, decodedPath);
            return realFile ?? (await readSpaFile(event, `/${normalizedOptions.fallback}`)) ?? notFound();
        }
        catch {
            return notFound();
        }
    };
};
