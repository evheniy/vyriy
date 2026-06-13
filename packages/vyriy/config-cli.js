import { configTargets } from './config-targets.js';
import { fileExists } from './file-exists.js';
import { findMissingPackages } from './package-dependencies.js';
import { parseConfigArgs } from './parse-config-args.js';
import { selectConfigs } from './select-configs.js';
import { writeConfigFiles } from './write-config-files.js';
const helpText = `Usage:
  vyriy config init
  vyriy config typescript
  vyriy config eslint
  vyriy config prettier
  vyriy config jest
  vyriy config storybook
  vyriy config stylelint

Options:
  --force    Overwrite existing config files
  --dry-run  Print files that would be created without writing them
  --help     Show config help`;
const unique = (values) => [...new Set(values)];
const collectFiles = (names) => {
    return names.flatMap((name) => [...configTargets[name].files]);
};
const printMissingPackages = (missingPackages) => {
    if (missingPackages.length === 0) {
        return;
    }
    console.log('');
    console.log('Missing Vyriy config packages:');
    console.log('');
    for (const packageName of missingPackages) {
        console.log(`- ${packageName}`);
    }
    console.log('');
    console.log('Install them with:');
    console.log('');
    console.log(`yarn add -D ${missingPackages.join(' ')}`);
};
export const runConfigCli = async (args = [], cwd = process.cwd()) => {
    const command = parseConfigArgs(args);
    if (command.help) {
        console.log(helpText);
        process.exitCode = 0;
        return;
    }
    if (command.type === 'unknown') {
        console.error('Unknown config command.');
        console.log(helpText);
        process.exitCode = 1;
        return;
    }
    const names = command.type === 'init' ? await selectConfigs() : command.names;
    const files = collectFiles(names);
    const writtenFiles = await writeConfigFiles({
        cwd,
        dryRun: command.dryRun,
        exists: fileExists,
        files,
        force: command.force,
    });
    if (command.dryRun || writtenFiles.length === 0) {
        process.exitCode = 0;
        return;
    }
    const packageNames = unique(names.map((name) => configTargets[name].packageName));
    const missingPackages = await findMissingPackages(cwd, packageNames);
    printMissingPackages(missingPackages);
    process.exitCode = 0;
};
