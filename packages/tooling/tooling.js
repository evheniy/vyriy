import { configTargets } from './config-targets.js';
import { fileExists } from './file-exists.js';
import { findMissingPackages } from './package-dependencies.js';
import { parseConfigArgs } from './parse-config-args.js';
import { selectConfigs } from './select-configs.js';
import { writeConfigFiles } from './write-config-files.js';
import packageJson from './package.json' with { type: 'json' };
const unique = (values) => [...new Set(values)];
export const toolingVersion = packageJson.version;
export const createToolingHelpText = (command = 'vyriy-tooling', alias = 'vt') => {
    const aliasText = alias ? `  ${alias} init                  Alias for ${command}\n` : '';
    const aliasExampleText = alias ? `\n  ${alias} init\n  ${alias} typescript --dry-run` : '';
    return `Vyriy Tooling

Usage:
  ${command} init
  ${command} typescript
  ${command} eslint
  ${command} prettier
  ${command} jest
  ${command} storybook
  ${command} stylelint
${aliasText}\
  ${command} --help, -h          Show tooling help
  ${command} --version, -v       Show version

Options:
  --force                     Overwrite existing config files
  --dry-run                   Print files that would be created without writing them

Examples:
  ${command} init
  ${command} typescript
  ${command} storybook --force
  ${command} prettier --dry-run${aliasExampleText}`;
};
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
export const runToolingCli = async (args = [], commandName = 'vyriy-tooling', alias = 'vt', cwd = process.cwd()) => {
    const command = parseConfigArgs(args);
    if (command.type === 'help') {
        console.log(createToolingHelpText(commandName, alias));
        process.exitCode = 0;
        return;
    }
    if (command.type === 'version') {
        console.log(toolingVersion);
        process.exitCode = 0;
        return;
    }
    if (command.type === 'unknown') {
        console.error('Unknown tooling command.');
        console.log(createToolingHelpText(commandName, alias));
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
