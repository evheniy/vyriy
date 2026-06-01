import packageJson from '../../../package.json' with { type: 'json' };
import { base } from './base.js';
import { apiWorkspaceBaseFiles, baseToolingDeps, buildPackageJson, serverDeps, webpackDeps, workspaceScripts, } from './shared.js';
export const rest = (options) => ({
    ...base(options),
    ...apiWorkspaceBaseFiles(options.name, options.description),
    'package.json': buildPackageJson(options, [
        'workspaces/*',
    ], workspaceScripts('api'), {
        ...baseToolingDeps(),
        ...webpackDeps(),
        ...serverDeps(),
        '@vyriy/router': `^${packageJson.version}`,
        '@vyriy/html': `^${packageJson.version}`,
    }),
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
});
