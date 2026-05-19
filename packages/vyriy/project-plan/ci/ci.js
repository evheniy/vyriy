export const defaultValidationPipelines = [
    'install',
    'lint',
    'test',
    'build',
    'deploy',
    'smoke',
    'e2e',
];
export const createCiPlan = ({ provider = 'none' } = {}) => provider === 'none'
    ? {
        enabled: false,
        providers: [],
        pipelines: [],
    }
    : {
        enabled: true,
        providers: [provider],
        pipelines: [...defaultValidationPipelines],
    };
