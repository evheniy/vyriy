import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline';
import { presets as appPreset } from '../preset/index.js';
import { prompt, provider as promptProvider, preset as promptPreset, scope as promptScope } from '../prompt/index.js';
import { question as createQuestion } from './question.js';
export const plan = async (dirName, appPath) => {
    const readline = createInterface({ input: stdin, output: stdout });
    const question = createQuestion(readline, stdout);
    try {
        stdout.write('\nVyriy Project Master\n\n');
        const name = await prompt(question, 'Project name', dirName);
        const description = await prompt(question, 'Project description', 'Calm cloud-ready application');
        const target = await prompt(question, 'Target directory', appPath);
        const preset = await promptPreset(question, stdout);
        const scope = await promptScope(question, preset, name);
        const ci = await promptProvider(question, stdout, 'CI/CD provider', appPreset[preset].preset.ci);
        const deploy = await promptProvider(question, stdout, 'Deploy provider', appPreset[preset].preset.deploy);
        const confirmation = (await prompt(question, 'Use this project plan?', 'y')).toLowerCase();
        return confirmation === 'y'
            ? {
                name,
                description,
                target,
                preset,
                scope,
                ci,
                deploy,
            }
            : undefined;
    }
    finally {
        readline.close();
    }
};
