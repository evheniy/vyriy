import { execCommand as execCommandDefault } from '../shared/index.js';
export const checkGit = async ({ execCommand = execCommandDefault } = {}) => {
    try {
        await execCommand('git', ['--version']);
        return {
            name: 'git',
            label: 'Git',
            group: 'Git',
            level: 'ok',
            message: 'Git available',
        };
    }
    catch {
        return {
            name: 'git',
            label: 'Git',
            group: 'Git',
            level: 'warning',
            message: 'Git was not found',
            detail: 'Git initialization will be skipped.',
        };
    }
};
