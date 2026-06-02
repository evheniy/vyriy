import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { DIST_DIR, LICENSE_FILE, PACKAGE_JSON_FILE, README_FILE } from './constants.js';
import { hasFile, readJson, writeJson } from './file.js';
export const copyRootFile = async (fileName) => {
    if (await hasFile(fileName)) {
        await copyFile(fileName, path.join(DIST_DIR, fileName));
    }
};
export const distRootPackageJson = async () => {
    const packageJson = await readJson(PACKAGE_JSON_FILE);
    delete packageJson.agents;
    delete packageJson.dependencies;
    delete packageJson.packageManager;
    delete packageJson.scripts;
    delete packageJson.devDependencies;
    await writeJson(path.join(DIST_DIR, PACKAGE_JSON_FILE), packageJson);
};
export const distRoot = async () => {
    await copyRootFile(README_FILE);
    await copyRootFile(LICENSE_FILE);
    await distRootPackageJson();
};
