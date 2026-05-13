export const defaultValidationPipelines = [
    'install',
    'typecheck',
    'lint',
    'prettier',
    'test',
    'build',
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
