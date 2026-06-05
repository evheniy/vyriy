import { existsSync } from 'node:fs';
import { server } from '@vyriy/server';
import packageJson from './package.json' with { type: 'json' };
import { useSpa } from './use-spa.js';
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
const hasOption = (args, name) => args.includes(name);
const isOptionValue = (args, index) => {
    const previous = args[index - 1];
    return (previous === '--cache' ||
        previous === '--fallback' ||
        previous === '--index' ||
        previous === '--not-found' ||
        previous === '--port' ||
        previous === '-p');
};
const resolveDirectory = (directory) => directory ?? DIRECTORIES.find((candidate) => existsSync(candidate)) ?? '.';
const createStaticHandler = useStatic;
const createSpaHandler = useSpa;
const normalizeCachePreset = (value) => {
    if (!value) {
        return undefined;
    }
    if (value === 'false' || value === 'none') {
        return 'none';
    }
    if (value === 'default' || value === 'immutable' || value === 'static') {
        return value;
    }
    throw new Error(`Unsupported static cache preset: ${value}`);
};
const getCliCacheDefault = () => (process.env.NODE_ENV === 'production' ? 'default' : 'none');
const withEnvDefaults = (command) => ({
    cache: command.cache ?? normalizeCachePreset(process.env.VYRIY_STATIC_CACHE) ?? getCliCacheDefault(),
    directory: command.directory,
    fallback: command.fallback ?? process.env.VYRIY_STATIC_FALLBACK,
    index: command.index ?? process.env.VYRIY_STATIC_INDEX,
    notFound: command.notFound ?? process.env.VYRIY_STATIC_NOT_FOUND,
    spa: command.spa,
});
export const staticVersion = packageJson.version;
export const createStaticHelpText = (command = 'vyriy-static', alias = 'vs') => {
    const aliasText = alias ? `  ${alias} [directory]                  Alias for ${command}\n` : '';
    const aliasExampleText = alias ? `\n  ${alias} .\n  ${alias} --spa` : '';
    return `Vyriy Static Server

Usage:
  ${command} [directory]        Serve a static directory (defaults to dist when it exists)
  ${command} [directory] --spa  Serve a static directory in SPA fallback mode
  ${command} --port 3000 dist   Serve a directory on a specific port
${aliasText}\
  ${command} --spa              Serve as an SPA with index fallback
  ${command} --cache static     Set cache preset: none, default, static, immutable
  ${command} --help, -h         Show help
  ${command} --version, -v      Show version

Options:
  -p, --port <port>             HTTP port. Default: PORT env or 3000
  --cache <preset>              Cache preset: none, default, static, immutable
  --index <file>                Static directory index file. Default: index.html
  --not-found <file>            Static 404 response file. Default: disabled
  --spa                         Enable SPA fallback mode. Default: false
  --fallback <file>             SPA fallback file. Default: index.html

Defaults:
  directory                     First existing: dist, build, public, out, then .
  port                          PORT env or 3000
  cache                         none when NODE_ENV is not production; default in production
  index                         index.html
  not-found                     disabled unless --not-found is provided
  spa                           false
  fallback                      index.html

Cache presets:
  none                          Cache-Control: no-store
  default                       public, max-age=3600 with validators
  static                        immutable assets, revalidated HTML and metadata
  immutable                     public, max-age=31536000, immutable

Examples:
  ${command}
  ${command} public
  ${command} --port 3000 dist
  ${command} dist --cache static
  ${command} dist --spa --fallback index.html --cache static${aliasExampleText}`;
};
export const parseStaticBinArgs = (args) => {
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    const cache = normalizeCachePreset(getOptionValue(args, '--cache', '--cache'));
    const directory = args.find((arg, index) => !arg.startsWith('-') && !isOptionValue(args, index));
    const fallback = getOptionValue(args, '--fallback', '--fallback');
    const index = getOptionValue(args, '--index', '--index');
    const notFound = getOptionValue(args, '--not-found', '--not-found');
    const port = getOptionValue(args, '--port', '-p');
    const command = {
        type: 'serve',
        directory,
        port,
    };
    if (cache !== undefined) {
        command.cache = cache;
    }
    if (fallback !== undefined) {
        command.fallback = fallback;
    }
    if (index !== undefined) {
        command.index = index;
    }
    if (notFound !== undefined) {
        command.notFound = notFound;
    }
    if (hasOption(args, '--spa')) {
        command.spa = true;
    }
    return command;
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
            process.exitCode = await staticServer(withEnvDefaults(parsed));
            break;
    }
};
export const staticServer = async (options = {}) => {
    const handlerOptions = {
        ...options,
        directory: resolveDirectory(options.directory),
    };
    await Promise.resolve(server(options.spa
        ? createSpaHandler(handlerOptions.directory, handlerOptions)
        : createStaticHandler(handlerOptions.directory, handlerOptions)));
    return 0;
};
