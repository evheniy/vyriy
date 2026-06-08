import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
export const hasFile = async (filePath) => {
    try {
        return (await stat(filePath)).isFile();
    }
    catch {
        return false;
    }
};
export const readJson = async (filePath) => {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content);
};
export const writeJson = async (filePath, value) => {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};
export const readFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            return readFiles(entryPath);
        }
        return entry.isFile() ? [entryPath] : [];
    }));
    return files.flat();
};
