import { resolveDependency } from './resolve-dependency.js';
export const babel = (isSsr = false, isProduction = true) => {
    const isClientDevelopment = !isProduction && !isSsr;
    const envOptions = {
        modules: false,
        ...(isSsr ? { targets: { node: 'current' } } : {}),
    };
    return {
        presets: [
            [
                resolveDependency('@babel/preset-env'),
                envOptions,
            ],
            [
                resolveDependency('@babel/preset-react'),
                {
                    runtime: 'automatic',
                    development: !isProduction,
                },
            ],
            resolveDependency('@babel/preset-typescript'),
        ],
        plugins: [
            resolveDependency('@babel/plugin-transform-runtime'),
            ...(isClientDevelopment ? [resolveDependency('react-refresh/babel')] : []),
        ],
    };
};
