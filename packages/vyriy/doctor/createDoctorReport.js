import { checkCorepack } from './checkCorepack.js';
import { checkGit } from './checkGit.js';
import { checkNodeVersion } from './checkNodeVersion.js';
import { checkYarn } from './checkYarn.js';
export const createDoctorReport = async (options = {}) => {
    const checks = [
        checkNodeVersion(),
        await checkCorepack(options),
        await checkYarn(options),
        await checkGit(options),
    ];
    return {
        checks,
        hasErrors: checks.some((check) => check.level === 'error'),
        hasWarnings: checks.some((check) => check.level === 'warning'),
    };
};
