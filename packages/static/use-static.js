import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
const DEFAULT_DIRECTORY = 'dist';
const DEFAULT_INDEX = 'index.html';
const DEFAULT_ERROR = '404.html';
const NOT_FOUND_BODY = JSON.stringify({ message: 'Not Found' });
const METHOD_NOT_ALLOWED_BODY = JSON.stringify({ message: 'Method Not Allowed' });
const CONTENT_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.xml': 'application/xml; charset=utf-8',
};
const TEXT_TYPES = new Set([
    '.css',
    '.csv',
    '.html',
    '.js',
    '.json',
    '.map',
    '.mjs',
    '.svg',
    '.txt',
    '.xml',
]);
const getContentType = (extension) => CONTENT_TYPES[extension.toLowerCase()] ?? 'application/octet-stream';
const isTextExtension = (extension) => TEXT_TYPES.has(extension.toLowerCase());
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
const isStaticMethod = (method) => method === 'GET' || method === 'HEAD';
const isInsideDirectory = (directory, candidate) => {
    const relative = path.relative(directory, candidate);
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};
const normalizeOptions = ({ directory = DEFAULT_DIRECTORY, error = DEFAULT_ERROR, index = DEFAULT_INDEX, }) => ({
    directory,
    error,
    index,
});
const createFileResult = async (realFilePath, fileSize, method) => {
    const extension = path.extname(realFilePath);
    const isText = isTextExtension(extension);
    if (method === 'HEAD') {
        return {
            statusCode: 200,
            body: '',
            headers: {
                'content-length': String(fileSize),
                'content-type': getContentType(extension),
            },
            isBase64Encoded: false,
        };
    }
    const content = await readFile(realFilePath);
    return {
        statusCode: 200,
        body: content.toString(isText ? 'utf8' : 'base64'),
        headers: {
            'content-length': String(fileSize),
            'content-type': getContentType(extension),
        },
        isBase64Encoded: !isText,
    };
};
const readStaticFile = async (root, filePath, method) => {
    if (!isInsideDirectory(root, filePath)) {
        return undefined;
    }
    const realFilePath = await realpath(filePath);
    if (!isInsideDirectory(root, realFilePath)) {
        return undefined;
    }
    const fileStat = await stat(realFilePath);
    if (!fileStat.isFile()) {
        return undefined;
    }
    return createFileResult(realFilePath, fileStat.size, method);
};
const readErrorFile = async (root, error, method) => {
    try {
        const result = await readStaticFile(root, path.resolve(root, error), method);
        if (!result) {
            return notFound();
        }
        return {
            ...result,
            statusCode: 404,
        };
    }
    catch {
        return notFound();
    }
};
export const useStatic = (options = {}) => {
    const { directory, error, index } = normalizeOptions(options);
    let root;
    const getRoot = () => (root ??= realpath(directory));
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
        let staticRoot;
        try {
            staticRoot = await getRoot();
        }
        catch {
            return notFound();
        }
        const requestedPath = decodedPath.replace(/^\/+/, '') || index;
        const candidate = path.resolve(staticRoot, requestedPath);
        if (!isInsideDirectory(staticRoot, candidate)) {
            return readErrorFile(staticRoot, error, event.httpMethod);
        }
        let filePath = candidate;
        try {
            const fileStat = await stat(filePath);
            if (fileStat.isDirectory()) {
                filePath = path.join(filePath, index);
            }
        }
        catch {
            return readErrorFile(staticRoot, error, event.httpMethod);
        }
        if (!isInsideDirectory(staticRoot, filePath)) {
            return readErrorFile(staticRoot, error, event.httpMethod);
        }
        try {
            const result = await readStaticFile(staticRoot, filePath, event.httpMethod);
            return result ?? readErrorFile(staticRoot, error, event.httpMethod);
        }
        catch {
            return readErrorFile(staticRoot, error, event.httpMethod);
        }
    };
};
