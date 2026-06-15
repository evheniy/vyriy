import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
const dependencyFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
];
const readPackageJson = async (cwd) => {
    try {
        return JSON.parse(await readFile(join(cwd, 'package.json'), 'utf8'));
    }
    catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            return undefined;
        }
        throw error;
    }
};
export const findMissingPackages = async (cwd, packageNames) => {
    const packageJson = await readPackageJson(cwd);
    if (!packageJson) {
        return [...packageNames];
    }
    return packageNames.filter((packageName) => {
        return !dependencyFields.some((field) => Boolean(packageJson[field]?.[packageName]));
    });
};
