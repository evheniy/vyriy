import { presets as appPreset } from '../preset/index.js';
import { prompt } from './prompt.js';
import { resolveOption } from './resolve-option.js';
export const preset = async (question, output) => {
    const defaultPreset = 'base';
    const presetNames = Object.keys(appPreset);
    output.write('\nProject preset:\n\n');
    presetNames.forEach((presetName, index) => output.write(`  ${index + 1}. ${appPreset[presetName].name} - ${appPreset[presetName].description}\n`));
    const presetValue = await prompt(question, '\nPreset number or name', defaultPreset);
    return resolveOption(presetValue, presetNames, defaultPreset);
};
