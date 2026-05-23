import { prompt } from './prompt.js';
import { resolveOption } from './resolve-option.js';
export const provider = async (question, output, label, options) => {
    const optionNames = Object.keys(options);
    const defaultOption = optionNames[0];
    if (defaultOption === undefined) {
        return undefined;
    }
    output.write(`\n${label}:\n\n`);
    optionNames.forEach((optionName, index) => output.write(`  ${index + 1}. ${optionName}\n`));
    const optionValue = await prompt(question, `\n${label} number or name`, defaultOption);
    return resolveOption(optionValue, optionNames);
};
