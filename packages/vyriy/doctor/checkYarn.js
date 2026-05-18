import { execCommand as execCommandDefault, getMajorVersion } from '../shared/index.js';
export const yarnStableFix = {
    label: 'Enable Yarn using Corepack',
    command: 'corepack enable\ncorepack prepare yarn@stable --activate',
    safeToRun: true,
};
export const checkYarn = async ({ execCommand = execCommandDefault, minimumMajor = 4, version, } = {}) => {
    let currentVersion = version;
    try {
        currentVersion ??= await execCommand('yarn', ['--version']);
    }
    catch {
        return {
            name: 'yarn',
            label: 'Yarn',
            group: 'Package manager',
            level: 'warning',
            message: 'Yarn was not found',
            detail: 'Vyriy uses Yarn 4 for generated projects.',
            fix: yarnStableFix,
        };
    }
    const normalizedVersion = currentVersion.trim();
    const majorVersion = getMajorVersion(normalizedVersion);
    if (majorVersion !== undefined && majorVersion >= minimumMajor) {
        return {
            name: 'yarn',
            label: 'Yarn',
            group: 'Package manager',
            level: 'ok',
            version: normalizedVersion,
            message: `Yarn ${normalizedVersion}`,
        };
    }
    return {
        name: 'yarn',
        label: 'Yarn',
        group: 'Package manager',
        level: 'warning',
        version: normalizedVersion,
        message: `Yarn ${normalizedVersion} detected`,
        detail: `Vyriy recommends Yarn ${minimumMajor}.`,
        fix: yarnStableFix,
    };
};
