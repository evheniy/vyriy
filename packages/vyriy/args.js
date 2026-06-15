export const parseArgs = (args) => {
    const [command = '', ...commandArgs] = args;
    if (command === 'check' ||
        command === 'create' ||
        command === 'dist' ||
        command === 'static' ||
        command === 'tooling') {
        return { type: command, args: commandArgs };
    }
    if (args.includes('--help') || args.includes('-h')) {
        return { type: 'help' };
    }
    if (args.includes('--version') || args.includes('-v')) {
        return { type: 'version' };
    }
    if (!command) {
        return { type: 'help' };
    }
    return { type: 'unknown', command };
};
