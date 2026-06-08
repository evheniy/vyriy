import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../package.json' with { type: 'json' };
const presetDir = dirname(fileURLToPath(import.meta.url));
const agentsPath = [
    resolve(presetDir, '../../../AGENTS.md'),
    resolve(presetDir, '../../../../AGENTS.md'),
].find(existsSync) ?? '';
const agentsContent = agentsPath ? readFileSync(agentsPath, 'utf8') : '';
export const base = ({ name, description }) => ({
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
    'README.md': `# Base

Base is a minimal project preset for starting new applications, packages, or workspaces with a calm shared foundation already in place.

The repository intentionally contains configuration and workflow glue instead of product code. Its main entry point is Storybook: it works as both living documentation and a playground for future components, UI states, examples, and integration notes.

## Why Storybook

Storybook is configured from the start so the project has a visible documentation surface before any application-specific structure exists.

Use it to:

- document project decisions and package APIs with MDX;
- develop and review future components in isolation;
- capture component states, variants, and edge cases as stories;
- build a static documentation site that can be shared or deployed;
- keep README-driven documentation visible inside the same developer UI.

The root \`doc.mdx\` renders this README in Storybook, so the project overview is available both in the repository and in the local documentation playground.

## Included Foundation

- TypeScript configuration from \`@vyriy/typescript-config\`.
- ESLint configuration from \`@vyriy/eslint-config\`.
- Prettier configuration from \`@vyriy/prettier-config\`.
- Jest configuration from \`@vyriy/jest-config\`.
- Storybook configuration from \`@vyriy/storybook-config\`.
- Husky hooks for dependency refresh after branch changes or merges and quality checks before commit or push.

## Requirements

- Node.js \`>=24.0.0\`.
- Yarn \`4.16.0\`.

## Install

\`\`\`bash
yarn
\`\`\`

## Commands

\`\`\`bash
yarn storybook
\`\`\`

Starts the local Storybook playground on port \`6006\`.

\`\`\`bash
yarn build
\`\`\`

Builds the static Storybook output.

\`\`\`bash
yarn check
\`\`\`

Runs the full project validation pipeline: \`lint\`, \`build\`, and \`test\`.

\`\`\`bash
yarn fix
\`\`\`

Formats the project and applies available ESLint fixes.

\`\`\`bash
yarn lint
\`\`\`

Checks TypeScript, formatting, and ESLint rules.

\`\`\`bash
yarn test
\`\`\`

Runs Jest. The command is allowed to pass in an empty preset before tests are added.

## Structure

\`\`\`text
.
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
├── .husky/
├── doc.mdx
├── eslint.config.ts
├── jest.config.ts
├── prettier.config.ts
├── tsconfig.json
└── package.json
\`\`\`

## Adding Project Code

Add source code where it fits the final project shape, for example under \`packages/*\` or \`workspaces/*\`. These paths are already included in \`tsconfig.json\`.

When adding public components or package APIs, add matching stories or MDX documentation so Storybook remains the first place to inspect behavior, examples, and supported states.

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm Component Structure](https://vyriy.dev/blog/calm-component-structure/) - how to organize component code, tests, stories, and public exports.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Base" />

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
    '.prettierignore': 'node_modules\ndist\ncoverage\nstorybook-static\nconsumer\n',
    'eslint.config.ts': "export { default } from '@vyriy/eslint-config';\n",
    'jest.config.ts': "export { default } from '@vyriy/jest-config';\n",
});
