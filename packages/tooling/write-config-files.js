import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
export const writeConfigFiles = async ({ cwd, dryRun, exists, files, force, }) => {
    const writable = [];
    for (const file of files) {
        if (!force && (await exists(join(cwd, file.path)))) {
            console.log(`Skipped ${file.path} because it already exists.`);
            console.log('Use --force to overwrite it.');
            continue;
        }
        writable.push(file);
    }
    if (dryRun) {
        if (writable.length > 0) {
            console.log('Would create:');
            for (const file of writable) {
                console.log(`- ${file.path}`);
            }
        }
        return writable;
    }
    for (const file of writable) {
        const path = join(cwd, file.path);
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, file.content, 'utf8');
        console.log(`${force ? 'Wrote' : 'Created'} ${file.path}.`);
    }
    return writable;
};
