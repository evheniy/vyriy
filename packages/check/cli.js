import packageJson from './package.json' with { type: 'json' };
import { checkEnv } from './check.js';
export const checkVersion = packageJson.version;
export const createCheckHelpText = (command = 'vyriy-check', alias = 'vce') => {
    const aliasText = alias ? `  ${alias}                  Alias for ${command}\n` : '';
    const aliasExampleText = alias ? `\n  ${alias}` : '';
    return `Vyriy Environment Check

Usage:
  ${command}                  Check local environment
${aliasText}\
  ${command} --help, -h       Show help
  ${command} --version, -v    Show version

Examples:
  ${command}${aliasExampleText}`;
};
export const parseCheckBinArgs = (args) => {
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    return { type: 'check' };
};
export const runCheckCli = async (args = [], command = 'vyriy-check', alias = 'vce') => {
    const parsed = parseCheckBinArgs(args);
    switch (parsed.type) {
        case 'help':
            console.log(createCheckHelpText(command, alias));
            process.exitCode = 0;
            break;
        case 'version':
            console.log(checkVersion);
            process.exitCode = 0;
            break;
        case 'check':
            process.exitCode = await checkEnv();
            break;
    }
};
