import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
export const isInsideDirectory = (directory, candidate) => {
    const relative = path.relative(directory, candidate);
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};
export const resolveRoot = (directory) => realpath(directory);
export const resolveExistingFile = async (root, requestPath, index) => {
    const requestedPath = requestPath.replace(/^\/+/, '') || index || '';
    let candidate = path.resolve(root, requestedPath);
    if (!isInsideDirectory(root, candidate)) {
        return undefined;
    }
    try {
        const candidateStat = await stat(candidate);
        if (candidateStat.isDirectory()) {
            if (!index) {
                return undefined;
            }
            candidate = path.join(candidate, index);
        }
    }
    catch {
        return undefined;
    }
    if (!isInsideDirectory(root, candidate)) {
        return undefined;
    }
    const realFilePath = await realpath(candidate);
    if (!isInsideDirectory(root, realFilePath)) {
        return undefined;
    }
    const fileStat = await stat(realFilePath);
    if (!fileStat.isFile()) {
        return undefined;
    }
    return {
        filePath: realFilePath,
        modifiedTime: fileStat.mtime,
        size: fileStat.size,
    };
};
