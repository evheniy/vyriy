import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { AGENTS_FILE, LICENSE_FILE, PACKAGES_DIR, README_FILE } from './constants.js';
import { hasFile } from './file.js';
export const copyReadme = async (packageDirectory) => {
    const packageName = path.basename(packageDirectory);
    const sourceReadmePath = path.join(PACKAGES_DIR, packageName, README_FILE);
    if (await hasFile(sourceReadmePath)) {
        await copyFile(sourceReadmePath, path.join(packageDirectory, README_FILE));
    }
};
export const resolveSourceAgentsPath = async (packageAgentsPath, sharedAgentsPath, rootAgentsPath) => {
    if (await hasFile(packageAgentsPath)) {
        return packageAgentsPath;
    }
    if (await hasFile(sharedAgentsPath)) {
        return sharedAgentsPath;
    }
    return rootAgentsPath;
};
export const copyAgents = async (packageDirectory, rootPackageJson) => {
    const packageName = path.basename(packageDirectory);
    const packageAgentsPath = path.join(PACKAGES_DIR, packageName, AGENTS_FILE);
    const sharedAgentsPath = path.join(PACKAGES_DIR, AGENTS_FILE);
    const rootAgentsPath = typeof rootPackageJson.agents === 'string' ? rootPackageJson.agents.replace(/^\.\//, '') : '';
    const sourceAgentsPath = await resolveSourceAgentsPath(packageAgentsPath, sharedAgentsPath, rootAgentsPath);
    if (await hasFile(sourceAgentsPath)) {
        await copyFile(sourceAgentsPath, path.join(packageDirectory, AGENTS_FILE));
        return true;
    }
    return false;
};
export const copyLicense = async (packageDirectory) => {
    if (await hasFile(LICENSE_FILE)) {
        await copyFile(LICENSE_FILE, path.join(packageDirectory, LICENSE_FILE));
    }
};
