import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../../../package.json' with { type: 'json' };
const presetDir = dirname(fileURLToPath(import.meta.url));
const agentsPath = [
    resolve(presetDir, '../../../AGENTS.md'),
    resolve(presetDir, '../../../../AGENTS.md'),
].find(existsSync) ?? '';
const agentsContent = agentsPath ? readFileSync(agentsPath, 'utf8') : '';
export const base = {
    files: ({ name, description }) => ({
        'package.json': JSON.stringify({
            name,
            version: '0.0.0',
            description,
            private: true,
            type: 'module',
            agents: './AGENTS.md',
            packageManager: packageJson.packageManager,
            engines: {
                node: packageJson.engines.node,
            },
            scripts: {
                storybook: 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook dev -p 6006 --disable-telemetry',
                check: 'run-s lint build test',
                fix: "run-s 'fix:*'",
                lint: "run-s 'lint:*'",
                build: "run-s 'build:*'",
                test: "run-s 'test:*'",
                'fix:prettier': 'prettier . --write',
                'fix:eslint': 'eslint . --fix',
                'lint:ts': 'tsc',
                'lint:prettier': 'prettier . --check',
                'lint:eslint': 'eslint .',
                'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
                'test:jest': 'jest --passWithNoTests',
                postinstall: 'husky',
            },
            dependencies: {
                '@vyriy/typescript-config': `^${packageJson.version}`,
                typescript: packageJson.peerDependencies.typescript,
                '@vyriy/prettier-config': `^${packageJson.version}`,
                prettier: packageJson.peerDependencies.prettier,
                '@vyriy/eslint-config': `^${packageJson.version}`,
                eslint: packageJson.peerDependencies.eslint,
                '@vyriy/jest-config': `^${packageJson.version}`,
                jest: packageJson.peerDependencies.jest,
                '@vyriy/storybook-config': `^${packageJson.version}`,
                storybook: packageJson.peerDependencies.storybook,
                '@vyriy/path': `^${packageJson.version}`,
                husky: packageJson.peerDependencies.husky,
                'npm-run-all2': packageJson.peerDependencies['npm-run-all2'],
                'cross-env': packageJson.peerDependencies['cross-env'],
            },
        }, null, 2) + '\n',
        'README.md': `# ${name}\n\n${description}\n`,
        'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="${name}" />

<Markdown>{ReadMe}</Markdown>
`,
        'AGENTS.md': agentsContent,
        '.editorconfig': `# https://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

indent_style = space
indent_size = 2

max_line_length = 100

# Markdown
[*.md]
trim_trailing_whitespace = false
max_line_length = off

# YAML / YML
[*.{yml,yaml}]
indent_size = 2

# JSON
[*.json]
indent_size = 2

# TypeScript / JavaScript
[*.{ts,tsx,js,jsx}]
indent_size = 2

# Shell / Bash
[*.sh]
indent_size = 2
`,
        '.gitignore': `.yarn/*
!.yarn/cache
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

.DS_Store
.idea
node_modules
coverage
dist
storybook-static
*storybook.log
consumer

cdk.out
cdk.context.json

!/**/.gitkeep
`,
        '.npmrc': 'engine-strict=true\n',
        '.nvmrc': 'lts/krypton\n',
        '.yarnrc.yml': 'nodeLinker: node-modules\nnpmMinimalAgeGate: 0\n',
        '.husky/commit-msg': '#!/bin/sh\n',
        '.husky/post-checkout': '#!/bin/sh\n\nyarn\n',
        '.husky/post-merge': '#!/bin/sh\n\nyarn\n',
        '.husky/pre-commit': '#!/bin/sh\n\nyarn check\n',
        '.husky/pre-push': '#!/bin/sh\n\nyarn check\n',
        '.storybook/main.ts': `import config from '@vyriy/storybook-config';
import { path } from '@vyriy/path';

export default {
  ...config,
  stories: [
    path('**/*.mdx'),
    path('**/*.stories.@(js|jsx|mjs|ts|tsx)'),
  ],
};
`,
        '.storybook/preview.tsx': "export { default } from '@vyriy/storybook-config/preview';\n",
        'yarn.lock': '',
        'tsconfig.json': JSON.stringify({
            extends: '@vyriy/typescript-config/index.json',
            include: [
                '.storybook/**/*.ts',
                '.storybook/**/*.tsx',
                'packages/**/*.ts',
                'packages/**/*.tsx',
                'workspaces/**/*.ts',
                'workspaces/**/*.tsx',
                '*.ts',
            ],
        }, null, 2) + '\n',
        'prettier.config.ts': "export { default } from '@vyriy/prettier-config';\n",
        '.prettierignore': 'node_modules\ndist\ncoverage\nstorybook-static\n',
        'eslint.config.ts': "export { default } from '@vyriy/eslint-config';\n",
        'jest.config.ts': "export { default } from '@vyriy/jest-config';\n",
    }),
    ci: {
        gitlab: {
            '.gitlab-ci.yml': `image: node:24

code:
  script:
    - corepack enable
    - yarn install
    - yarn check
`,
        },
        github: {
            '.github/workflows/code.yml': `name: code

on:
  push:
  pull_request:

jobs:
  code:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: |
          corepack enable
          yarn install
          yarn check
`,
        },
    },
    deploy: {},
};
