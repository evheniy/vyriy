import packageJson from './package.json' with { type: 'json' };
import { exec } from './exec.js';
export const yarnStableHint = 'Try:\n  corepack enable\n  corepack prepare yarn@stable --activate';
export const yarn = async () => {
    const minimumMajorVersion = Number.parseInt(packageJson.packageManager.match(/(\d+)/)?.[0]);
    let currentVersion;
    try {
        const { stdout } = await exec('yarn --version');
        currentVersion = stdout.trim();
    }
    catch {
        return {
            ok: false,
            message: `Yarn was not found.\n\nVyriy requires Yarn >= ${minimumMajorVersion}.\n\n${yarnStableHint}`,
        };
    }
    const majorVersion = Number.parseInt(currentVersion.match(/(\d+)/)?.[0]);
    if (majorVersion && majorVersion >= minimumMajorVersion) {
        return {
            ok: true,
            message: `Yarn ${currentVersion}`,
        };
    }
    return {
        ok: false,
        message: `Vyriy requires Yarn >= ${minimumMajorVersion}.\n\nCurrent version: ${currentVersion}\n\n${yarnStableHint}`,
    };
};
