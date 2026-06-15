import { allConfigNames, defaultConfigNames } from './config-targets.js';
const isConfigName = (value) => {
    return allConfigNames.includes(value);
};
export const parseConfigArgs = (args) => {
    const dryRun = args.includes('--dry-run');
    const force = args.includes('--force');
    const help = args.includes('--help') || args.includes('-h');
    const version = args.includes('--version') || args.includes('-v');
    const type = args.find((arg) => !arg.startsWith('-')) ?? 'init';
    if (help) {
        return {
            dryRun,
            force,
            names: [],
            type: 'help',
        };
    }
    if (version) {
        return {
            dryRun,
            force,
            names: [],
            type: 'version',
        };
    }
    if (type === 'init') {
        return {
            dryRun,
            force,
            names: defaultConfigNames,
            type,
        };
    }
    if (isConfigName(type)) {
        return {
            dryRun,
            force,
            names: [type],
            type,
        };
    }
    return {
        dryRun,
        force,
        names: [],
        type: 'unknown',
    };
};
