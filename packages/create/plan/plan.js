import { stdin, stdout } from 'node:process';
import { dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { prompt, preset as promptPreset, scope as promptScope } from '../prompt/index.js';
import { question as createQuestion } from './question.js';
const toDirectoryName = (name, fallback) => {
    const directoryName = name.trim().replaceAll(/[\s\\/]+/g, '_');
    return directoryName || fallback;
};
const getTargetDefault = (name, dirName, appPath) => name === dirName ? appPath : resolve(dirname(appPath), toDirectoryName(name, dirName));
export const plan = async (dirName, appPath) => {
    const readline = createInterface({ input: stdin, output: stdout });
    const question = createQuestion(readline, stdout);
    try {
        stdout.write('\nVyriy Project Master\n\n');
        const name = await prompt(question, 'Project name', dirName);
        const description = await prompt(question, 'Project description', 'Calm cloud-ready application');
        const target = await prompt(question, 'Target directory', getTargetDefault(name, dirName, appPath));
        const preset = await promptPreset(question, stdout);
        const scope = await promptScope(question, preset, name);
        const confirmation = (await prompt(question, 'Use this project plan?', 'y')).toLowerCase();
        return confirmation === 'y'
            ? {
                name,
                description,
                target,
                preset,
                scope,
            }
            : undefined;
    }
    finally {
        readline.close();
    }
};
