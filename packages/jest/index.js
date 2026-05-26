const config = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/**/*.{ts,tsx,js,jsx,mjs,cjs}',
        '!<rootDir>/**/*.d.ts',
        '!<rootDir>/**/*.stories.{ts,tsx}',
        '!<rootDir>/**/*.types.ts',
        '!<rootDir>/**/types.ts',
        '!<rootDir>/*.config.{ts,mjs}',
        '!<rootDir>/**/*.config.{ts,mjs}',
        '!<rootDir>/consumer/**',
    ],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/storybook-static/',
        '<rootDir>/dist/',
        '<rootDir>/build/',
        '<rootDir>/bin/',
        '<rootDir>/packages/.*/bin/',
        '<rootDir>/.bin/',
        '<rootDir>/.storybook/',
        '<rootDir>/coverage/',
        '<rootDir>/.yarn/',
        '<rootDir>/e2e/',
        '<rootDir>/consumer/',
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
        '/node_modules/',
        '<rootDir>/coverage/',
        '<rootDir>/dist/',
        '<rootDir>/storybook-static/',
        '<rootDir>/consumer/',
    ],
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
        '<rootDir>/coverage/',
        '<rootDir>/dist/',
        '<rootDir>/storybook-static/',
        '<rootDir>/consumer/',
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
        '/node_modules/(?!@vyriy/)',
    ],
};
export default config;
