import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver, importX } from 'eslint-plugin-import-x';
import jest from 'eslint-plugin-jest';
import reactHooks from 'eslint-plugin-react-hooks';
import { configs as storybookConfigs } from 'eslint-plugin-storybook';
import prettier from 'eslint-plugin-prettier';
import eslintReact from '@eslint-react/eslint-plugin';
const tsEslintPlugin = tsPlugin;
const jestPlugin = jest;
const prettierPlugin = prettier;
const storybookFlatRecommended = storybookConfigs['flat/recommended'];
const eslintReactRecommendedTypescript = eslintReact.configs['recommended-typescript'];
const reactHooksRecommended = reactHooks.configs.flat.recommended;
const importXPlugin = importX;
const importXRecommended = importX.flatConfigs.recommended;
const importXTypescript = importX.flatConfigs.typescript;
const extensionlessRelativeSpecifierPattern = String.raw `^\.{1,2}\/(?!.*\.(?:js|mjs|cjs|json|css|less|scss|sass|svg|md|mdx)$)`;
const extensionlessRelativeSpecifierMessage = 'Relative module specifiers must include a runtime file extension, usually .js.';
const multilineElementThreshold = 4;
const config = [
    {
        ignores: [
            'dist/**',
            'coverage/**',
            'storybook-static/**',
        ],
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.node },
        },
    },
    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
        plugins: {
            'import-x': importXPlugin,
        },
        settings: {
            'import-x/resolver-next': [
                createTypeScriptImportResolver({
                    project: './tsconfig.json',
                    alwaysTryTypes: true,
                    extensionAlias: {
                        '.js': [
                            '.ts',
                            '.tsx',
                            '.d.ts',
                            '.js',
                        ],
                        '.mjs': [
                            '.mts',
                            '.mjs',
                        ],
                        '.cjs': [
                            '.cts',
                            '.cjs',
                        ],
                    },
                }),
                createNodeResolver({
                    extensions: [
                        '.ts',
                        '.tsx',
                        '.mts',
                        '.cts',
                        '.js',
                        '.jsx',
                        '.mjs',
                        '.cjs',
                        '.json',
                    ],
                    extensionAlias: {
                        '.js': [
                            '.ts',
                            '.tsx',
                            '.d.ts',
                            '.js',
                        ],
                        '.mjs': [
                            '.mts',
                            '.mjs',
                        ],
                        '.cjs': [
                            '.cts',
                            '.cjs',
                        ],
                    },
                }),
            ],
        },
        rules: {
            ...importXRecommended.rules,
            ...importXTypescript.rules,
            'no-restricted-syntax': [
                'error',
                {
                    selector: `ImportDeclaration[source.value=/${extensionlessRelativeSpecifierPattern}/]`,
                    message: extensionlessRelativeSpecifierMessage,
                },
                {
                    selector: `ExportNamedDeclaration[source.value=/${extensionlessRelativeSpecifierPattern}/]`,
                    message: extensionlessRelativeSpecifierMessage,
                },
                {
                    selector: `ExportAllDeclaration[source.value=/${extensionlessRelativeSpecifierPattern}/]`,
                    message: extensionlessRelativeSpecifierMessage,
                },
                {
                    selector: `ImportExpression[source.value=/${extensionlessRelativeSpecifierPattern}/]`,
                    message: extensionlessRelativeSpecifierMessage,
                },
                {
                    selector: `CallExpression[callee.type='Import'][arguments.0.value=/${extensionlessRelativeSpecifierPattern}/]`,
                    message: extensionlessRelativeSpecifierMessage,
                },
                {
                    selector: `CallExpression[callee.name='require'][arguments.0.value=/${extensionlessRelativeSpecifierPattern}/]`,
                    message: extensionlessRelativeSpecifierMessage,
                },
                {
                    selector: `CallExpression[callee.object.name='jest'][callee.property.name=/^(?:mock|doMock|unstable_mockModule)$/][arguments.0.value=/${extensionlessRelativeSpecifierPattern}/]`,
                    message: extensionlessRelativeSpecifierMessage,
                },
            ],
            'object-curly-newline': [
                'error',
                {
                    ObjectExpression: {
                        minProperties: multilineElementThreshold,
                        multiline: true,
                        consistent: true,
                    },
                },
            ],
        },
    },
    {
        files: ['**/*.{ts,tsx,mts,cts}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: [
                    './tsconfig.json',
                ],
            },
        },
        plugins: { '@typescript-eslint': tsEslintPlugin },
        rules: {
            ...tsPlugin.configs['recommended-type-checked'].rules,
        },
    },
    {
        files: [
            'workspaces/**/*.{ts,tsx}',
            'packages/**/*.{ts,tsx}',
            '.storybook/*.{ts,tsx}',
            '**/*.stories.{ts,tsx}',
        ],
        ...eslintReactRecommendedTypescript,
    },
    {
        files: [
            'workspaces/**/*.{ts,tsx}',
            'packages/**/*.{ts,tsx}',
            '.storybook/*.{ts,tsx}',
            '**/*.stories.{ts,tsx}',
        ],
        ...reactHooksRecommended,
    },
    {
        files: ['**/*.test.{ts,tsx}'],
        plugins: { jest: jestPlugin },
        languageOptions: { globals: { ...globals.jest } },
        rules: {
            ...jest.configs.recommended.rules,
        },
    },
    {
        plugins: { prettier: prettierPlugin },
        rules: {
            'prettier/prettier': 'warn',
        },
    },
    ...storybookFlatRecommended,
    {
        files: [
            '.bin/**/*.{ts,tsx}',
            '.storybook/**/*.{ts,tsx}',
        ],
        rules: {
            '@typescript-eslint/require-await': 'off',
        },
    },
];
export default config;
