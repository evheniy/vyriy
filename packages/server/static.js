import { STATUS_CODES } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const CONTENT_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.webp': 'image/webp',
};
const getContentType = (filePath) => CONTENT_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
const notFound = () => ({
    body: JSON.stringify({
        message: STATUS_CODES[404],
    }),
    headers: {
        'content-type': 'application/json',
    },
    statusCode: 404,
});
const methodNotAllowed = () => ({
    body: JSON.stringify({
        message: STATUS_CODES[405],
    }),
    headers: {
        allow: 'GET, HEAD',
        'content-type': 'application/json',
    },
    statusCode: 405,
});
const getFilePath = (directory, relativePath) => {
    const rootPath = resolve(directory);
    const filePath = resolve(rootPath, relativePath.replace(/^\/+/, '') || 'index.html');
    if (filePath !== rootPath && !filePath.startsWith(`${rootPath}${sep}`)) {
        return undefined;
    }
    return filePath;
};
const readFileResponse = async (filePath, method, statusCode = 200) => {
    const file = await stat(filePath);
    if (!file.isFile()) {
        return undefined;
    }
    const headers = {
        'content-length': String(file.size),
        'content-type': getContentType(filePath),
    };
    if (method === 'HEAD') {
        return {
            body: '',
            headers,
            statusCode,
        };
    }
    return {
        body: (await readFile(filePath)).toString('base64'),
        headers,
        isBase64Encoded: true,
        statusCode,
    };
};
const readFallbackResponse = async (directory, method, options) => {
    if (options.fallback === false) {
        return undefined;
    }
    const fallbackPath = getFilePath(directory, options.fallback);
    if (!fallbackPath) {
        return undefined;
    }
    try {
        return await readFileResponse(fallbackPath, method, options.fallbackStatusCode);
    }
    catch {
        return undefined;
    }
};
const isRouterParams = (value) => 'event' in value;
const getRequest = (value) => {
    if (isRouterParams(value)) {
        return {
            event: value.event,
            relativePath: value.pathParameters?.proxy ?? '',
        };
    }
    return {
        event: value,
        relativePath: value.path.replace(/^\/+/, ''),
    };
};
export const staticFiles = (directory, options = {}) => async (params) => {
    const { event, relativePath } = getRequest(params);
    const normalizedOptions = {
        fallback: '404.html',
        fallbackStatusCode: 404,
        ...options,
    };
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
        return methodNotAllowed();
    }
    const filePath = getFilePath(directory, relativePath);
    if (!filePath) {
        return (await readFallbackResponse(directory, event.httpMethod, normalizedOptions)) ?? notFound();
    }
    try {
        return ((await readFileResponse(filePath, event.httpMethod)) ??
            (await readFallbackResponse(directory, event.httpMethod, normalizedOptions)) ??
            notFound());
    }
    catch {
        return (await readFallbackResponse(directory, event.httpMethod, normalizedOptions)) ?? notFound();
    }
};
