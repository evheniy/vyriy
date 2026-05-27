import packageJson from '../../../package.json' with { type: 'json' };
import { base } from './base.js';
export const api = {
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
    }),
    ci: {
        ...base.ci,
    },
    deploy: {},
};
