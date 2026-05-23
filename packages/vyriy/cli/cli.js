import { parseArgs } from './args.js';
import { help, version, dist, checkEnv, create } from '../commands/index.js';
export const cli = async (args = []) => {
    const command = parseArgs(args);
    switch (command.type) {
        case 'help':
            process.exitCode = await help();
            break;
        case 'version':
            process.exitCode = await version();
            break;
        case 'dist':
            process.exitCode = await dist();
            break;
        case 'check-env': {
            process.exitCode = await checkEnv();
            break;
        }
        case 'create':
            process.exitCode = await create(command);
            break;
        default:
            console.error(`Unknown command.\n`);
            await help();
            process.exitCode = 1;
            break;
    }
};
