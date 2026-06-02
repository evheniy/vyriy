import { presets as appPreset } from '../preset/index.js';
import { prompt } from './prompt.js';
import { resolveOption } from './resolve-option.js';
export const preset = async (question, output) => {
    const defaultPreset = 'base';
    const presetNames = Object.keys(appPreset);
    output.write('\nProject preset:\n\n');
    const maxWidth = Math.max(...presetNames.map((n, i) => `${i + 1}. ${appPreset[n].name}`.length));
    presetNames.forEach((presetName, index) => {
        const label = `${index + 1}. ${appPreset[presetName].name}`;
        output.write(`  ${label.padEnd(maxWidth)} - ${appPreset[presetName].description}\n`);
    });
    const presetValue = await prompt(question, '\nPreset number or name', defaultPreset);
    return resolveOption(presetValue, presetNames, defaultPreset);
};
