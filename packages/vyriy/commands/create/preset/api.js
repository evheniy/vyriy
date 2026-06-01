import { base } from './base.js';
import { apiWorkspaceBaseFiles, baseToolingDeps, buildPackageJson, serverDeps, webpackDeps, workspaceScripts, } from './shared.js';
export const api = (options) => ({
    ...base(options),
    ...apiWorkspaceBaseFiles(options.name, options.description),
    'package.json': buildPackageJson(options, [
        'workspaces/*',
    ], workspaceScripts('api'), {
        ...baseToolingDeps(),
        ...webpackDeps(),
        ...serverDeps(),
    }),
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
