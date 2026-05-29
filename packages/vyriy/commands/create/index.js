import { cwd } from 'node:process';
import { basename, dirname, resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { exec as processExec } from 'node:child_process';
import { promisify } from 'node:util';
import { checkEnv } from '../check-env.js';
import { plan } from './plan/index.js';
import { conflictStrategy as promptConflictStrategy } from './prompt/index.js';
import { presets } from './preset/index.js';
const exec = promisify(processExec);
const getProviderFiles = (providers, provider) => provider === undefined ? {} : (providers[provider] ?? {});
const isPresetName = (preset) => preset in presets;
const mergeFiles = (planOption) => {
    if (!isPresetName(planOption.preset)) {
        return undefined;
    }
    const preset = presets[planOption.preset].preset;
    return {
        ...preset.files(planOption),
        ...getProviderFiles(preset.ci, planOption.ci),
        ...getProviderFiles(preset.deploy, planOption.deploy),
    };
};
const getSortedFileNames = (files) => Object.keys(files).sort();
const logFilePlan = (target, files) => {
    console.log(`\nFile plan (${target}):`);
    console.log(' ', getSortedFileNames(files).join('\n  '));
};
const getExistingFiles = (target, files) => {
    const existingFiles = getSortedFileNames(files).filter((file) => existsSync(resolve(target, file)));
    if (existingFiles.length) {
        console.log('\nExisting files found:\n');
        existingFiles.forEach((file) => console.log(' ', file));
    }
    return existingFiles;
};
const resolveConflictStrategy = async (filesExist, overwrite, skipExisting) => {
    if (!filesExist || overwrite || skipExisting) {
        return { overwrite, skipExisting };
    }
    const strategy = await promptConflictStrategy();
    if (strategy) {
        return strategy;
    }
    console.error('\nCannot continue without a conflict strategy.\n');
    console.error('Use one of:\n\n  vyriy --overwrite\n  vyriy --skip-existing\n  vyriy --dry-run');
    return undefined;
};
const writeFiles = (target, files, overwrite) => {
    console.log(`\nFile creating (${target}):`);
    getSortedFileNames(files).forEach((file) => {
        if (!existsSync(resolve(target, file)) || overwrite) {
            console.log(' ', file);
            const filePath = resolve(target, file);
            mkdirSync(dirname(filePath), { recursive: true });
            writeFileSync(filePath, files[file]);
        }
    });
};
const verifyProject = async (target) => {
    console.log('Running checks...');
    try {
        await exec(`yarn --cwd ${target} check`);
    }
    catch {
        console.log('Running fixes...');
        await exec(`yarn --cwd ${target} fix`);
        console.log('Running checks...');
        await exec(`yarn --cwd ${target} check`);
    }
};
export const create = async (options) => {
    const { directory, dryRun, overwrite, skipExisting, install, verify } = options;
    const checkEnvCode = await checkEnv();
    if (checkEnvCode) {
        return checkEnvCode;
    }
    const cliPath = cwd();
    let dirName = 'app';
    let appPath = resolve(cliPath, dirName);
    if (directory) {
        if (directory === '.') {
            dirName = basename(cliPath);
            appPath = cliPath;
        }
        else {
            dirName = directory;
            appPath = resolve(cwd(), dirName);
        }
    }
    const planOption = await plan(dirName, appPath);
    if (planOption) {
        const { target } = planOption;
        const files = mergeFiles(planOption);
        if (!files) {
            console.error(`Unknown preset: ${planOption.preset}`);
            return 1;
        }
        if (dryRun) {
            logFilePlan(target, files);
            return 0;
        }
        console.log(`\nFile checking (${target})...`);
        const existingFiles = getExistingFiles(target, files);
        const conflictStrategy = await resolveConflictStrategy(Boolean(existingFiles.length), overwrite, skipExisting);
        if (!conflictStrategy) {
            return 1;
        }
        writeFiles(target, files, conflictStrategy.overwrite);
        if (install) {
            console.log('Installing dependencies...');
            await exec(`yarn --cwd ${target} set version berry`);
            await exec(`yarn --cwd ${target} install`);
        }
        else {
            console.log('Installing dependencies... SKIPPED');
            console.log('Running checks... SKIPPED');
            console.log('\nProject files were created.');
            return 0;
        }
        if (verify) {
            await verifyProject(target);
        }
        else {
            console.log('Running checks... SKIPPED');
            console.log('\nProject files were created.');
            return 0;
        }
        return 0;
    }
    return 1;
};
