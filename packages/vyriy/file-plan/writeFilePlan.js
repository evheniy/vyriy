import fs from 'node:fs/promises';
import path from 'node:path';
export const writeFilePlan = async (targetDirectory, plan) => {
    for (const item of plan) {
        if (item.status === 'skip' || item.status === 'conflict') {
            continue;
        }
        const absolutePath = path.join(targetDirectory, item.path);
        await fs.mkdir(path.dirname(absolutePath), { recursive: true });
        await fs.writeFile(absolutePath, item.content, 'utf8');
    }
};
