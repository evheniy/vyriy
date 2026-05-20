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
    empty: [],
    library: ['react'],
    api: [],
    csr: ['react', 'webpack'],
    ssr: ['react', 'webpack'],
    ssg: ['react', 'webpack'],
    fullstack: ['react', 'webpack'],
    mfe: ['react', 'webpack', 'openmfe'],
};
const packagePlans = {
    empty: [],
    library: [{ name: 'ui', kind: 'ui', publishable: true }],
    api: [{ name: 'api', kind: 'api', publishable: false }],
    csr: [
        { name: 'app', kind: 'app', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
    ],
    ssr: [
        { name: 'app', kind: 'app', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'ssr', kind: 'app', publishable: false },
    ],
    ssg: [
        { name: 'app', kind: 'app', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'ssg', kind: 'app', publishable: false },
        { name: 'content', kind: 'utils', publishable: false },
    ],
    fullstack: [
        { name: 'app', kind: 'app', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'api', kind: 'api', publishable: false },
    ],
    mfe: [
        { name: 'mfe', kind: 'app', publishable: false },
        { name: 'ui', kind: 'ui', publishable: true },
        { name: 'api', kind: 'api', publishable: false },
        { name: 'openmfe-contract', kind: 'config', publishable: true },
    ],
};
const workspacePlans = {
    empty: [],
    library: [],
    api: [{ name: 'api', kind: 'api' }],
    csr: [{ name: 'web', kind: 'ui' }],
    ssr: [
        { name: 'ssr', kind: 'ui' },
        { name: 'web', kind: 'ui' },
    ],
    ssg: [
        { name: 'ssg', kind: 'ui' },
        { name: 'web', kind: 'ui' },
    ],
    fullstack: [
        { name: 'web', kind: 'ui' },
        { name: 'api', kind: 'api' },
    ],
    mfe: [
        { name: 'mfe', kind: 'ui' },
        { name: 'api', kind: 'api' },
    ],
};
const uniqueFeatures = (features) => [...new Set(features)];
const getApiRuntimeFromFeatures = (features) => features.includes('lambda') ? 'lambda' : 'docker';
const awsInfrastructureFeatures = [
    'aws-cdk',
    'lambda',
    'fargate',
    's3',
    'cloudfront',
];
const getApiWorkspaceKindFromFeatures = (features) => {
    if (features.includes('lambda')) {
        return 'lambda';
    }
    if (features.includes('fargate')) {
        return 'fargate';
    }
    return 'api';
};
const createWorkspacePlans = ({ features, preset, }) => {
    const apiWorkspaceKind = getApiWorkspaceKindFromFeatures(features);
    const workspaces = workspacePlans[preset].map((workspacePlan) => workspacePlan.name === 'api'
        ? {
            ...workspacePlan,
            kind: apiWorkspaceKind,
        }
        : workspacePlan);
    if (features.some((feature) => awsInfrastructureFeatures.includes(feature))) {
        return [
            ...workspaces,
            { name: 'stack', kind: 'stack' },
        ];
    }
    return workspaces;
};
export const createProjectPlanFromPreset = ({ description, apiStyle, ciProvider, features = [], packageScope, preset, projectName, targetDirectory, }) => {
    const api = createApiPlan({ preset, runtime: getApiRuntimeFromFeatures(features), style: apiStyle });
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
        workspaces: createWorkspacePlans({ features, preset }),
        ci: createCiPlan({ provider: ciProvider }),
        ...(api ? { api } : {}),
    };
};
