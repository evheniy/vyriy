import { readFile, unlink } from 'node:fs/promises';
import { readFiles } from './file.js';
export const isEmptyJavaScriptContent = (content) => {
    const normalizedContent = content.trim();
    return normalizedContent.length === 0 || normalizedContent === 'export {};';
};
export const removeEmptyJavaScriptFiles = async (packageDirectory) => {
    const files = await readFiles(packageDirectory);
    for (const file of files) {
        if (file.endsWith('.js') && isEmptyJavaScriptContent(await readFile(file, 'utf8'))) {
            await unlink(file);
        }
    }
};
