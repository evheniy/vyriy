import packageJson from '../../../package.json' with { type: 'json' };
import { base } from './base.js';
export const rest = {
    files: (options) => ({
        ...base.files(options),
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
                '@vyriy/handler': `^${packageJson.version}`,
                '@vyriy/server': `^${packageJson.version}`,
                tsx: packageJson.peerDependencies.tsx,
                'webpack-cli': packageJson.peerDependencies['webpack-cli'],
                '@vyriy/router': `^${packageJson.version}`,
                '@vyriy/html': `^${packageJson.version}`,
            },
        }, null, 2) + '\n',
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
        'workspaces/api/README.md': `# ${options.name} API\n\n${options.description}\n`,
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

server(api(async (event) => router.route(event)));
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
    }),
    ci: {
        ...base.ci,
    },
    deploy: {},
};
