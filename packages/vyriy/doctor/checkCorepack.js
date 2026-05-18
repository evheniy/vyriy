import { execCommand as execCommandDefault } from '../shared/index.js';
export const checkCorepack = async ({ execCommand = execCommandDefault, } = {}) => {
    try {
        const version = await execCommand('corepack', ['--version']);
        return {
            name: 'corepack',
            label: 'Corepack',
            group: 'Package manager',
            level: 'ok',
            version,
            message: 'Corepack available',
        };
    }
    catch {
        return {
            name: 'corepack',
            label: 'Corepack',
            group: 'Package manager',
            level: 'warning',
            message: 'Corepack was not found',
            detail: 'Yarn fixes cannot be run automatically without Corepack.',
        };
    }
};
