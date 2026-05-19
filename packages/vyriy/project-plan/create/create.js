import { createApiPlan, getFeaturesFromApiPlan } from '../api/index.js';
import { createCiPlan } from '../ci/index.js';
import { getProjectKindFromPreset } from '../kind/index.js';
const baseFeatures = [
    'typescript',
    'eslint',
    'prettier',
    'jest',
    'storybook',
];
const presetFeatures = {
    library: ['react'],
    api: [],
    'react-csr': ['react', 'webpack'],
    'react-ssr': ['react', 'webpack'],
    'react-ssg': ['react', 'webpack'],
    mfe: ['react', 'webpack'],
    openmfe: ['react', 'webpack', 'openmfe'],
    'mfe-bff': ['react', 'webpack', 'bff'],
    'openmfe-bff': [
        'react',
        'webpack',
        'openmfe',
        'bff',
    ],
    fullstack: ['react', 'webpack'],
    'aws-serverless': [
        'aws-cdk',
        'lambda',
        'apigateway',
    ],
    empty: [],
};
const packagePlans = {
    library: [{ name: 'ui', kind: 'ui', publishable: true }],
    api: [{ name: 'api', kind: 'api', publishable: false }],
    'react-csr': [
        { name: 'app', kind: 'core', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
    ],
    'react-ssr': [
        { name: 'app', kind: 'core', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'ssr', kind: 'ssr', publishable: false },
    ],
    'react-ssg': [
        { name: 'app', kind: 'core', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'ssg', kind: 'ssg', publishable: false },
        { name: 'content', kind: 'core', publishable: false },
    ],
    mfe: [
        { name: 'mfe', kind: 'mfe', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
    ],
    openmfe: [
        { name: 'mfe', kind: 'mfe', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'openmfe-contract', kind: 'contract', publishable: true },
    ],
    'mfe-bff': [
        { name: 'mfe', kind: 'mfe', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'bff', kind: 'bff', publishable: false },
    ],
    'openmfe-bff': [
        { name: 'mfe', kind: 'mfe', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'bff', kind: 'bff', publishable: false },
        { name: 'openmfe-contract', kind: 'contract', publishable: true },
    ],
    fullstack: [
        { name: 'app', kind: 'core', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'api', kind: 'api', publishable: false },
    ],
    'aws-serverless': [
        { name: 'api', kind: 'api', publishable: false },
        { name: 'stack', kind: 'stack', publishable: false },
    ],
    empty: [],
};
const workspacePlans = {
    library: [],
    api: [{ name: 'api', kind: 'api' }],
    'react-csr': [{ name: 'web', kind: 'web' }],
    'react-ssr': [
        { name: 'ssr', kind: 'ssr' },
        { name: 'web', kind: 'web' },
    ],
    'react-ssg': [
        { name: 'ssg', kind: 'ssg' },
        { name: 'web', kind: 'web' },
    ],
    mfe: [{ name: 'mfe', kind: 'mfe' }],
    openmfe: [
        { name: 'mfe', kind: 'mfe' },
        { name: 'openmfe', kind: 'openmfe' },
    ],
    'mfe-bff': [
        { name: 'mfe', kind: 'mfe' },
        { name: 'bff', kind: 'bff' },
    ],
    'openmfe-bff': [
        { name: 'mfe', kind: 'mfe' },
        { name: 'bff', kind: 'bff' },
        { name: 'openmfe', kind: 'openmfe' },
    ],
    fullstack: [
        { name: 'web', kind: 'web' },
        { name: 'api', kind: 'api' },
    ],
    'aws-serverless': [{ name: 'stack', kind: 'stack' }],
    empty: [],
};
const uniqueFeatures = (features) => [...new Set(features)];
export const createProjectPlanFromPreset = ({ description, apiStyle, ciProvider, features = [], packageScope, preset, projectName, targetDirectory, }) => {
    const api = createApiPlan({ preset, style: apiStyle });
    const apiFeatures = getFeaturesFromApiPlan(api);
    return {
        projectName,
        targetDirectory,
        packageScope,
        description,
        preset,
        projectKind: getProjectKindFromPreset(preset),
        features: uniqueFeatures([
            ...baseFeatures,
            ...presetFeatures[preset],
            ...apiFeatures,
            ...features,
        ]),
        packages: [...packagePlans[preset]],
        workspaces: [...workspacePlans[preset]],
        ci: createCiPlan({ provider: ciProvider }),
        ...(api ? { api } : {}),
    };
};
