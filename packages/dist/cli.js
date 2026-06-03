import packageJson from './package.json' with { type: 'json' };
import { dist } from './dist.js';
export const distVersion = packageJson.version;
export const createDistHelpText = (command = 'vyriy-dist', alias = 'vd') => {
    const aliasText = alias ? `  ${alias}                  Alias for ${command}\n` : '';
    const aliasExampleText = alias ? `\n  ${alias}` : '';
    return `Vyriy Dist Builder

Usage:
  ${command}                  Prepare dist package metadata
${aliasText}\
  ${command} --help, -h       Show help
  ${command} --version, -v    Show version

Examples:
  ${command}${aliasExampleText}`;
};
export const parseDistBinArgs = (args) => {
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    return { type: 'dist' };
};
export const runDistCli = async (args = [], command = 'vyriy-dist', alias = 'vd') => {
    const parsed = parseDistBinArgs(args);
    switch (parsed.type) {
        case 'help':
            console.log(createDistHelpText(command, alias));
            process.exitCode = 0;
            break;
        case 'version':
            console.log(distVersion);
            process.exitCode = 0;
            break;
        case 'dist':
            process.exitCode = await dist();
            break;
    }
};
