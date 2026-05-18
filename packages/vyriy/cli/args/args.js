export const parseArgs = (args) => {
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    const dryRun = args.includes('--dry-run');
    const yes = args.includes('--yes') || args.includes('-y');
    const overwrite = args.includes('--overwrite');
    const skipExisting = args.includes('--skip-existing');
    const positionalArgs = args.filter((arg) => !arg.startsWith('-'));
    const [command, projectName] = positionalArgs;
    const options = {
        dryRun,
        yes,
        overwrite,
        skipExisting,
    };
    if (!command) {
        return { type: 'new', ...options };
    }
    switch (command) {
        case 'new':
            return { type: 'new', projectName, ...options };
        case '.':
        case 'init':
            return { type: 'init', ...options };
        case 'doctor':
            return { type: 'doctor' };
        default:
            return { type: 'unknown', command };
    }
};
