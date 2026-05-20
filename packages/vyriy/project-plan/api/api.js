const apiPresets = [
    'api',
    'fullstack',
    'mfe',
];
export const isApiPreset = (preset) => apiPresets.includes(preset);
export const getApiRuntimeFromPreset = () => 'docker';
export const getDefaultApiStyleFromPreset = () => 'rest';
export const getFeaturesFromApiPlan = (api) => {
    if (!api) {
        return [];
    }
    return api.style === 'rest' ? ['rest-api'] : ['graphql-api'];
};
export const createApiPlan = ({ preset, runtime = getApiRuntimeFromPreset(preset), style = getDefaultApiStyleFromPreset(preset), }) => {
    if (!isApiPreset(preset)) {
        return undefined;
    }
    const basePlan = {
        enabled: true,
        style,
        runtime,
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
