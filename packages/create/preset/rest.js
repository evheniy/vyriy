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
export const rest = (options) => ({
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
            '@vyriy/router': `^${packageJson.version}`,
            '@vyriy/html': `^${packageJson.version}`,
        },
    }, null, 2) + '\n',
    'README.md': `# REST API

Calm cloud-ready application built as a Yarn workspace.

The repository currently contains a single API workspace that serves a small
HTTP API, publishes an OpenAPI document, and renders the document with Scalar.
The root package owns shared tooling for TypeScript, ESLint, Prettier, Jest,
Storybook, and workspace-level build scripts.

## Requirements

- Node.js \`>=24.0.0\`
- Yarn \`4.16.0\`

## Workspaces

| Workspace                              | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| [\`@w/api\`](./workspaces/api/README.md) | HTTP API server with OpenAPI and Scalar documentation. |

## Local development

Install dependencies:

\`\`\`bash
yarn install
\`\`\`

Start all configured services:

\`\`\`bash
yarn start
\`\`\`

Start only the API:

\`\`\`bash
yarn start:api
\`\`\`

The API listens on \`PORT\` through \`@vyriy/server\`; when \`PORT\` is not set, the
default port is \`3000\`.

After the API starts, open:

- \`http://localhost:3000/\` for the Scalar API reference.
- \`http://localhost:3000/openapi.json\` for the raw OpenAPI document.
- \`http://localhost:3000/api/test\` for the test endpoint.

## Documentation

Run Storybook:

\`\`\`bash
yarn storybook
\`\`\`

The root \`doc.mdx\` imports this README for project-level documentation.
\`workspaces/api/doc.mdx\` imports the API workspace README for API-specific
documentation.

## Validation

Run all checks:

\`\`\`bash
yarn check
\`\`\`

Run checks separately:

\`\`\`bash
yarn lint
yarn build
yarn test
\`\`\`

Run the focused API test suite:

\`\`\`bash
yarn jest workspaces/api --runInBand --coverage=false
\`\`\`

## Build

Build all configured outputs:

\`\`\`bash
yarn build
\`\`\`

Build only the API bundle:

\`\`\`bash
yarn build:api
\`\`\`

The API build writes a CommonJS server bundle to \`dist/api/index.js\` and copies
a runtime \`package.json\` into \`dist/api\`.

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [One Handler, Many Runtimes](https://vyriy.dev/examples/one-handler-many-runtimes/) - how @vyriy/handler, @vyriy/router, and @vyriy/server compose a calm Lambda-compatible API that can run locally, in Docker, Fargate-style HTTP runtimes, and AWS Lambda.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="REST API" />

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
    'workspaces/api/README.md': `# REST API

Calm cloud-ready application API workspace.

This workspace starts a small HTTP API with \`@vyriy/server\`, adapts the router
through \`@vyriy/handler\`, and documents the available endpoints with an
OpenAPI document rendered by Scalar.

## Routes

| Method | Path            | Description                                       |
| ------ | --------------- | ------------------------------------------------- |
| \`GET\`  | \`/\`             | Serves the Scalar API reference UI.               |
| \`GET\`  | \`/openapi.json\` | Returns the OpenAPI 3.0 document for the API.     |
| \`GET\`  | \`/api/test\`     | Returns a JSON test response: \`{ "test": "ok" }\`. |

Unknown routes return a \`404\` JSON response.

## Local development

Start the API from the repository root:

\`\`\`bash
yarn start:api
\`\`\`

The server listens on \`PORT\` through \`@vyriy/server\`; when \`PORT\` is not set,
the default port is \`3000\`.

After the server starts, open:

- \`http://localhost:3000/\` for the API reference UI.
- \`http://localhost:3000/openapi.json\` for the raw OpenAPI document.
- \`http://localhost:3000/api/test\` for the test endpoint.

## Validation

Run the API test suite:

\`\`\`bash
yarn jest workspaces/api --runInBand --coverage=false
\`\`\`

Run the full repository checks:

\`\`\`bash
yarn check
\`\`\`

## Build

Build the API bundle from the repository root:

\`\`\`bash
yarn build:api
\`\`\`

The build writes a CommonJS server bundle to \`dist/api/index.js\` and copies a
runtime \`package.json\` into \`dist/api\`.

## Implementation notes

- \`index.ts\` owns the router, OpenAPI document, Scalar UI route, and server
  startup.
- \`index.test.ts\` mocks the server adapter, loads \`index.ts\`, and validates the
  registered route behavior.
- \`doc.mdx\` imports this README so the same documentation appears in Storybook
  under \`Workspaces/API\`.
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
import { createRouter } from '@vyriy/router';
import { html, minify } from '@vyriy/html';

const router = createRouter();

router.get('/api/test', async () => {
  return Promise.resolve({
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ test: 'ok' }),
  });
});

router.get('/openapi.json', async () => {
  return Promise.resolve({
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      openapi: '3.0.0',
      info: {
        title: 'REST API',
        description: 'A minimal example of an OpenAPI definition in JSON format.',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Local server',
        },
      ],
      paths: {
        '/api/test': {
          get: {
            summary: 'Test endpoint',
            operationId: 'getTest',
            responses: {
              '200': {
                description: 'A successful test response',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/TestResponse',
                    },
                    example: {
                      test: 'ok',
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          TestResponse: {
            type: 'object',
            required: ['test'],
            properties: {
              test: {
                type: 'string',
                example: 'ok',
              },
            },
          },
        },
      },
    }),
  });
});

router.get('/', async () => {
  return Promise.resolve({
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
    body: minify(
      html({
        title: '<title>REST API</title>',
        meta: '<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />',
        body: [
          '<div id="app"></div>',
          '<script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>',
          "<script>Scalar.createApiReference('#app', { url: '/openapi.json' })</script>",
        ].join(''),
      }),
    ),
  });
});

server(api(router.handle()));
`,
    'workspaces/api/index.test.ts': `import { describe, expect, it, jest } from '@jest/globals';
import type { APIGatewayProxyEvent } from '@vyriy/router';

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
  const getEvent = (path: string): APIGatewayProxyEvent =>
    ({
      body: null,
      headers: {},
      httpMethod: 'GET',
      path,
      pathParameters: null,
      queryStringParameters: null,
    }) as APIGatewayProxyEvent;

  it('starts the server with the API router handler', async () => {
    await import('./index.js');

    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(serverMock).toHaveBeenCalledTimes(1);
    expect(serverMock).toHaveBeenCalledWith(apiMock.mock.results[0]?.value);

    const handler = apiMock.mock.calls[0]?.[0] as (event: APIGatewayProxyEvent) => Promise<{
      body: string;
      headers?: Record<string, string>;
      statusCode: number;
    }>;

    await expect(handler(getEvent('/api/test'))).resolves.toEqual({
      body: JSON.stringify({
        test: 'ok',
      }),
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 200,
    });

    const openApiResponse = await handler(getEvent('/openapi.json'));

    expect(openApiResponse).toEqual({
      body: expect.any(String),
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 200,
    });
    expect(JSON.parse(openApiResponse.body)).toEqual({
      components: {
        schemas: {
          TestResponse: {
            properties: {
              test: {
                example: 'ok',
                type: 'string',
              },
            },
            required: ['test'],
            type: 'object',
          },
        },
      },
      info: {
        description: 'A minimal example of an OpenAPI definition in JSON format.',
        title: 'REST API',
        version: '1.0.0',
      },
      openapi: '3.0.0',
      paths: {
        '/api/test': {
          get: {
            operationId: 'getTest',
            responses: {
              '200': {
                content: {
                  'application/json': {
                    example: {
                      test: 'ok',
                    },
                    schema: {
                      $ref: '#/components/schemas/TestResponse',
                    },
                  },
                },
                description: 'A successful test response',
              },
            },
            summary: 'Test endpoint',
          },
        },
      },
      servers: [
        {
          description: 'Local server',
          url: 'http://localhost:3000',
        },
      ],
    });

    const docsResponse = await handler(getEvent('/'));

    expect(docsResponse).toEqual({
      body: expect.stringContaining("Scalar.createApiReference('#app', { url: '/openapi.json' })"),
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
      statusCode: 200,
    });

    await expect(handler(getEvent('/healthcheck'))).resolves.toEqual({
      body: JSON.stringify({
        message: 'Not Found',
      }),
      statusCode: 404,
    });
  });
});
`,
});
