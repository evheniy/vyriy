import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline';
import { createProjectPlanFromPreset, getDefaultApiStyleFromPreset, isApiPreset, } from '../../project-plan/index.js';
const presets = [
    'library',
    'api',
    'react-csr',
    'react-ssr',
    'react-ssg',
    'mfe',
    'openmfe',
    'mfe-bff',
    'openmfe-bff',
    'fullstack',
    'aws-serverless',
    'empty',
];
const extraFeatures = [
    'storybook',
    'docker',
    'aws-cdk',
    'dynamodb',
    'lambda',
    'fargate',
    's3',
    'cloudfront',
];
const apiStyles = ['rest', 'graphql', 'mixed'];
const ciProviders = ['none', 'gitlab', 'github'];
const createQuestion = (readline, output) => {
    const queuedLines = [];
    const pendingQuestions = [];
    readline.on('line', (line) => {
        const resolve = pendingQuestions.shift();
        if (resolve) {
            resolve(line);
            return;
        }
        queuedLines.push(line);
    });
    readline.on('close', () => {
        for (const resolve of pendingQuestions.splice(0)) {
            resolve('');
        }
    });
    return (query) => {
        output.write(query);
        const queuedLine = queuedLines.shift();
        if (queuedLine !== undefined) {
            return Promise.resolve(queuedLine);
        }
        return new Promise((resolve) => pendingQuestions.push(resolve));
    };
};
const promptWithDefault = async (question, label, defaultValue) => {
    const answer = (await question(`${label} (${defaultValue}): `)).trim();
    return answer || defaultValue;
};
const parsePreset = (value, defaultValue) => {
    const normalizedValue = value.trim();
    const numericValue = Number.parseInt(normalizedValue, 10);
    if (Number.isInteger(numericValue) && presets[numericValue - 1]) {
        return presets[numericValue - 1];
    }
    return presets.includes(normalizedValue) ? normalizedValue : defaultValue;
};
const parseFeatures = (value) => value
    .split(',')
    .map((feature) => feature.trim())
    .filter((feature) => extraFeatures.includes(feature));
const parseApiStyle = (value, defaultValue) => {
    const normalizedValue = value.trim().toLowerCase();
    const numericValue = Number.parseInt(normalizedValue, 10);
    if (Number.isInteger(numericValue) && apiStyles[numericValue - 1]) {
        return apiStyles[numericValue - 1];
    }
    return apiStyles.includes(normalizedValue) ? normalizedValue : defaultValue;
};
const parseCiProvider = (value, defaultValue) => {
    const normalizedValue = value.trim().toLowerCase();
    const numericValue = Number.parseInt(normalizedValue, 10);
    if (Number.isInteger(numericValue) && ciProviders[numericValue - 1]) {
        return ciProviders[numericValue - 1];
    }
    return ciProviders.includes(normalizedValue)
        ? normalizedValue
        : defaultValue;
};
export const askProjectPlan = async ({ defaults = {}, input = stdin, output = stdout } = {}) => {
    const readline = createInterface({ input, output });
    const question = createQuestion(readline, output);
    try {
        output.write('Vyriy Project Master\n\n');
        const projectName = await promptWithDefault(question, 'Project name', defaults.projectName ?? 'my-app');
        const targetDirectory = await promptWithDefault(question, 'Target directory', defaults.targetDirectory ?? projectName);
        const packageScope = await promptWithDefault(question, 'Package scope', defaults.packageScope ?? `@${projectName}`);
        const description = await promptWithDefault(question, 'Description', defaults.description ?? 'Calm cloud-ready application.');
        output.write('\nProject preset:\n');
        presets.forEach((preset, index) => output.write(`  ${index + 1}. ${preset}\n`));
        const presetAnswer = await promptWithDefault(question, 'Preset number or name', defaults.preset ?? 'react-ssr');
        const preset = parsePreset(presetAnswer, defaults.preset ?? 'react-ssr');
        const defaultApiStyle = defaults.apiStyle ?? getDefaultApiStyleFromPreset(preset);
        const apiStyle = isApiPreset(preset)
            ? parseApiStyle(await promptWithDefault(question, 'API style: 1. rest (@vyriy/router), 2. graphql, 3. mixed', defaultApiStyle), defaultApiStyle)
            : undefined;
        output.write('\nCI/CD provider:\n');
        output.write('  1. none\n');
        output.write('  2. gitlab\n');
        output.write('  3. github\n');
        const defaultCiProvider = defaults.ciProvider ?? 'none';
        const ciProvider = parseCiProvider(await promptWithDefault(question, 'CI/CD provider number or name', defaultCiProvider), defaultCiProvider);
        output.write('\nAdditional features, comma-separated:\n');
        output.write(`  ${extraFeatures.join(', ')}\n`);
        const featuresAnswer = await promptWithDefault(question, 'Features', defaults.features?.join(', ') ?? '');
        const features = parseFeatures(featuresAnswer);
        const plan = createProjectPlanFromPreset({
            projectName,
            targetDirectory,
            packageScope,
            description,
            preset,
            features,
            apiStyle,
            ciProvider,
        });
        const confirmation = (await promptWithDefault(question, 'Use this project plan?', 'yes')).toLowerCase();
        return confirmation === 'yes' || confirmation === 'y' ? plan : undefined;
    }
    finally {
        readline.close();
    }
};
