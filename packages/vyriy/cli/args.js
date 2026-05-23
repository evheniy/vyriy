export const parseArgs = (args) => {
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    if (args.includes('--dist') || args.includes('-d')) {
        return { type: 'dist' };
    }
    if (args.includes('--check-env') || args.includes('-c')) {
        return { type: 'check-env' };
    }
    const dryRun = args.includes('--dry-run');
    const overwrite = args.includes('--overwrite');
    const skipExisting = args.includes('--skip-existing');
    const install = !args.includes('--no-install');
    const verify = install && !args.includes('--no-verify');
    const directory = args.find((arg) => !arg.startsWith('-')) ?? '';
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
