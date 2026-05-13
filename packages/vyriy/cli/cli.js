import { runDoctorCommand } from '../commands/doctor/index.js';
import { runInitCommand } from '../commands/init/index.js';
import { runNewCommand } from '../commands/new/index.js';
import { parseArgs } from './args/index.js';
const version = '0.1.23';
const helpText = `Vyriy Project Master

Usage:
  vyriy new [name]       Create a new Vyriy project
  vyriy init             Initialize the current directory
  vyriy .                Initialize the current directory
  vyriy doctor           Check local environment
  vyriy --help           Show help
  vyriy --version        Show version

Examples:
  vyriy new my-app
  vyriy .
  vyriy init`;
export const runVyriyCli = async (args = [], { output = console } = {}) => {
    const command = parseArgs(args);
    let code = 0;
    switch (command.type) {
        case 'new':
            code = await runNewCommand({ output, projectName: command.projectName });
            break;
        case 'init':
            code = await runInitCommand({ output });
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
            output.log(version);
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
