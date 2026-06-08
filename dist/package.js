import path from 'node:path';
import { copyAgents, copyLicense, copyReadme } from './assets.js';
import { makePackageBinsExecutable, removePackageBinDeclarationFiles } from './bin.js';
import { AGENTS_FILE, PACKAGES_DIR } from './constants.js';
import { removeEmptyJavaScriptFiles } from './cleanup.js';
import { createExports, getJavaScriptFiles, getPackageMain, removeMissingJavaScriptExports } from './exports.js';
import { readJson, writeJson } from './file.js';
import { toPackagePath, toPosixPath } from './path.js';
export const createPackageRepository = (rootPackageJson, packageDirectory) => {
    const rootRepository = rootPackageJson.repository;
    if (!rootRepository) {
        return undefined;
    }
    return {
        ...rootRepository,
        directory: toPosixPath(path.join(PACKAGES_DIR, path.basename(packageDirectory))),
    };
};
export const syncPackageRuntimeMetadata = (packageJson, rootPackageJson) => {
    if (packageJson.name !== 'vyriy') {
        return;
    }
    packageJson.packageManager = rootPackageJson.packageManager;
    packageJson.engines = rootPackageJson.engines;
};
export const distPackage = async (packageJsonPath, rootPackageJson) => {
    const packageDirectory = path.dirname(packageJsonPath);
    const packageJson = await readJson(packageJsonPath);
    await removeEmptyJavaScriptFiles(packageDirectory);
    await removeMissingJavaScriptExports(packageDirectory);
    await removeEmptyJavaScriptFiles(packageDirectory);
    await removePackageBinDeclarationFiles(packageDirectory, packageJson);
    const javaScriptFiles = await getJavaScriptFiles(packageDirectory);
    await copyLicense(packageDirectory);
    await copyReadme(packageDirectory);
    const hasAgents = await copyAgents(packageDirectory, rootPackageJson);
    delete packageJson.private;
    if (hasAgents && rootPackageJson.agents) {
        packageJson.agents = toPackagePath(AGENTS_FILE);
    }
    else {
        delete packageJson.agents;
    }
    if (rootPackageJson.license) {
        packageJson.license = rootPackageJson.license;
    }
    else {
        delete packageJson.license;
    }
    const repository = createPackageRepository(rootPackageJson, packageDirectory);
    if (repository) {
        packageJson.repository = repository;
    }
    else {
        delete packageJson.repository;
    }
    syncPackageRuntimeMetadata(packageJson, rootPackageJson);
    if (javaScriptFiles.length > 0) {
        const mainFile = await getPackageMain(packageDirectory, packageJson, javaScriptFiles);
        if (mainFile) {
            packageJson.main = toPackagePath(mainFile);
            packageJson.types = toPackagePath(mainFile).replace(/\.js$/, '.d.ts');
            packageJson.exports = createExports(mainFile, javaScriptFiles);
        }
    }
    await makePackageBinsExecutable(packageDirectory, packageJson);
    await writeJson(packageJsonPath, packageJson);
};
