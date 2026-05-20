import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline';
import { createProjectPlanFromPreset, getDefaultApiStyleFromPreset, isApiPreset, } from '../../project-plan/index.js';
const presets = [
    'empty',
    'library',
    'api',
    'ssr',
    'ssg',
    'csr',
    'fullstack',
    'mfe',
];
const presetDescriptions = {
    empty: 'shared tooling without application code',
    library: 'publishable React package for reusable UI',
    api: 'REST or GraphQL backend API',
    ssr: 'server-rendered React application',
    ssg: 'build-time generated static React site',
    csr: 'browser-rendered React application',
    fullstack: 'React frontend with backend API',
    mfe: 'OpenMFE widget with UI, API, SSR, and manifest',
};
const infrastructureOptions = ['docker', 'aws'];
const infrastructureFeatureMap = {
    docker: ['docker'],
    aws: [
        'aws-cdk',
        'lambda',
        'apigateway',
    ],
};
const extraFeatureMap = {
    docker: ['docker'],
    'aws-api': [
        'aws-cdk',
        'lambda',
        'apigateway',
    ],
    'aws-fargate': [
        'aws-cdk',
        'fargate',
        'docker',
    ],
    'aws-static': [
        'aws-cdk',
        's3',
        'cloudfront',
    ],
};
const directFeatureInputs = [
    'docker',
    'aws-cdk',
    'apigateway',
    'lambda',
    'fargate',
    's3',
    'cloudfront',
];
const apiStyles = ['rest', 'graphql'];
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
const parseFeatures = (value) => [
    ...new Set(value
        .split(',')
        .map((feature) => feature.trim())
        .flatMap((feature) => extraFeatureMap[feature] ??
        (directFeatureInputs.includes(feature)
            ? [feature]
            : []))),
];
const parseInfrastructure = (value, defaultValue) => {
    const normalizedValue = value.trim().toLowerCase();
    const numericValue = Number.parseInt(normalizedValue, 10);
    if (Number.isInteger(numericValue) && infrastructureOptions[numericValue - 1]) {
        return [...infrastructureFeatureMap[infrastructureOptions[numericValue - 1]]];
    }
    if (infrastructureOptions.includes(normalizedValue)) {
        return [...infrastructureFeatureMap[normalizedValue]];
    }
    const legacyFeatures = parseFeatures(value);
    return legacyFeatures.length > 0 ? legacyFeatures : [...infrastructureFeatureMap[defaultValue]];
};
const getDefaultInfrastructureInput = (features) => features?.some((feature) => [
    'aws-cdk',
    'lambda',
    'apigateway',
    'fargate',
    's3',
    'cloudfront',
].includes(feature))
    ? 'aws'
    : 'docker';
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
        presets.forEach((preset, index) => output.write(`  ${index + 1}. ${preset} - ${presetDescriptions[preset]}\n`));
        const defaultPreset = defaults.preset ?? 'empty';
        const presetAnswer = await promptWithDefault(question, 'Preset number or name', defaultPreset);
        const preset = parsePreset(presetAnswer, defaultPreset);
        const defaultApiStyle = defaults.apiStyle ?? getDefaultApiStyleFromPreset(preset);
        const apiStyle = isApiPreset(preset)
            ? parseApiStyle(await promptWithDefault(question, 'API style:\n  1. rest (@vyriy/router),\n  2. graphql', defaultApiStyle), defaultApiStyle)
            : undefined;
        output.write('\nCI/CD provider:\n');
        output.write('  1. none\n');
        output.write('  2. gitlab\n');
        output.write('  3. github\n');
        const defaultCiProvider = defaults.ciProvider ?? 'none';
        const ciProvider = parseCiProvider(await promptWithDefault(question, 'CI/CD provider number or name', defaultCiProvider), defaultCiProvider);
        output.write('\nInfrastructure:\n');
        output.write('  1. Docker\n');
        output.write('  2. AWS\n');
        const defaultInfrastructure = getDefaultInfrastructureInput(defaults.features);
        const featuresAnswer = await promptWithDefault(question, 'Infrastructure number or name', defaultInfrastructure);
        const features = parseInfrastructure(featuresAnswer, defaultInfrastructure);
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
