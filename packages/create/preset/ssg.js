import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from '../package.json' with { type: 'json' };
import { styleToolingFiles } from './tooling.js';
const presetDir = dirname(fileURLToPath(import.meta.url));
const agentsPath = [
    resolve(presetDir, '../../../AGENTS.md'),
    resolve(presetDir, '../../../../AGENTS.md'),
].find(existsSync) ?? '';
const agentsContent = agentsPath ? readFileSync(agentsPath, 'utf8') : '';
export const ssg = (options) => ({
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
            'start:ssg': 'sh workspaces/ssg/bin/start.sh',
            'lint:ts': 'tsc',
            'lint:prettier': 'prettier . --check',
            'lint:eslint': 'eslint .',
            'lint:stylelint': 'stylelint "**/*.{css,scss}"',
            'build:ssg': 'rimraf dist && sh workspaces/ssg/bin/build.sh',
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
            '@vyriy/script': `^${packageJson.version}`,
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
    'README.md': `# SSG

Calm cloud-ready static site generation application.

This repository is a Yarn workspace monorepo with a small SSG application and
shared packages for reusable UI and service boundaries. The current rendering
path fetches content from a replaceable CMS adapter, renders it through a
server-safe React component, and writes a static HTML page.

## Workspace Layout

\`\`\`text
packages/
  components/   Shared SSR-friendly React components.
  services/     Replaceable server-safe service adapters.
workspaces/
  ssg/          Static site generation workspace.
\`\`\`

## Rendering Flow

The SSG workspace renders a single static page:

1. \`@p/services/cms\` returns page content.
2. \`@p/components\` renders the content with the \`Page\` component.
3. \`@w/ssg\` writes the generated document to \`dist/ssg/static/index.html\`.

The generated HTML includes compiled component styles from
\`packages/components/page/styles.scss\`.

## Development

Install dependencies with Yarn 4 and Node.js 24 or newer:

\`\`\`bash
yarn install
\`\`\`

Start the static generation workspace:

\`\`\`bash
yarn start:ssg
\`\`\`

Build the production SSG artifact:

\`\`\`bash
yarn build:ssg
\`\`\`

Run Storybook documentation:

\`\`\`bash
yarn storybook
\`\`\`

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

Focused Jest validation can target the main packages and workspace:

\`\`\`bash
yarn jest workspaces/ssg packages/components packages/services --runInBand --coverage=false
\`\`\`

## Documentation

- \`workspaces/ssg/README.md\` documents the SSG pipeline and output.
- \`packages/components/README.md\` documents shared React components.
- \`packages/services/README.md\` documents service adapters.

The matching \`doc.mdx\` files render these README files in Storybook.

## Project Guidance

These articles describe the development approach behind this preset and provide practical guidance for evolving a project on top of it:

- [Calm Development Environment: Node.js, Corepack, Yarn and Static Preview](https://vyriy.dev/blog/calm-development-setup/) - how to keep the local development environment predictable and easy to reproduce.
- [Calm App Structure for the Vyriy Ecosystem](https://vyriy.dev/blog/vyriy-calm-app-structure/) - a practical project structure for Vyriy applications: shared configs, small packages, thin workspaces, Storybook docs, tests, and deployable entry points.
- [One Handler, Many Runtimes](https://vyriy.dev/examples/one-handler-many-runtimes/) - how @vyriy/handler, @vyriy/router, and @vyriy/server compose a calm Lambda-compatible API that can run locally, in Docker, Fargate-style HTTP runtimes, and AWS Lambda.
- [Storybook as Project Documentation](https://vyriy.dev/blog/storybook-as-project-documentation/) - how to use Storybook as living project documentation and a component playground.
`,
    'doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="SSG" />

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
    'yarn.lock': '',
    ...styleToolingFiles,
    '.prettierignore': 'node_modules\ndist\ncoverage\nstorybook-static\nconsumer\n',
    'assets.d.ts': "declare module '*.scss';\n",
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
import { Page, type PageProps } from '@p/components';

const props: PageProps = {
  content: 'This is a rendered page.',
};

export const App = () => <Page {...props} />;
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

CMS content adapter used by application workspaces before rendering the page.

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
    'workspaces/ssg/bin/build.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/ssg";
distdir="$PWD/dist/ssg";

NODE_ENV=production npx webpack --config $scriptdir/webpack.config.ts

yarn exec sass packages/components/page/styles.scss "$distdir/styles.css" --no-source-map --style=compressed
cp $scriptdir/package.json "$distdir/package.json"
npm pkg delete "type" --prefix "$distdir"
npm pkg delete "private" --prefix "$distdir"
`,
    'workspaces/ssg/bin/start.sh': `#!/usr/bin/env sh

set -e

scriptdir="$PWD/workspaces/ssg";
distdir="$PWD/dist/ssg";

mkdir -p "$distdir"
yarn exec sass packages/components/page/styles.scss "$distdir/styles.css" --no-source-map

PROJECT_CWD="$distdir" NODE_ENV=production LOG_LEVEL=info "$PWD/node_modules/.bin/tsx" $scriptdir/index.tsx
`,
    'workspaces/ssg/doc.mdx': `import { Meta, Markdown } from '@storybook/addon-docs/blocks';
import ReadMe from './README.md?raw';

<Meta title="Workspaces/SSG" />

<Markdown>{ReadMe}</Markdown>
`,
    'workspaces/ssg/README.md': `# @w/ssg

Static site generation workspace for the application.

The workspace renders CMS content into a static HTML file using shared service
and component packages. It is intentionally small: content comes from the
replaceable \`cms\` service adapter, UI comes from the shared \`Page\` component,
and page styles are compiled from the component package.

## Output

Running the workspace creates:

\`\`\`text
dist/ssg/static/index.html
\`\`\`

The generated document includes:

- document metadata from \`cms.getContent().title\`
- inline CSS compiled from \`packages/components/page/styles.scss\`
- server-rendered page markup from \`@p/components\`
- page body content from \`cms.getContent().body\`

## Rendering Flow

\`\`\`tsx
import { cms } from '@p/services/cms';
import { Page } from '@p/components';

const content = await cms.getContent();

renderToString(<Page content={content.body} />);
\`\`\`

\`index.tsx\` reads \`styles.css\` from the workspace runtime directory, creates the
\`static\` output folder, and writes a minified \`index.html\` file.

## Development

Start the SSG workspace directly:

\`\`\`bash
yarn start:ssg
\`\`\`

Build the bundled production artifact:

\`\`\`bash
yarn build:ssg
\`\`\`

Run the focused test for this workspace:

\`\`\`bash
yarn jest workspaces/ssg --runInBand --coverage=false
\`\`\`

## Package Boundaries

- \`@p/services/cms\` owns content loading and should remain replaceable.
- \`@p/components\` owns reusable SSR-friendly React components.
- \`@w/ssg\` owns the static rendering pipeline and output layout.

Keep the workspace free from direct CMS, browser, or deployment-host coupling so
the same rendering path can be reused by different static deployment targets.
`,
    'workspaces/ssg/webpack.config.ts': `import { path } from '@vyriy/path';
import { ssr, external } from '@vyriy/webpack-config';

export default ssr(
  '@w/ssg',
  {
    path: path('dist', 'ssg'),
    filename: 'index.js',
    library: { type: 'commonjs2' },
  },
  (config) => ({
    ...config,
    externals: [external({ allowlist: [/^@p/, /^@w/, /^@vyriy/] })],
  }),
);
`,
    'workspaces/ssg/package.json': JSON.stringify({
        name: '@w/ssg',
        type: 'module',
        private: true,
    }, null, 2) + '\n',
    'workspaces/ssg/index.tsx': `import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { script } from '@vyriy/script';
import { html, minify } from '@vyriy/html';
import { path } from '@vyriy/path';
import { html as renderHtml } from '@vyriy/render/html';

import { cms } from '@p/services/cms';
import { Page } from '@p/components';

void script(async () => {
  const content = await cms.getContent();

  mkdirSync(path('static'), { recursive: true });

  writeFileSync(
    path('static', 'index.html'),
    minify(
      html({
        htmlAttributes: 'lang="en"',
        title: \`<title>\${content.title}</title>\`,
        meta: '<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />',
        style: \`<style>\${readFileSync(path('styles.css'), 'utf8').trim()}</style>\`,
        body: renderHtml(<Page content={content.body} />),
      }),
    ),
  );
});
`,
    'workspaces/ssg/index.test.tsx': `import { describe, expect, it, jest } from '@jest/globals';

const getContentMock = jest.fn(() =>
  Promise.resolve({
    title: 'Sample Content',
    body: 'This is a sample content fetched from the CMS.',
  }),
);
let scriptPromise: Promise<void> | undefined;
const scriptMock = jest.fn((handler: () => Promise<void>) => {
  scriptPromise = handler();

  return scriptPromise;
});
const nodeFs = jest.requireActual<typeof import('node:fs')>('node:fs');
const mkdirSyncMock = jest.fn();
const readFileSyncMock = jest.fn<(path: string | URL, encoding: 'utf8') => string>(
  () => '.content { display: block; }',
);
const writeFileSyncMock = jest.fn();

jest.mock('node:fs', () => ({
  ...nodeFs,
  mkdirSync: mkdirSyncMock,
  readFileSync: readFileSyncMock,
  writeFileSync: writeFileSyncMock,
}));

jest.mock('@vyriy/script', () => ({
  script: scriptMock,
}));

jest.mock('@p/services/cms', () => ({
  cms: {
    getContent: getContentMock,
  },
}));

describe('workspaces/ssg/index.tsx', () => {
  it('generates a static index HTML file', async () => {
    await import('./index.js');
    await scriptPromise;

    expect(scriptMock).toHaveBeenCalledTimes(1);
    expect(readFileSyncMock).toHaveBeenCalledWith(expect.stringContaining('styles.css'), 'utf8');
    expect(getContentMock).toHaveBeenCalledTimes(1);
    expect(mkdirSyncMock).toHaveBeenCalledWith(expect.stringContaining('static'), {
      recursive: true,
    });
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining('static/index.html'),
      expect.stringContaining('<title>Sample Content</title>'),
    );

    const generatedHtml = writeFileSyncMock.mock.calls[0]?.[1] as string;

    expect(generatedHtml).toContain('<style>.content { display: block; }</style>');
    expect(generatedHtml).toContain('This is a sample content fetched from the CMS.');
  });
});
`,
});
