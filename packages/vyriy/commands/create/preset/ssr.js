import packageJson from '../../../package.json' with { type: 'json' };
import { base } from './base.js';
export const ssr = {
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
                'packages/*',
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
                'fix:stylelint': 'stylelint "**/*.{css,scss}" --fix',
                'start:api': 'sh workspaces/api/bin/start.sh',
                'lint:ts': 'tsc',
                'lint:prettier': 'prettier . --check',
                'lint:eslint': 'eslint .',
                'lint:stylelint': 'stylelint "**/*.{css,scss}"',
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
                vyriy: `^${packageJson.version}`,
                husky: packageJson.peerDependencies.husky,
                'npm-run-all2': packageJson.peerDependencies['npm-run-all2'],
                'cross-env': packageJson.peerDependencies['cross-env'],
                rimraf: packageJson.peerDependencies.rimraf,
                '@vyriy/webpack-config': `^${packageJson.version}`,
                '@vyriy/handler': `^${packageJson.version}`,
                '@vyriy/server': `^${packageJson.version}`,
                tsx: packageJson.peerDependencies.tsx,
                webpack: packageJson.peerDependencies.webpack,
                'webpack-cli': packageJson.peerDependencies['webpack-cli'],
                react: packageJson.peerDependencies.react,
                'react-dom': packageJson.peerDependencies['react-dom'],
                '@types/react': packageJson.peerDependencies['@types/react'],
                '@types/react-dom': packageJson.peerDependencies['@types/react-dom'],
                '@vyriy/stylelint-config': `^${packageJson.version}`,
                '@vyriy/cn': `^${packageJson.version}`,
                '@vyriy/html': `^${packageJson.version}`,
                stylelint: packageJson.peerDependencies.stylelint,
                sass: packageJson.peerDependencies.sass,
            },
        }, null, 2) + '\n',
        'stylelint.config.ts': "export { default } from '@vyriy/stylelint-config';\n",
        'assets.d.ts': "declare module '*.scss';\n",
        'packages/components/package.json': JSON.stringify({
            name: '@p/components',
            private: true,
            type: 'module',
        }, null, 2) + '\n',
        'packages/components/index.ts': "export * from './page/index.js';\n",
        'packages/components/index.test.tsx': `import { describe, expect, it } from '@jest/globals';

import { Page } from './index.js';
import { Page as PageImplementation } from './page/index.js';

describe('packages/components/page', () => {
  it('re-exports the page component', () => {
    expect(Page).toBe(PageImplementation);
  });
});
`,
        'packages/components/page/index.ts': `export * from './page.js';
export type * from './types.js';
`,
        'packages/components/page/index.test.ts': `import { describe, expect, it } from '@jest/globals';

import { Page } from './index.js';
import { Page as PageImplementation } from './page.js';

describe('packages/components/page', () => {
  it('re-exports the page component', () => {
    expect(Page).toBe(PageImplementation);
  });
});
`,
        'packages/components/page/types.ts': `import { FC } from 'react';

export type PageProps = {
  content: string;
};

export type PageType = FC<PageProps>;
`,
        'packages/components/page/page.tsx': `import type { PageType } from './types.js';

export const Page: PageType = ({ content }) => <div className="content">{content}</div>;
`,
        'packages/components/page/styles.scss': `.content {
  display: block;
}
`,
        'packages/components/page/page.test.tsx': `import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from '@jest/globals';

import { Page } from './page.js';

describe('packages/components/page/page', () => {
  it('renders content inside the page content container', () => {
    expect(renderToStaticMarkup(<Page content="Page body" />)).toBe('<div class="content">Page body</div>');
  });
});
`,
        'packages/services/package.json': JSON.stringify({
            name: '@p/services',
            private: true,
            type: 'module',
        }, null, 2) + '\n',
        'packages/services/cms/index.ts': `export const cms = {
  getContent: async () => {
    // Placeholder for fetching content from a CMS
    return Promise.resolve({
      title: 'Sample Content',
      body: 'This is a sample content fetched from the CMS.',
    });
  },
};
`,
        'packages/services/cms/index.test.ts': `import { describe, expect, it } from '@jest/globals';

import { cms } from './index.js';

describe('packages/services/cms', () => {
  it('returns content for rendering a page', async () => {
    await expect(cms.getContent()).resolves.toEqual({
      title: 'Sample Content',
      body: 'This is a sample content fetched from the CMS.',
    });
  });
});
`,
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
    }),
    ci: {
        ...base.ci,
    },
    deploy: {},
};
