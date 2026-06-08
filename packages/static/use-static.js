import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createCacheHeaders, maybeNotModified, resolveCacheOptions } from './cache.js';
import { getContentType, isTextExtension } from './content.js';
import { resolveExistingFile, resolveRoot } from './file.js';
import { normalizeStaticOptions } from './options.js';
const NOT_FOUND_BODY = JSON.stringify({ message: 'Not Found' });
const METHOD_NOT_ALLOWED_BODY = JSON.stringify({ message: 'Method Not Allowed' });
const isStaticMethod = (method) => method === 'GET' || method === 'HEAD';
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
const mergeCustomHeaders = (headers, customHeaders, context) => ({
    ...headers,
    ...toHeadersObject(typeof customHeaders === 'function' ? customHeaders(context) : customHeaders),
});
const notFound = (body = NOT_FOUND_BODY, headers) => ({
    statusCode: 404,
    body,
    headers: headers ?? {
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
const createFileResult = async (event, requestPath, file, options, statusCode = 200) => {
    const extension = path.extname(file.filePath);
    const isText = isTextExtension(extension);
    const cache = resolveCacheOptions(options.cache, file.filePath, 'default');
    const headers = mergeCustomHeaders({
        'content-length': String(file.size),
        'content-type': getContentType(extension),
        ...createCacheHeaders(cache, file.size, file.modifiedTime),
    }, options.headers, {
        filePath: file.filePath,
        requestPath,
        statusCode,
    });
    const notModified = statusCode === 200 ? maybeNotModified(event, headers) : undefined;
    if (notModified) {
        return notModified;
    }
    if (event.httpMethod === 'HEAD') {
        return {
            statusCode,
            body: '',
            headers,
            isBase64Encoded: false,
        };
    }
    const content = await readFile(file.filePath);
    return {
        statusCode,
        body: content.toString(isText ? 'utf8' : 'base64'),
        headers,
        isBase64Encoded: !isText,
    };
};
export const useStatic = (directory = 'dist', options = {}) => {
    const normalizedOptions = normalizeStaticOptions(directory, options);
    let root;
    const getRoot = () => (root ??= resolveRoot(normalizedOptions.directory));
    const readFileResult = async (event, requestPath, statusCode = 200) => {
        const staticRoot = await getRoot();
        const file = await resolveExistingFile(staticRoot, requestPath, normalizedOptions.index);
        return file ? createFileResult(event, requestPath, file, normalizedOptions, statusCode) : undefined;
    };
    const readNotFoundFile = async (event) => {
        if (!normalizedOptions.notFound) {
            return notFound();
        }
        try {
            const result = await readFileResult(event, `/${normalizedOptions.notFound}`, 404);
            return result ?? notFound();
        }
        catch {
            return notFound();
        }
    };
    return async (event) => {
        if (!isStaticMethod(event.httpMethod)) {
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
            const result = await readFileResult(event, decodedPath);
            return result ?? readNotFoundFile(event);
        }
        catch {
            return readNotFoundFile(event);
        }
    };
};
