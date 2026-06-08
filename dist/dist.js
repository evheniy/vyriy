import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { DIST_DIR, PACKAGE_JSON_FILE } from './constants.js';
import { hasFile, readJson } from './file.js';
import { distPackage } from './package.js';
import { distRoot } from './root.js';
export const dist = async () => {
    const previousCwd = process.cwd();
    try {
        process.chdir(process.cwd());
        const rootPackageJson = await readJson(PACKAGE_JSON_FILE);
        await distRoot();
        const entries = await readdir(DIST_DIR, { withFileTypes: true });
        const packageJsonPaths = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(DIST_DIR, entry.name, PACKAGE_JSON_FILE))
            .sort((left, right) => left.localeCompare(right));
        for (const packageJsonPath of packageJsonPaths) {
            if (await hasFile(packageJsonPath)) {
                await distPackage(packageJsonPath, rootPackageJson);
            }
        }
        return 0;
    }
    finally {
        process.chdir(previousCwd);
    }
};
