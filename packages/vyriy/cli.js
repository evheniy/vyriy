import { parseArgs } from './args.js';
import packageJson from './package.json' with { type: 'json' };
const text = `Vyriy Project Master

Usage:
  vyriy create [name]    Create a new Vyriy project
  vyriy create .         Initialize a new Vyriy project in the current directory
  vyriy dist             Prepare dist package metadata without publishing to npm
  vyriy static [dir]     Serve a static directory (defaults to dist)
  vyriy check            Check local environment
  vyriy --help, -h       Show help
  vyriy --version, -v    Show version

Create options:
  vyriy create --dry-run        Print the merged file plan without writing project files
  vyriy create --overwrite      Overwrite existing generated paths
  vyriy create --skip-existing  Leave existing generated paths untouched
  vyriy create --no-install     Create files without installing dependencies
  vyriy create --no-verify      Install dependencies without running checks

Examples:
  vyriy create app
  vyriy create app --dry-run
  vyriy create .
  vyriy create . --no-verify
  vyriy dist
  vyriy static
  vyriy static dist
  vyriy check`;
export const cli = async (args = []) => {
    const command = parseArgs(args);
    switch (command.type) {
        case 'help':
            console.log(text);
            process.exitCode = 0;
            break;
        case 'version':
            console.log(packageJson.version);
            process.exitCode = 0;
            break;
        case 'dist': {
            const { dist } = await import('@vyriy/dist');
            process.exitCode = await dist();
            break;
        }
        case 'check': {
            const { checkEnv } = await import('@vyriy/check');
            process.exitCode = await checkEnv();
            break;
        }
        case 'static': {
            const { staticServer } = await import('@vyriy/static');
            process.exitCode = await staticServer(command);
            break;
        }
        case 'create': {
            const { create } = await import('@vyriy/create');
            process.exitCode = await create(command);
            break;
        }
        default:
            console.error(`Unknown command: ${command.command}\n`);
            console.log(text);
            process.exitCode = 1;
            break;
    }
};
