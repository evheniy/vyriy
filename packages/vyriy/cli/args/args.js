export const parseArgs = (args) => {
    const [command, projectName] = args;
    if (!command) {
        return { type: 'new' };
    }
    switch (command) {
        case 'new':
            return { type: 'new', projectName };
        case '.':
        case 'init':
            return { type: 'init' };
        case 'doctor':
            return { type: 'doctor' };
        case '--help':
        case '-h':
            return { type: 'help' };
        case '--version':
        case '-v':
            return { type: 'version' };
        default:
            return { type: 'unknown', command };
    }
};
