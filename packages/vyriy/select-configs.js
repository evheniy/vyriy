import { createInterface } from 'node:readline/promises';
import { allConfigNames, defaultConfigNames } from './config-targets.js';
const labels = {
    eslint: 'ESLint',
    jest: 'Jest',
    prettier: 'Prettier',
    storybook: 'Storybook',
    stylelint: 'Stylelint',
    typescript: 'TypeScript',
};
const parseAnswer = (answer) => {
    const selected = new Set();
    for (const token of answer
        .split(',')
        .map((part) => part.trim().toLowerCase())
        .filter(Boolean)) {
        const index = Number(token);
        const configName = allConfigNames[index - 1];
        if (configName) {
            selected.add(configName);
            continue;
        }
        if (allConfigNames.includes(token)) {
            selected.add(token);
        }
    }
    return [...selected];
};
export const selectConfigs = async () => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
        return defaultConfigNames;
    }
    console.log('Select configs to create. Press enter for defaults.');
    allConfigNames.forEach((name, index) => {
        const defaultMarker = defaultConfigNames.includes(name) ? ' default' : '';
        console.log(`${index + 1}. ${labels[name]}${defaultMarker}`);
    });
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    try {
        const answer = await readline.question('Configs: ');
        const selected = parseAnswer(answer);
        return selected.length > 0 ? selected : defaultConfigNames;
    }
    finally {
        readline.close();
    }
};
