import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
const getMajorVersion = (version) => {
    const majorVersion = /^(\d+)/.exec(version.trim())?.[1];
    return majorVersion ? Number.parseInt(majorVersion, 10) : undefined;
};
const getYarnVersion = async () => {
    const { stdout } = await execFileAsync('yarn', ['--version']);
    return stdout.trim();
};
export const checkYarnVersion = async ({ minimumMajor = 4, run = getYarnVersion, version } = {}) => {
    let currentVersion = version;
    try {
        currentVersion ??= await run();
    }
    catch {
        return {
            ok: false,
            name: 'Yarn',
            message: 'Yarn was not found.\n\nVyriy requires Yarn >= 4.\n\nTry:\n  corepack enable\n  yarn set version stable',
        };
    }
    const normalizedVersion = currentVersion.trim();
    const majorVersion = getMajorVersion(normalizedVersion);
    if (majorVersion && majorVersion >= minimumMajor) {
        return {
            ok: true,
            name: 'Yarn',
            version: normalizedVersion,
            message: `Yarn ${normalizedVersion}`,
        };
    }
    return {
        ok: false,
        name: 'Yarn',
        version: normalizedVersion,
        message: `Vyriy requires Yarn >= ${minimumMajor}.\n\nCurrent version: ${normalizedVersion}\n\nTry:\n  corepack enable\n  yarn set version stable`,
    };
};
