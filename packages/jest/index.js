const config = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/packages/**/*.{ts,tsx}',
        '<rootDir>/stack/*.ts',
        '!<rootDir>/packages/**/*.d.ts',
        '!<rootDir>/packages/**/index.{ts,tsx}',
        '!<rootDir>/packages/**/*.stories.{ts,tsx}',
        '!<rootDir>/packages/**/*.types.ts',
        '!<rootDir>/packages/**/types.ts',
    ],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
    ],
    coverageProvider: 'v8',
    coverageReporters: [
        'json',
        'text',
        'text-summary',
        'lcov',
        'clover',
        'cobertura',
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    moduleFileExtensions: [
        'js',
        'mjs',
        'cjs',
        'jsx',
        'ts',
        'mts',
        'cts',
        'tsx',
        'json',
        'node',
    ],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '\\.(css|less|scss|sass|svg)$': 'identity-obj-proxy',
    },
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
    ],
    preset: 'ts-jest',
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: 'coverage',
                outputName: 'junit.xml',
            },
        ],
    ],
    resetMocks: false,
    restoreMocks: true,
    testEnvironment: 'jsdom',
    testMatch: ['**/?(*.)+(spec|test).?([mc])[jt]s?(x)'],
    testPathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/dist/',
    ],
    transform: {
        '^.+\\.[tj]sx?$': [
            '@swc/jest',
            {
                jsc: {
                    transform: {
                        react: {
                            runtime: 'automatic',
                        },
                    },
                },
            },
        ],
    },
    transformIgnorePatterns: [
        '/node_modules/',
    ],
};
export default config;
