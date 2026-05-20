import { runDoctorCommand } from '../commands/doctor/index.js';
import { runInitCommand } from '../commands/init/index.js';
import { runNewCommand } from '../commands/new/index.js';
import packageJson from '../package.json' with { type: 'json' };
import { parseArgs } from './args/index.js';
const helpText = `Vyriy Project Master

Usage:
  vyriy new [name]       Create a new Vyriy project
  vyriy init             Initialize the current directory
  vyriy .                Initialize the current directory
  vyriy doctor           Check local environment
  vyriy --yes, -y        Use defaults where possible (empty preset)
  vyriy --dry-run        Print checks and file plan without writing
  vyriy --overwrite      Overwrite existing generated paths
  vyriy --skip-existing  Leave existing generated paths untouched
  vyriy --no-install     Create files without installing dependencies
  vyriy --no-verify      Install dependencies without running checks
  vyriy --install-only   Alias for --no-verify
  vyriy --verify         Explicitly enable generated project checks
  vyriy --help, -h       Show help
  vyriy --version, -v    Show version

Examples:
  vyriy new my-app
  vyriy .
  vyriy init`;
export const runVyriyCli = async (args = [], { output = console } = {}) => {
    const command = parseArgs(args);
    let code = 0;
    switch (command.type) {
        case 'new':
            code = await runNewCommand({
                dryRun: command.dryRun,
                install: command.install,
                output,
                overwrite: command.overwrite,
                projectName: command.projectName,
                skipExisting: command.skipExisting,
                verify: command.verify,
                yes: command.yes,
            });
            break;
        case 'init':
            code = await runInitCommand({
                dryRun: command.dryRun,
                install: command.install,
                output,
                overwrite: command.overwrite,
                skipExisting: command.skipExisting,
                verify: command.verify,
                yes: command.yes,
            });
            break;
        case 'doctor': {
            const result = await runDoctorCommand({ output });
            code = result.code;
            break;
        }
        case 'help':
            output.log(helpText);
            break;
        case 'version':
            output.log(packageJson.version);
            break;
        case 'unknown':
            output.error(`Unknown command: ${command.command}\n`);
            output.error(helpText);
            code = 1;
            break;
    }
    process.exitCode = code;
    return code;
};
