import { allConfigNames, defaultConfigNames } from './config-targets.js';
const isConfigName = (value) => {
    return allConfigNames.includes(value);
};
export const parseConfigArgs = (args) => {
    const dryRun = args.includes('--dry-run');
    const force = args.includes('--force');
    const help = args.includes('--help') || args.includes('-h');
    const type = args.find((arg) => !arg.startsWith('-')) ?? 'init';
    if (help) {
        return {
            dryRun,
            force,
            help,
            names: [],
            type: 'init',
        };
    }
    if (type === 'init') {
        return {
            dryRun,
            force,
            help,
            names: defaultConfigNames,
            type,
        };
    }
    if (isConfigName(type)) {
        return {
            dryRun,
            force,
            help,
            names: [type],
            type,
        };
    }
    return {
        dryRun,
        force,
        help,
        names: [],
        type: 'unknown',
    };
};
