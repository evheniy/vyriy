const typescriptContent = `${JSON.stringify({
    extends: '@vyriy/typescript-config/index.json',
    include: [
        '.storybook/**/*.ts',
        '.storybook/**/*.tsx',
        'packages/**/*.ts',
        'packages/**/*.tsx',
        'workspaces/**/*.ts',
        'workspaces/**/*.tsx',
        '*.ts',
        '*.tsx',
    ],
}, null, 2)}
`;
const eslintContent = `import config from '@vyriy/eslint-config';

export default config;
`;
const prettierContent = `export { default } from '@vyriy/prettier-config';
`;
const jestContent = `export { default } from '@vyriy/jest-config';
`;
const stylelintContent = `export { default } from '@vyriy/stylelint-config';
`;
const storybookMainContent = `import config from '@vyriy/storybook-config';

import type { StorybookConfig } from '@vyriy/storybook-config';

const main: StorybookConfig = {
  ...config,
  stories: [
    '../**/*.mdx',
    '../**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
};

export default main;
`;
const storybookPreviewContent = `export { default } from '@vyriy/storybook-config/preview.js';
`;
export const configTargets = {
    eslint: {
        name: 'eslint',
        packageName: '@vyriy/eslint-config',
        files: [{ path: 'eslint.config.js', content: eslintContent }],
    },
    jest: {
        name: 'jest',
        packageName: '@vyriy/jest-config',
        files: [{ path: 'jest.config.js', content: jestContent }],
    },
    prettier: {
        name: 'prettier',
        packageName: '@vyriy/prettier-config',
        files: [{ path: 'prettier.config.js', content: prettierContent }],
    },
    storybook: {
        name: 'storybook',
        packageName: '@vyriy/storybook-config',
        files: [
            { path: '.storybook/main.ts', content: storybookMainContent },
            { path: '.storybook/preview.ts', content: storybookPreviewContent },
        ],
    },
    stylelint: {
        name: 'stylelint',
        packageName: '@vyriy/stylelint-config',
        files: [{ path: 'stylelint.config.js', content: stylelintContent }],
    },
    typescript: {
        name: 'typescript',
        packageName: '@vyriy/typescript-config',
        files: [{ path: 'tsconfig.json', content: typescriptContent }],
    },
};
export const defaultConfigNames = [
    'typescript',
    'eslint',
    'prettier',
    'jest',
];
export const allConfigNames = Object.keys(configTargets);
