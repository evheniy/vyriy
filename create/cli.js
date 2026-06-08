import packageJson from './package.json' with { type: 'json' };
import { create } from './create.js';
export const createVersion = packageJson.version;
export const createCreateHelpText = (command = 'vyriy-create', alias = 'vc') => {
    const aliasText = alias ? `  ${alias} [name]                  Alias for ${command}\n` : '';
    const aliasExampleText = alias ? `\n  ${alias} app` : '';
    return `Vyriy Project Creator

Usage:
  ${command} [name]              Create a new Vyriy project
  ${command} .                   Initialize a new Vyriy project in the current directory
${aliasText}\
  ${command} --help, -h          Show help
  ${command} --version, -v       Show version

Options:
  --dry-run                      Print the merged file plan without writing project files
  --overwrite                    Overwrite existing generated paths
  --skip-existing                Leave existing generated paths untouched
  --no-install                   Create files without installing dependencies
  --no-verify                    Install dependencies without running checks

Examples:
  ${command} app
  ${command} app --dry-run
  ${command} .
  ${command} . --no-verify${aliasExampleText}`;
};
export const parseCreateBinArgs = (args) => {
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    const install = !args.includes('--no-install');
    return {
        type: 'create',
        directory: args.find((arg) => !arg.startsWith('-')) ?? '',
        dryRun: args.includes('--dry-run'),
        overwrite: args.includes('--overwrite'),
        skipExisting: args.includes('--skip-existing'),
        install,
        verify: install && !args.includes('--no-verify'),
    };
};
export const runCreateCli = async (args = [], command = 'vyriy-create', alias = 'vc') => {
    const parsed = parseCreateBinArgs(args);
    switch (parsed.type) {
        case 'help':
            console.log(createCreateHelpText(command, alias));
            process.exitCode = 0;
            break;
        case 'version':
            console.log(createVersion);
            process.exitCode = 0;
            break;
        case 'create':
            process.exitCode = await create(parsed);
            break;
    }
};
