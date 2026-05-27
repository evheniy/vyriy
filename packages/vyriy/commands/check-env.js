import { exec as processExec } from 'node:child_process';
import { promisify } from 'node:util';
import packageJson from '../package.json' with { type: 'json' };
const exec = promisify(processExec);
const yarnStableHint = 'Try:\n  corepack enable\n  corepack prepare yarn@stable --activate';
const node = () => {
    const majorVersion = Number.parseInt(process.versions.node.split('.')[0]);
    const minimumMajorVersion = Number.parseInt(packageJson.engines.node.match(/(\d+)/)?.[0]);
    if (majorVersion && majorVersion >= minimumMajorVersion) {
        return {
            ok: true,
            version: process.versions.node,
            message: `Node.js ${majorVersion}`,
        };
    }
    return {
        ok: false,
        version: process.versions.node,
        message: `Vyriy requires Node.js >= ${minimumMajorVersion}.\n\nCurrent version: ${process.versions.node}\n\nPlease upgrade Node.js and run the command again.`,
    };
};
const corepack = async () => {
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
const activateYarnStable = async () => {
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
const yarn = async () => {
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
export const checkEnv = async () => {
    const nodeResults = node();
    console.log('Check env:');
    if (nodeResults.ok) {
        console.log(' ', nodeResults.message);
    }
    else {
        console.error(nodeResults.message);
        return 1;
    }
    const corepackResults = await corepack();
    if (corepackResults.ok) {
        console.log(' ', corepackResults.message);
    }
    else {
        console.error(corepackResults.message);
        return 1;
    }
    let yarnResults = await yarn();
    if (yarnResults.ok) {
        console.log(' ', yarnResults.message);
        return 0;
    }
    const yarnStableResults = await activateYarnStable();
    if (yarnStableResults.ok) {
        console.log(' ', yarnStableResults.message);
    }
    else {
        console.error(yarnStableResults.message);
        return 1;
    }
    yarnResults = await yarn();
    if (yarnResults.ok) {
        console.log(' ', yarnResults.message);
    }
    else {
        console.error(yarnResults.message);
        return 1;
    }
    return 0;
};
