import { existsSync } from 'node:fs';
import { server } from '@vyriy/server';
import packageJson from './package.json' with { type: 'json' };
import { useStatic } from './use-static.js';
const DIRECTORIES = [
    'dist',
    'build',
    'public',
    'out',
];
const getOptionValue = (args, name, alias) => {
    const inline = args.find((arg) => arg.startsWith(`${name}=`));
    if (inline) {
        return inline.slice(name.length + 1);
    }
    const index = args.findIndex((arg) => arg === name || arg === alias);
    return index >= 0 ? args[index + 1] : undefined;
};
const isOptionValue = (args, index) => {
    const previous = args[index - 1];
    return previous === '--port' || previous === '-p';
};
const resolveDirectory = (directory) => directory ?? DIRECTORIES.find((candidate) => existsSync(candidate)) ?? '.';
const createStaticHandler = useStatic;
export const staticVersion = packageJson.version;
export const createStaticHelpText = (command = 'vyriy-static', alias = 'vs') => {
    const aliasText = alias ? `  ${alias} [directory]                  Alias for ${command}\n` : '';
    const aliasExampleText = alias ? `\n  ${alias} .` : '';
    return `Vyriy Static Server

Usage:
  ${command} [directory]        Serve a static directory (defaults to dist when it exists)
  ${command} --port 3000 dist   Serve a directory on a specific port
${aliasText}\
  ${command} --help, -h         Show help
  ${command} --version, -v      Show version

Options:
  -p, --port <port>             Port passed through the PORT environment variable

Examples:
  ${command}
  ${command} public
  ${command} --port 3000 dist${aliasExampleText}`;
};
export const parseStaticBinArgs = (args) => {
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    return {
        type: 'serve',
        directory: args.find((arg, index) => !arg.startsWith('-') && !isOptionValue(args, index)),
        port: getOptionValue(args, '--port', '-p'),
    };
};
export const runStaticCli = async (args = [], command = 'vyriy-static', alias = 'vs') => {
    const parsed = parseStaticBinArgs(args);
    switch (parsed.type) {
        case 'help':
            console.log(createStaticHelpText(command, alias));
            process.exitCode = 0;
            break;
        case 'version':
            console.log(staticVersion);
            process.exitCode = 0;
            break;
        case 'serve':
            if (parsed.port) {
                process.env.PORT = parsed.port;
            }
            process.exitCode = await staticServer({ directory: parsed.directory });
            break;
    }
};
export const staticServer = async (options = {}) => {
    await Promise.resolve(server(createStaticHandler({ ...options, directory: resolveDirectory(options.directory) })));
    return 0;
};
