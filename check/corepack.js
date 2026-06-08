import { exec } from './exec.js';
import { yarnStableHint } from './yarn.js';
export const corepack = async () => {
    let currentVersion;
    try {
        const { stdout } = await exec('corepack --version');
        currentVersion = stdout.trim();
    }
    catch {
        return {
            ok: false,
            message: `Corepack was not found.\n\nVyriy uses Corepack to install Yarn stable.\n\nInstall a Node.js distribution that includes Corepack and run the command again.`,
        };
    }
    return {
        ok: true,
        message: `Corepack ${currentVersion}`,
    };
};
export const activateYarnStable = async () => {
    try {
        await exec('corepack enable');
        await exec('corepack prepare yarn@stable --activate');
    }
    catch {
        return {
            ok: false,
            message: `Corepack could not activate Yarn stable.\n\n${yarnStableHint}`,
        };
    }
    return {
        ok: true,
        message: 'Yarn stable activated',
    };
};
