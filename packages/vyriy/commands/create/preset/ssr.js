import packageJson from '../../../package.json' with { type: 'json' };
import { base } from './base.js';
import { assetsDeclarationFile, baseToolingDeps, buildPackageJson, reactComponentFiles, reactDeps, reactServiceFiles, reactWorkspaceScripts, serverDeps, stylelintConfigFile, stylelintDeps, webpackDeps, } from './shared.js';
export const ssr = (options) => ({
    ...base(options),
    ...stylelintConfigFile(),
    ...assetsDeclarationFile(),
    ...reactComponentFiles(),
    ...reactServiceFiles(),
    'package.json': buildPackageJson(options, [
        'packages/*',
        'workspaces/*',
    ], reactWorkspaceScripts('api'), {
        ...baseToolingDeps(),
        ...webpackDeps(),
        ...serverDeps(),
        ...reactDeps(),
        ...stylelintDeps(),
        '@vyriy/cn': `^${packageJson.version}`,
        '@vyriy/html': `^${packageJson.version}`,
        sass: packageJson.peerDependencies.sass,
    }),
    'workspaces/api/bin/build.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/api";
distdir="$PWD/dist/api";

NODE_ENV=production npx webpack --config $scriptdir/webpack.config.ts

yarn exec sass packages/components/page/styles.scss "$distdir/styles.css" --no-source-map --style=compressed
cp $scriptdir/package.json "$distdir/package.json"
npm pkg delete "type" --prefix "$distdir"
npm pkg delete "private" --prefix "$distdir"
`,
    'workspaces/api/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/api";
distdir="$PWD/dist/api";

mkdir -p "$distdir"
yarn exec sass packages/components/page/styles.scss "$distdir/styles.css" --no-source-map

PROJECT_CWD="$distdir" NODE_ENV=production LOG_LEVEL=info "$PWD/node_modules/.bin/tsx" $scriptdir/index.tsx
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
    'workspaces/api/index.tsx': `import { readFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';

import { server } from '@vyriy/server';
import { api } from '@vyriy/handler';
import { html, minify } from '@vyriy/html';
import { path } from '@vyriy/path';

import { cms } from '@p/services/cms';
import { Page } from '@p/components';

const dashboardStyles = readFileSync(path('styles.css'), 'utf8');

server(
  api(async () => {
    const content = await cms.getContent();

    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
      body: minify(
        html({
          htmlAttributes: 'lang="en"',
          title: \`<title>\${content.title}</title>\`,
          meta: '<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />',
          style: \`<style>\${dashboardStyles.trim()}</style>\`,
          body: renderToString(<Page content={content.body} />),
        }),
      ),
    };
  }),
);
`,
    'workspaces/api/index.test.tsx': `import { describe, expect, it, jest } from '@jest/globals';

const apiMock = jest.fn((handler) => ({
  handler,
}));
const getContentMock = jest.fn(() =>
  Promise.resolve({
    title: 'Sample Content',
    body: 'This is a sample content fetched from the CMS.',
  }),
);
const nodeFs = jest.requireActual<typeof import('node:fs')>('node:fs');
const readFileSyncMock = jest.fn<(path: string | URL, encoding: 'utf8') => string>(
  () => '.content { display: block; }',
);
const serverMock = jest.fn();

jest.mock('node:fs', () => ({
  ...nodeFs,
  readFileSync: readFileSyncMock,
}));

jest.mock('@vyriy/handler', () => ({
  api: apiMock,
}));

jest.mock('@vyriy/server', () => ({
  server: serverMock,
}));

jest.mock('@p/services/cms', () => ({
  cms: {
    getContent: getContentMock,
  },
}));

describe('workspaces/api/index.tsx', () => {
  it('starts the server with a handler that returns rendered page HTML', async () => {
    await import('./index.js');

    expect(apiMock).toHaveBeenCalledTimes(1);
    expect(serverMock).toHaveBeenCalledTimes(1);
    expect(serverMock).toHaveBeenCalledWith(apiMock.mock.results[0]?.value);

    const handler = apiMock.mock.calls[0]?.[0] as () => Promise<{
      statusCode: number;
      headers: Record<string, string>;
      body: string;
    }>;

    const response = await handler();

    expect(response).toEqual({
      statusCode: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
      body: expect.stringContaining('<title>Sample Content</title>'),
    });
    expect(response.body).toContain('<style>.content { display: block; }</style>');
    expect(response.body).toContain('This is a sample content fetched from the CMS.');
    expect(readFileSyncMock).toHaveBeenCalledWith(expect.stringContaining('styles.css'), 'utf8');
    expect(getContentMock).toHaveBeenCalledTimes(1);
  });
});
`,
});
