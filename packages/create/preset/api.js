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
export const api = (options) => ({
    'package.json': JSON.stringify({
        name: options.name,
        version: '0.0.0',
        description: options.description,
        private: true,
        type: 'module',
        agents: './AGENTS.md',
        packageManager: packageJson.packageManager,
        engines: {
            node: packageJson.engines.node,
        },
        workspaces: [
            'workspaces/*',
        ],
        scripts: {
            storybook: 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook dev -p 6006 --disable-telemetry',
            check: 'run-s lint build test',
            fix: "run-s 'fix:*'",
            start: "run-p 'start:*'",
            lint: "run-s 'lint:*'",
            build: "run-s 'build:*'",
            test: "run-s 'test:*'",
            'fix:prettier': 'prettier . --write',
            'fix:eslint': 'eslint . --fix',
            'start:api': 'sh workspaces/api/bin/start.sh',
            'lint:ts': 'tsc',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            'build:api': 'rimraf dist && sh workspaces/api/bin/build.sh',
            'build:storybook': 'cross-env STORYBOOK_DISABLE_TELEMETRY=1 storybook build --quiet --disable-telemetry',
            'test:jest': 'jest',
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
            rimraf: packageJson.peerDependencies.rimraf,
            '@vyriy/webpack-config': `^${packageJson.version}`,
            tsx: packageJson.peerDependencies.tsx,
            'webpack-cli': packageJson.peerDependencies['webpack-cli'],
            '@vyriy/handler': `^${packageJson.version}`,
            '@vyriy/server': `^${packageJson.version}`,
        },
    }, null, 2) + '\n',
    'README.md': `# Api

Calm cloud-ready application built as a Yarn workspace.

The repository currently contains one runtime workspace:

- \`workspaces/api\` - HTTP API entry point based on \`@vyriy/server\` and \`@vyriy/handler\`.

## Requirements

- Node.js \`>=24.0.0\`
- Yarn \`4.16.0\`

## Usage

Install dependencies:

\`\`\`bash
yarn install
\`\`\`

Start the API:

\`\`\`bash
yarn start
\`\`\`

Build the API bundle:

\`\`\`bash
yarn build
\`\`\`

Run all project checks:

\`\`\`bash
yarn check
\`\`\`

## Scripts

- \`yarn start\` - start all workspace services.
- \`yarn start:api\` - run the API from \`workspaces/api/index.ts\`.
- \`yarn build\` - build all project outputs.
- \`yarn build:api\` - create the production API bundle in \`dist/api\`.
- \`yarn test\` - run Jest tests.
- \`yarn lint\` - run TypeScript, Prettier, and ESLint validation.
- \`yarn storybook\` - start Storybook documentation.

## Project Structure

- \`workspaces/api\` - API source, tests, build script, and workspace README.
- \`.storybook\` - Storybook configuration for MDX documentation and stories.
- \`doc.mdx\` - root Storybook documentation page backed by this README.
- \`dist\` - generated production output.

## Development

Keep public behavior documented in the relevant workspace README and covered by
matching tests. For API changes, start with \`workspaces/api/index.ts\` and keep
\`workspaces/api/index.test.ts\` aligned with the request/response contract.

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [One Handler, Many Runtimes](https://vyriy.dev/examples/one-handler-many-runtimes/) - how @vyriy/handler, @vyriy/router, and @vyriy/server compose a calm Lambda-compatible API that can run locally, in Docker, Fargate-style HTTP runtimes, and AWS Lambda.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Api" />

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

.claude
.codex
.agents

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
    'workspaces/api/bin/build.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/api";

NODE_ENV=production npx webpack --config $scriptdir/webpack.config.ts

cp $scriptdir/package.json dist/api/package.json
npm pkg delete "type" --prefix dist/api
npm pkg delete "private" --prefix dist/api
`,
    'workspaces/api/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/api";

NODE_ENV=production LOG_LEVEL=info tsx $scriptdir/index.ts
`,
    'workspaces/api/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Workspaces/API" />

<Markdown>{ReadMe}</Markdown>
`,
    'workspaces/api/README.md': `# @w/api

HTTP API workspace for the application.

The current handler starts a \`@vyriy/server\` instance with an \`@vyriy/handler\`
API adapter. For every request it returns a JSON response with the requested
path:

\`\`\`json
{
  "path": "/healthcheck"
}
\`\`\`

## Usage

Start the API from the repository root:

\`\`\`bash
yarn start:api
\`\`\`

Build the production bundle:

\`\`\`bash
yarn build:api
\`\`\`

The build writes a CommonJS bundle to \`dist/api/index.js\` and copies the
workspace \`package.json\` into \`dist/api\`.

## Development

The API entry point is \`index.ts\`.

Update the handler there when adding routes or changing response behavior, and
keep \`index.test.ts\` aligned with the public behavior.

Run the focused test suite with:

\`\`\`bash
yarn jest workspaces/api --runInBand --coverage=false
\`\`\`
`,
    'workspaces/api/webpack.config.ts': `import { path } from '@vyriy/path';
import { ssr, external } from '@vyriy/webpack-config';

export default ssr(
  '@w/api',
  {
    path: path('dist', 'api'),
    filename: 'index.js',
    library: { type: 'commonjs2' },
  },
  (config) => ({
    ...config,
    externals: [external({ allowlist: [/^@p/, /^@w/, /^@vyriy/] })],
  }),
);
`,
    'workspaces/api/package.json': JSON.stringify({
        name: '@w/api',
        type: 'module',
        private: true,
    }, null, 2) + '\n',
    'workspaces/api/index.ts': `import { server } from '@vyriy/server';
import { api } from '@vyriy/handler';

server(
  api(async (event) =>
    Promise.resolve({
      statusCode: 200,
      body: JSON.stringify({
        path: event.path,
      }),
    }),
  ),
);
`,
    'workspaces/api/index.test.ts': `import { describe, expect, it, jest } from '@jest/globals';

const apiMock = jest.fn((handler) => ({
  handler,
}));
const serverMock = jest.fn();

jest.mock('@vyriy/handler', () => ({
  api: apiMock,
}));

jest.mock('@vyriy/server', () => ({
  server: serverMock,
}));

describe('workspaces/api/index.ts', () => {
  it('starts the server with a handler that returns the request path', async () => {
    await import('./index.js');

    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(serverMock).toHaveBeenCalledTimes(1);
    expect(serverMock).toHaveBeenCalledWith(apiMock.mock.results[0]?.value);

    const handler = apiMock.mock.calls[0]?.[0] as (event: {
      path: string;
    }) => Promise<{ statusCode: number; body: string }>;

    await expect(handler({ path: '/healthcheck' })).resolves.toEqual({
      statusCode: 200,
      body: JSON.stringify({
        path: '/healthcheck',
      }),
    });
  });
});
`,
});
