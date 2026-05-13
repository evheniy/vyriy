const apiPresets = [
    'api',
    'fullstack',
    'mfe-bff',
    'openmfe-bff',
    'aws-serverless',
];
export const isApiPreset = (preset) => apiPresets.includes(preset);
export const getApiRuntimeFromPreset = (preset) => preset === 'aws-serverless' ? 'lambda' : 'node';
export const getDefaultApiStyleFromPreset = (preset) => preset === 'openmfe-bff' ? 'mixed' : 'rest';
export const getFeaturesFromApiPlan = (api) => {
    if (!api) {
        return [];
    }
    if (api.style === 'mixed') {
        return ['rest-api', 'graphql-api'];
    }
    return api.style === 'rest' ? ['rest-api'] : ['graphql-api'];
};
export const createApiPlan = ({ preset, style = getDefaultApiStyleFromPreset(preset) }) => {
    if (!isApiPreset(preset)) {
        return undefined;
    }
    const basePlan = {
        enabled: true,
        style,
        runtime: getApiRuntimeFromPreset(preset),
    };
    const restPlan = {
        rest: {
            router: 'vyriy-router',
            packageName: '@vyriy/router',
        },
    };
    const graphqlPlan = {
        graphql: {
            packageName: 'graphql',
        },
    };
    if (style === 'mixed') {
        return {
            ...basePlan,
            ...restPlan,
            ...graphqlPlan,
        };
    }
    return style === 'rest'
        ? {
            ...basePlan,
            ...restPlan,
        }
        : {
            ...basePlan,
            ...graphqlPlan,
        };
};
