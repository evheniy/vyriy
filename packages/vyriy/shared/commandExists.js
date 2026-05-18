import { execCommand as execCommandDefault } from './execCommand.js';
export const commandExists = async (command, { execCommand = execCommandDefault } = {}) => {
    try {
        await execCommand(command, ['--version']);
        return true;
    }
    catch {
        return false;
    }
};
