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
export const ssr = (options) => ({
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
            husky: packageJson.peerDependencies.husky,
            'npm-run-all2': packageJson.peerDependencies['npm-run-all2'],
            'cross-env': packageJson.peerDependencies['cross-env'],
            rimraf: packageJson.peerDependencies.rimraf,
            '@vyriy/webpack-config': `^${packageJson.version}`,
            tsx: packageJson.peerDependencies.tsx,
            'webpack-cli': packageJson.peerDependencies['webpack-cli'],
            '@vyriy/handler': `^${packageJson.version}`,
            '@vyriy/server': `^${packageJson.version}`,
            react: packageJson.peerDependencies.react,
            'react-dom': packageJson.peerDependencies['react-dom'],
            '@types/react': packageJson.peerDependencies['@types/react'],
            '@types/react-dom': packageJson.peerDependencies['@types/react-dom'],
            '@vyriy/stylelint-config': `^${packageJson.version}`,
            stylelint: packageJson.peerDependencies.stylelint,
            '@vyriy/cn': `^${packageJson.version}`,
            '@vyriy/html': `^${packageJson.version}`,
            sass: packageJson.peerDependencies.sass,
            '@vyriy/render': `^${packageJson.version}`,
        },
    }, null, 2) + '\n',
    'README.md': `# SSR

Calm cloud-ready SSR application preset.

This repository is a small TypeScript workspace for server-rendered React output. The API workspace fetches content through a service adapter, renders shared React components on the server, and returns complete HTML.

## Structure

\`\`\`text
packages/
  components/  Shared SSR-friendly React components.
  services/    Replaceable service adapters, including CMS access.
workspaces/
  api/         Server entry point that renders the page response.
\`\`\`

Documentation is rendered through Storybook MDX wrappers. The root \`doc.mdx\` displays this README, while package and workspace docs display their own README files.

## Application Flow

1. \`workspaces/api/index.tsx\` starts the server.
2. The request handler calls \`cms.getContent()\` from \`@p/services/cms\`.
3. The returned body is rendered with \`Page\` from \`@p/components\`.
4. The response is wrapped into a complete HTML document and returned as \`text/html\`.

## Requirements

- Node.js \`>=24.0.0\`
- Yarn \`4.16.0\`

Install dependencies:

\`\`\`bash
yarn install
\`\`\`

## Commands

Start the SSR API:

\`\`\`bash
yarn start
\`\`\`

Build the API bundle and Storybook documentation:

\`\`\`bash
yarn build
\`\`\`

Run validation:

\`\`\`bash
yarn check
\`\`\`

Run individual checks:

\`\`\`bash
yarn lint
yarn test
\`\`\`

Open Storybook documentation:

\`\`\`bash
yarn storybook
\`\`\`

## Packages

- \`@p/components\` exports shared React components for server-rendered surfaces.
- \`@p/services\` exports service adapters that keep integration details outside UI and workspace code.
- \`@w/api\` is the SSR server workspace and deployable application entry point.

## Development Notes

Keep public behavior documented where it is introduced. When adding shared components or services, update the matching package README, public re-exports, and focused tests. Prefer SSR-safe code paths and avoid browser globals during render.

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [One Handler, Many Runtimes](https://vyriy.dev/examples/one-handler-many-runtimes/) - how @vyriy/handler, @vyriy/router, and @vyriy/server compose a calm Lambda-compatible API that can run locally, in Docker, Fargate-style HTTP runtimes, and AWS Lambda.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="SSR" />

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
    'stylelint.config.ts': "export { default } from '@vyriy/stylelint-config';\n",
    'assets.d.ts': "declare module '*.scss';\n",
    'packages/components/package.json': JSON.stringify({
        name: '@p/components',
        private: true,
        type: 'module',
    }, null, 2) + '\n',
    'packages/components/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Packages/Components" />

<Markdown>{ReadMe}</Markdown>
`,
    'packages/components/README.md': `# Components

Shared React components for SSR-friendly application surfaces.

The package keeps reusable UI small and framework-neutral. Components should render without browser globals, accept typed props, and stay easy to compose from server-rendered workspaces.

## Exports

### \`Page\`

Renders page body content inside the standard page content container.

\`\`\`tsx
import { Page } from '@p/components';

export const App = () => <Page content="This is a rendered page." />;
\`\`\`

Rendered markup:

\`\`\`html
<div class="content">This is a rendered page.</div>
\`\`\`

## Styling

\`Page\` uses the \`content\` class. The host workspace owns the actual CSS so the component can stay reusable across SSR and SSG outputs.

## Development

Add new public components as focused files with matching tests, then re-export them from the package entry point.

Focused validation:

\`\`\`bash
yarn jest packages/components --runInBand --coverage=false
\`\`\`
`,
    'packages/services/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Packages/Services" />

<Markdown>{ReadMe}</Markdown>
`,
    'packages/services/README.md': `# Services

Shared service adapters for application workspaces.

The package is the place for replaceable integrations such as CMS access, API clients, and other server-safe service boundaries. Keep adapters typed, deterministic in tests, and free from direct UI concerns.

## Exports

### \`cms\`

CMS content adapter used by the API workspace before rendering the page.

\`\`\`ts
import { cms } from '@p/services/cms';

const content = await cms.getContent();
\`\`\`

\`getContent()\` currently returns sample content:

\`\`\`ts
{
  title: 'Sample Content',
  body: 'This is a sample content fetched from the CMS.',
}
\`\`\`

The returned shape is intended for server rendering: \`title\` is used for document metadata, and \`body\` is passed to the page component.

## Development

Keep service modules behind small public methods so real providers can replace placeholders without coupling callers to a specific CMS, network client, or runtime host.

Focused validation:

\`\`\`bash
yarn jest packages/services --runInBand --coverage=false
\`\`\`
`,
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
    'workspaces/api/README.md': `# API

SSR server workspace for the \`ssr\` preset.

The workspace owns the deployable server entry point. It fetches page content, renders shared React components on the server, wraps the result into a complete HTML document, and returns an HTML response.

## Entry Point

\`index.tsx\` starts the server with \`@vyriy/server\` and registers an async handler with \`@vyriy/handler\`.

Request flow:

1. Load content with \`cms.getContent()\` from \`@p/services/cms\`.
2. Render \`<Page content={content.body} />\` from \`@p/components\`.
3. Read compiled \`styles.css\` from the project runtime directory.
4. Build and minify the HTML document with \`@vyriy/html\`.
5. Return \`200\` with \`content-type: text/html; charset=utf-8\`.

## Runtime Output

The handler returns a complete HTML response:

\`\`\`ts
{
  statusCode: 200,
  headers: {
    'content-type': 'text/html; charset=utf-8',
  },
  body: '<!doctype html>...',
}
\`\`\`

The document title comes from \`content.title\`, and the rendered body comes from \`content.body\`.

## Scripts

Start the API from the repository root:

\`\`\`bash
yarn start:api
\`\`\`

The start script compiles \`packages/components/page/styles.scss\` into \`dist/api/styles.css\`, then runs \`workspaces/api/index.tsx\` with \`tsx\`.

Build the deployable API output:

\`\`\`bash
yarn build:api
\`\`\`

The build script writes the server bundle, compiled CSS, and runtime package metadata into \`dist/api\`.

## Validation

Run the focused API tests:

\`\`\`bash
yarn jest workspaces/api --runInBand --coverage=false
\`\`\`

Run the full project validation:

\`\`\`bash
yarn check
\`\`\`

## Development Notes

Keep workspace code focused on orchestration. Shared UI belongs in \`@p/components\`, and integration behavior belongs in \`@p/services\`, so the server entry point stays easy to replace or deploy in a different runtime.
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
    'workspaces/api/index.tsx': `import { readFileSync } from 'node:fs';

import { server } from '@vyriy/server';
import { api } from '@vyriy/handler';
import { html, minify } from '@vyriy/html';
import { path } from '@vyriy/path';
import { html as renderHtml } from '@vyriy/render/html';

import { cms } from '@p/services/cms';
import { Page } from '@p/components';

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
          style: \`<style>\${readFileSync(path('styles.css'), 'utf8').trim()}</style>\`,
          body: renderHtml(<Page content={content.body} />),
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
