import { access } from 'node:fs/promises';
export const fileExists = async (path) => {
    try {
        await access(path);
        return true;
    }
    catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
};
