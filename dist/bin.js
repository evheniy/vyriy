import { chmod, unlink } from 'node:fs/promises';
import path from 'node:path';
import { hasFile } from './file.js';
import { toPackageLocalPath } from './path.js';
export const getPackageBinFiles = (packageJson) => {
    if (typeof packageJson.bin === 'string') {
        return [packageJson.bin];
    }
    if (packageJson.bin && typeof packageJson.bin === 'object') {
        return Object.values(packageJson.bin);
    }
    return [];
};
export const removePackageBinDeclarationFiles = async (packageDirectory, packageJson) => {
    for (const binFile of getPackageBinFiles(packageJson)) {
        const declarationFilePath = path.join(packageDirectory, toPackageLocalPath(binFile).replace(/\.js$/, '.d.ts'));
        if (await hasFile(declarationFilePath)) {
            await unlink(declarationFilePath);
        }
    }
};
export const makePackageBinsExecutable = async (packageDirectory, packageJson) => {
    for (const binFile of getPackageBinFiles(packageJson)) {
        const binFilePath = path.join(packageDirectory, toPackageLocalPath(binFile));
        if (await hasFile(binFilePath)) {
            await chmod(binFilePath, 0o755);
        }
    }
};
