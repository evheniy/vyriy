export const babel = (isSsr = false, isProduction = true) => {
    const isClientDevelopment = !isProduction && !isSsr;
    const envOptions = {
        bugfixes: true,
        modules: false,
        ...(isSsr ? { targets: { node: 'current' } } : {}),
    };
    return {
        presets: [
            [
                '@babel/preset-env',
                envOptions,
            ],
            [
                '@babel/preset-react',
                {
                    runtime: 'automatic',
                    development: !isProduction,
                },
            ],
            '@babel/preset-typescript',
        ],
        plugins: [
            [
                '@babel/plugin-transform-runtime',
                {
                    regenerator: true,
                },
            ],
            ...(isClientDevelopment ? ['react-refresh/babel'] : []),
        ],
    };
};
