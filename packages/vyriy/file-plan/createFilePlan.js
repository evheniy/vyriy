import path from 'node:path';
import { fileExists as fileExistsDefault } from '../shared/index.js';
const getFilePlanStatus = (exists, { overwrite, skipExisting, }) => {
    if (!exists) {
        return 'create';
    }
    if (overwrite) {
        return 'overwrite';
    }
    if (skipExisting) {
        return 'skip';
    }
    return 'conflict';
};
export const createFilePlan = async (targetDirectory, files, options = {}) => {
    const { fileExists = fileExistsDefault, overwrite = false, skipExisting = false } = options;
    if (overwrite && skipExisting) {
        throw new Error('Cannot use overwrite and skipExisting together.');
    }
    const plan = [];
    for (const file of files) {
        const exists = await fileExists(path.join(targetDirectory, file.path));
        plan.push({
            ...file,
            status: getFilePlanStatus(exists, { overwrite, skipExisting }),
        });
    }
    return plan;
};
