export const parseArgs = (args) => {
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    const [command = '', ...commandArgs] = args;
    if (!command) {
        return { type: 'help' };
    }
    if (command === 'dist') {
        return { type: 'dist' };
    }
    if (command === 'check') {
        return { type: 'check' };
    }
    if (command === 'static') {
        const directory = commandArgs.find((arg) => !arg.startsWith('-')) ?? 'dist';
        return { type: 'static', directory };
    }
    if (command !== 'create') {
        return { type: 'unknown', command };
    }
    const dryRun = commandArgs.includes('--dry-run');
    const overwrite = commandArgs.includes('--overwrite');
    const skipExisting = commandArgs.includes('--skip-existing');
    const install = !commandArgs.includes('--no-install');
    const verify = install && !commandArgs.includes('--no-verify');
    const directory = commandArgs.find((arg) => !arg.startsWith('-')) ?? '';
    return {
        type: 'create',
        directory,
        dryRun,
        overwrite,
        skipExisting,
        install,
        verify,
    };
};
