import { parseArgs } from './args.js';
import packageJson from './package.json' with { type: 'json' };
const text = `Vyriy Project Master

Usage:
  vyriy create [name]    Create a new Vyriy project
  vyriy create .         Initialize a new Vyriy project in the current directory
  vyriy dist             Prepare dist package metadata without publishing to npm
  vyriy static [dir]     Serve a static directory (defaults to .)
  vyriy check            Check local environment
  vyriy config [tool]    Generate thin local config files
  vyriy --help, -h       Show help
  vyriy --version, -v    Show version

Create options:
  vyriy create --dry-run        Print the merged file plan without writing project files
  vyriy create --overwrite      Overwrite existing generated paths
  vyriy create --skip-existing  Leave existing generated paths untouched
  vyriy create --no-install     Create files without installing dependencies
  vyriy create --no-verify      Install dependencies without running checks

Static options:
  vyriy static --port 3000 dist             Serve on a specific port
  vyriy static dist --cache static          Cache preset: none, default, static, immutable
  vyriy static dist --index index.html      Static directory index file
  vyriy static dist --not-found 404.html    Static 404 response file
  vyriy static dist --spa                   Enable SPA fallback mode
  vyriy static dist --fallback index.html   SPA fallback file

Config options:
  vyriy config init                 Select configs to create
  vyriy config typescript           Create tsconfig.json
  vyriy config eslint               Create eslint.config.js
  vyriy config prettier             Create prettier.config.js
  vyriy config jest                 Create jest.config.js
  vyriy config storybook            Create .storybook config files
  vyriy config stylelint            Create stylelint.config.js
  vyriy config init --force         Overwrite existing config files
  vyriy config init --dry-run       Print config files without writing them

Examples:
  vyriy create app
  vyriy create app --dry-run
  vyriy create .
  vyriy create . --no-verify
  vyriy dist
  vyriy static
  vyriy static --port 3000 dist
  vyriy static dist --cache static
  vyriy static dist --spa --fallback index.html --cache static
  vyriy static dist
  vyriy check
  vyriy config init
  vyriy config typescript`;
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
            const { runDistCli } = await import('@vyriy/dist');
            await runDistCli(command.args, 'vyriy dist', false);
            break;
        }
        case 'check': {
            const { runCheckCli } = await import('@vyriy/check');
            await runCheckCli(command.args, 'vyriy check', false);
            break;
        }
        case 'static': {
            const { runStaticCli } = await import('@vyriy/static');
            await runStaticCli(command.args, 'vyriy static', false);
            break;
        }
        case 'create': {
            const { runCreateCli } = await import('@vyriy/create');
            await runCreateCli(command.args, 'vyriy create', false);
            break;
        }
        case 'config': {
            const { runConfigCli } = await import('./config-cli.js');
            await runConfigCli(command.args);
            break;
        }
        default:
            console.error(`Unknown command: ${command.command}\n`);
            console.log(text);
            process.exitCode = 1;
            break;
    }
};
